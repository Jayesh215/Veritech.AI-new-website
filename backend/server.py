from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import io
import csv
import logging
import uuid
import bcrypt
import jwt as pyjwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, status
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from openpyxl import Workbook


# -------- DB --------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]


# -------- App --------
app = FastAPI(title="Veritech.AI API")
api_router = APIRouter(prefix="/api")
auth_scheme = HTTPBearer(auto_error=False)


# -------- Constants --------
JWT_ALGORITHM = "HS256"
JWT_TTL_DAYS = 7
LOGIN_MAX_ATTEMPTS = 5
LOGIN_LOCK_MINUTES = 15


# -------- Models --------
class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default=None, max_length=160)
    service: Optional[str] = Field(default=None, max_length=120)
    message: str = Field(min_length=1, max_length=4000)


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = None
    service: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class NewsletterCreate(BaseModel):
    email: EmailStr


class Newsletter(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class VisitStart(BaseModel):
    session_id: str
    path: str = "/"
    referrer: Optional[str] = None
    user_agent: Optional[str] = None


class VisitHeartbeat(BaseModel):
    session_id: str
    duration_seconds: int = 0
    path: Optional[str] = None


# -------- Auth helpers --------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_jwt(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_TTL_DAYS),
        "iat": datetime.now(timezone.utc),
    }
    return pyjwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(auth_scheme)) -> dict:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = pyjwt.decode(creds.credentials, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.admin_users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# -------- Routes: public --------
@api_router.get("/")
async def root():
    return {"service": "Veritech.AI API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy"}


@api_router.post("/contact", response_model=Contact, status_code=201)
async def submit_contact(payload: ContactCreate):
    obj = Contact(**payload.model_dump())
    doc = obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.contacts.insert_one(doc)
    return obj


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts():
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for it in items:
        if isinstance(it.get("created_at"), str):
            it["created_at"] = datetime.fromisoformat(it["created_at"])
    return items


@api_router.post("/newsletter", response_model=Newsletter, status_code=201)
async def subscribe_newsletter(payload: NewsletterCreate):
    existing = await db.newsletter.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        if isinstance(existing.get("created_at"), str):
            existing["created_at"] = datetime.fromisoformat(existing["created_at"])
        return Newsletter(**existing)
    obj = Newsletter(email=payload.email)
    doc = obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.newsletter.insert_one(doc)
    return obj


# -------- Routes: tracking (public) --------
@api_router.post("/track/visit", status_code=201)
async def track_visit(payload: VisitStart, request: Request):
    now = datetime.now(timezone.utc)
    ip = request.client.host if request.client else None
    doc = {
        "id": str(uuid.uuid4()),
        "session_id": payload.session_id,
        "path": payload.path or "/",
        "referrer": payload.referrer,
        "user_agent": payload.user_agent or request.headers.get("user-agent"),
        "ip": ip,
        "started_at": now.isoformat(),
        "last_seen_at": now.isoformat(),
        "duration_seconds": 0,
    }
    await db.visits.insert_one(doc)
    return {"ok": True, "id": doc["id"]}


@api_router.post("/track/heartbeat")
async def track_heartbeat(payload: VisitHeartbeat):
    now = datetime.now(timezone.utc).isoformat()
    update = {"last_seen_at": now, "duration_seconds": max(0, int(payload.duration_seconds))}
    if payload.path:
        update["path"] = payload.path
    result = await db.visits.update_one(
        {"session_id": payload.session_id},
        {"$set": update},
        upsert=False,
    )
    return {"ok": True, "matched": result.matched_count}


# -------- Routes: auth --------
@api_router.post("/auth/login")
async def login(payload: LoginRequest, request: Request):
    ip = (request.client.host if request.client else "unknown")
    key = f"{ip}:{payload.email.lower()}"
    now = datetime.now(timezone.utc)

    # brute-force lockout check
    attempt = await db.login_attempts.find_one({"identifier": key}, {"_id": 0})
    if attempt and attempt.get("locked_until"):
        locked_until = attempt["locked_until"]
        if isinstance(locked_until, str):
            locked_until = datetime.fromisoformat(locked_until)
        if locked_until > now:
            mins = int((locked_until - now).total_seconds() // 60) + 1
            raise HTTPException(status_code=429, detail=f"Too many attempts. Try again in {mins} min.")

    user = await db.admin_users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        # record failed attempt
        new_count = (attempt.get("count", 0) if attempt else 0) + 1
        locked = None
        if new_count >= LOGIN_MAX_ATTEMPTS:
            locked = (now + timedelta(minutes=LOGIN_LOCK_MINUTES)).isoformat()
        await db.login_attempts.update_one(
            {"identifier": key},
            {"$set": {"identifier": key, "count": new_count, "locked_until": locked, "updated_at": now.isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    # success: clear attempts
    await db.login_attempts.delete_one({"identifier": key})
    token = create_jwt(user["id"], user["email"])
    return {
        "token": token,
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": "admin"},
    }


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_admin)):
    return {"user": user}


# -------- Admin: data --------
@api_router.get("/admin/inquiries")
async def admin_inquiries(_: dict = Depends(get_current_admin)):
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return {"items": items, "total": len(items)}


@api_router.get("/admin/newsletter")
async def admin_newsletter(_: dict = Depends(get_current_admin)):
    items = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return {"items": items, "total": len(items)}


# -------- Admin: analytics --------
def _parse_dt(value) -> Optional[datetime]:
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value)
        except Exception:
            return None
    return None


@api_router.get("/admin/analytics/summary")
async def analytics_summary(_: dict = Depends(get_current_admin)):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=7)
    month_start = today_start - timedelta(days=30)
    realtime_cutoff = now - timedelta(minutes=5)

    visits = await db.visits.find({}, {"_id": 0}).to_list(50000)
    contacts_count = await db.contacts.count_documents({})
    newsletter_count = await db.newsletter.count_documents({})

    total_visits = len(visits)
    unique_sessions = len({v.get("session_id") for v in visits if v.get("session_id")})

    today_visits = week_visits = month_visits = 0
    realtime = 0
    durations = []
    pages_counter = {}
    for v in visits:
        started = _parse_dt(v.get("started_at"))
        last_seen = _parse_dt(v.get("last_seen_at"))
        if started:
            if started >= today_start:
                today_visits += 1
            if started >= week_start:
                week_visits += 1
            if started >= month_start:
                month_visits += 1
        if last_seen and last_seen >= realtime_cutoff:
            realtime += 1
        dur = v.get("duration_seconds") or 0
        if dur > 0:
            durations.append(int(dur))
        path = v.get("path") or "/"
        pages_counter[path] = pages_counter.get(path, 0) + 1

    avg_duration = (sum(durations) // len(durations)) if durations else 0
    top_pages = sorted(
        [{"path": k, "visits": v} for k, v in pages_counter.items()],
        key=lambda x: x["visits"], reverse=True,
    )[:8]

    conversion_rate = (contacts_count / unique_sessions * 100) if unique_sessions else 0.0

    return {
        "total_visits": total_visits,
        "unique_visitors": unique_sessions,
        "today_visits": today_visits,
        "week_visits": week_visits,
        "month_visits": month_visits,
        "realtime_visitors": realtime,
        "avg_session_duration_seconds": avg_duration,
        "total_inquiries": contacts_count,
        "total_subscribers": newsletter_count,
        "conversion_rate_percent": round(conversion_rate, 2),
        "top_pages": top_pages,
    }


@api_router.get("/admin/analytics/timeseries")
async def analytics_timeseries(days: int = 14, _: dict = Depends(get_current_admin)):
    days = max(1, min(90, days))
    now = datetime.now(timezone.utc)
    start = (now - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)

    visits = await db.visits.find({}, {"_id": 0, "started_at": 1, "session_id": 1}).to_list(50000)
    contacts = await db.contacts.find({}, {"_id": 0, "created_at": 1}).to_list(20000)

    series = {}
    for i in range(days):
        d = (start + timedelta(days=i)).strftime("%Y-%m-%d")
        series[d] = {"date": d, "visits": 0, "unique_visitors": 0, "inquiries": 0, "_sessions": set()}

    for v in visits:
        dt = _parse_dt(v.get("started_at"))
        if not dt:
            continue
        key = dt.strftime("%Y-%m-%d")
        if key in series:
            series[key]["visits"] += 1
            sid = v.get("session_id")
            if sid:
                series[key]["_sessions"].add(sid)

    for c in contacts:
        dt = _parse_dt(c.get("created_at"))
        if not dt:
            continue
        key = dt.strftime("%Y-%m-%d")
        if key in series:
            series[key]["inquiries"] += 1

    out = []
    for k in sorted(series.keys()):
        row = series[k]
        row["unique_visitors"] = len(row.pop("_sessions"))
        out.append(row)
    return {"series": out}


# -------- Admin: exports --------
def _rows_for_inquiries(items):
    yield ["ID", "Name", "Email", "Company", "Service", "Message", "Created At"]
    for it in items:
        yield [
            it.get("id", ""),
            it.get("name", ""),
            it.get("email", ""),
            it.get("company", "") or "",
            it.get("service", "") or "",
            it.get("message", ""),
            it.get("created_at", ""),
        ]


def _rows_for_newsletter(items):
    yield ["ID", "Email", "Created At"]
    for it in items:
        yield [it.get("id", ""), it.get("email", ""), it.get("created_at", "")]


def _csv_response(rows_iter, filename: str) -> StreamingResponse:
    buf = io.StringIO()
    w = csv.writer(buf)
    for r in rows_iter:
        w.writerow(r)
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


def _xlsx_response(rows_iter, filename: str, sheet_name: str) -> StreamingResponse:
    wb = Workbook()
    ws = wb.active
    ws.title = sheet_name[:30]
    for r in rows_iter:
        ws.append(r)
    out = io.BytesIO()
    wb.save(out)
    out.seek(0)
    return StreamingResponse(
        out,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@api_router.get("/admin/export/inquiries.csv")
async def export_inquiries_csv(_: dict = Depends(get_current_admin)):
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(50000)
    return _csv_response(_rows_for_inquiries(items), "veritech_inquiries.csv")


@api_router.get("/admin/export/inquiries.xlsx")
async def export_inquiries_xlsx(_: dict = Depends(get_current_admin)):
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(50000)
    return _xlsx_response(_rows_for_inquiries(items), "veritech_inquiries.xlsx", "Inquiries")


@api_router.get("/admin/export/newsletter.csv")
async def export_newsletter_csv(_: dict = Depends(get_current_admin)):
    items = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(50000)
    return _csv_response(_rows_for_newsletter(items), "veritech_newsletter.csv")


@api_router.get("/admin/export/newsletter.xlsx")
async def export_newsletter_xlsx(_: dict = Depends(get_current_admin)):
    items = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(50000)
    return _xlsx_response(_rows_for_newsletter(items), "veritech_newsletter.xlsx", "Subscribers")


# -------- Startup: indexes + seed --------
@app.on_event("startup")
async def startup_event():
    try:
        await db.admin_users.create_index("email", unique=True)
        await db.newsletter.create_index("email", unique=True)
        await db.login_attempts.create_index("identifier", unique=True)
        await db.visits.create_index("session_id")
        await db.visits.create_index("started_at")
        await db.contacts.create_index("created_at")
    except Exception as e:
        logging.warning(f"Index creation issue: {e}")

    admin_email = os.environ.get("ADMIN_EMAIL", "").lower().strip()
    admin_pw = os.environ.get("ADMIN_PASSWORD", "")
    if not admin_email or not admin_pw:
        logging.warning("ADMIN_EMAIL / ADMIN_PASSWORD missing — skipping admin seed.")
        return

    existing = await db.admin_users.find_one({"email": admin_email})
    if existing is None:
        await db.admin_users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_pw),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logging.info(f"Seeded admin user: {admin_email}")
    elif not verify_password(admin_pw, existing["password_hash"]):
        await db.admin_users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_pw)}},
        )
        logging.info(f"Updated admin password for: {admin_email}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
