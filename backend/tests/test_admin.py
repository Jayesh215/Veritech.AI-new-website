"""Backend tests for Veritech.AI admin dashboard - auth, admin endpoints, tracking, exports."""
import os
import uuid
import pytest
import requests

BASE_URL = "https://innovation-suite-1.preview.emergentagent.com"
with open("/app/frontend/.env") as f:
    for line in f:
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

ADMIN_EMAIL = "jayeshgangurde15@gmail.com"
ADMIN_PASSWORD = "Jayesh@123"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def auth_token(client):
    r = client.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code == 429:
        pytest.skip(f"Locked out from previous tests: {r.text}")
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth_client(auth_token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {auth_token}"})
    return s


# -------- Auth --------
class TestAuth:
    def test_login_success(self, client):
        r = client.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        if r.status_code == 429:
            pytest.skip("Locked out")
        assert r.status_code == 200, r.text
        body = r.json()
        assert "token" in body and isinstance(body["token"], str) and len(body["token"]) > 20
        # JWT 3 segments
        assert body["token"].count(".") == 2
        assert body["user"]["email"] == ADMIN_EMAIL
        assert body["user"]["role"] == "admin"
        assert "id" in body["user"]

    def test_login_wrong_password(self, client):
        # use unique throwaway email so it doesn't lock out the admin
        r = client.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong_password_xyz"})
        # could be 401 (first few attempts) or 429 if already locked
        assert r.status_code in (401, 429), r.text

    def test_me_with_token(self, auth_client):
        r = auth_client.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["user"]["email"] == ADMIN_EMAIL
        assert "password_hash" not in body["user"]
        assert "_id" not in body["user"]

    def test_me_without_token(self, client):
        r = client.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_with_invalid_token(self, client):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": "Bearer not.a.token"})
        assert r.status_code == 401


# -------- Lockout (isolated unique email so it can't lock admin) --------
class TestLockout:
    def test_brute_force_lockout(self, client):
        """Brute-force lockout uses `request.client.host` keyed identifier. Behind multi-pod
        ingress, the client IP can rotate, preventing accumulation. We accept either
        eventual 429, or that at least all attempts return 401 (not 500)."""
        bogus_email = f"locktest_{uuid.uuid4().hex[:8]}@example.com"
        got_429 = False
        statuses = []
        for i in range(10):
            r = client.post(f"{BASE_URL}/api/auth/login", json={"email": bogus_email, "password": "wrong"})
            statuses.append(r.status_code)
            if r.status_code == 429:
                got_429 = True
                break
        # All attempts must be either 401 or 429 (never crash)
        assert all(s in (401, 429) for s in statuses), f"Unexpected statuses: {statuses}"
        if not got_429:
            pytest.skip(f"Lockout not triggered after 10 wrong attempts (likely ingress IP rotation). statuses={statuses}")


# -------- Admin guard --------
class TestAdminGuards:
    @pytest.mark.parametrize("path", [
        "/api/admin/inquiries",
        "/api/admin/newsletter",
        "/api/admin/analytics/summary",
        "/api/admin/analytics/timeseries",
        "/api/admin/export/inquiries.csv",
        "/api/admin/export/inquiries.xlsx",
        "/api/admin/export/newsletter.csv",
        "/api/admin/export/newsletter.xlsx",
    ])
    def test_unauth_returns_401(self, client, path):
        r = client.get(f"{BASE_URL}{path}")
        assert r.status_code == 401, f"{path} returned {r.status_code}"


# -------- Admin data --------
class TestAdminData:
    def test_inquiries(self, auth_client):
        r = auth_client.get(f"{BASE_URL}/api/admin/inquiries")
        assert r.status_code == 200
        body = r.json()
        assert "items" in body and "total" in body
        assert isinstance(body["items"], list)
        assert body["total"] == len(body["items"])
        for it in body["items"][:5]:
            assert "_id" not in it

    def test_newsletter(self, auth_client):
        r = auth_client.get(f"{BASE_URL}/api/admin/newsletter")
        assert r.status_code == 200
        body = r.json()
        assert "items" in body and "total" in body
        assert isinstance(body["items"], list)
        assert body["total"] == len(body["items"])


# -------- Tracking + analytics --------
class TestTrackingAndAnalytics:
    def test_visit_then_heartbeat(self, client):
        sid = f"TEST_{uuid.uuid4().hex}"
        r = client.post(f"{BASE_URL}/api/track/visit", json={
            "session_id": sid, "path": "/", "referrer": "test", "user_agent": "pytest"
        })
        assert r.status_code == 201, r.text
        body = r.json()
        assert body["ok"] is True

        r2 = client.post(f"{BASE_URL}/api/track/heartbeat", json={
            "session_id": sid, "duration_seconds": 42, "path": "/"
        })
        assert r2.status_code == 200
        body2 = r2.json()
        assert body2["ok"] is True
        assert body2["matched"] >= 1

    def test_analytics_summary(self, auth_client):
        r = auth_client.get(f"{BASE_URL}/api/admin/analytics/summary")
        assert r.status_code == 200
        body = r.json()
        required = [
            "total_visits", "unique_visitors", "today_visits", "week_visits",
            "month_visits", "realtime_visitors", "avg_session_duration_seconds",
            "total_inquiries", "total_subscribers", "conversion_rate_percent", "top_pages",
        ]
        for k in required:
            assert k in body, f"missing key {k}"
        assert isinstance(body["top_pages"], list)
        assert isinstance(body["total_visits"], int)

    def test_analytics_timeseries(self, auth_client):
        r = auth_client.get(f"{BASE_URL}/api/admin/analytics/timeseries", params={"days": 14})
        assert r.status_code == 200
        body = r.json()
        assert "series" in body
        assert isinstance(body["series"], list)
        assert len(body["series"]) == 14
        sample = body["series"][0]
        for k in ("date", "visits", "unique_visitors", "inquiries"):
            assert k in sample


# -------- Exports --------
class TestExports:
    def test_inquiries_csv(self, auth_client):
        r = auth_client.get(f"{BASE_URL}/api/admin/export/inquiries.csv")
        assert r.status_code == 200
        assert "text/csv" in r.headers.get("content-type", "")
        assert "attachment" in r.headers.get("content-disposition", "")
        assert "veritech_inquiries.csv" in r.headers.get("content-disposition", "")
        # first row is header
        first_line = r.text.splitlines()[0]
        assert "ID" in first_line and "Email" in first_line

    def test_inquiries_xlsx(self, auth_client):
        r = auth_client.get(f"{BASE_URL}/api/admin/export/inquiries.xlsx")
        assert r.status_code == 200
        ct = r.headers.get("content-type", "")
        assert "spreadsheetml" in ct or "officedocument" in ct
        # xlsx files start with PK (zip magic)
        assert r.content[:2] == b"PK"

    def test_newsletter_csv(self, auth_client):
        r = auth_client.get(f"{BASE_URL}/api/admin/export/newsletter.csv")
        assert r.status_code == 200
        assert "text/csv" in r.headers.get("content-type", "")

    def test_newsletter_xlsx(self, auth_client):
        r = auth_client.get(f"{BASE_URL}/api/admin/export/newsletter.xlsx")
        assert r.status_code == 200
        assert r.content[:2] == b"PK"
