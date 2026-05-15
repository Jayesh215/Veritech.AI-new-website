"""Backend API tests for Veritech.AI"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://innovation-suite-1.preview.emergentagent.com").rstrip("/")
# Override with frontend .env which is the public URL
with open("/app/frontend/.env") as f:
    for line in f:
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().rstrip("/")


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# -------- Health --------
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("service") == "Veritech.AI API"
        assert data.get("status") == "ok"

    def test_health(self, client):
        r = client.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        assert r.json().get("status") == "healthy"


# -------- Contact --------
class TestContact:
    def test_create_contact_and_list(self, client):
        unique = f"TEST_{uuid.uuid4().hex[:8]}"
        payload = {
            "name": f"Test User {unique}",
            "email": f"{unique}@example.com",
            "company": "TestCo",
            "service": "AI Development",
            "message": f"Hello from {unique}",
        }
        r = client.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 201, r.text
        body = r.json()
        assert body["name"] == payload["name"]
        assert body["email"] == payload["email"]
        assert body["company"] == "TestCo"
        assert body["service"] == "AI Development"
        assert body["message"] == payload["message"]
        assert "id" in body and len(body["id"]) > 0
        assert "created_at" in body
        assert "_id" not in body

        # Verify list returns it
        r2 = client.get(f"{BASE_URL}/api/contact")
        assert r2.status_code == 200
        items = r2.json()
        assert isinstance(items, list)
        assert any(it["email"] == payload["email"] for it in items)
        # No _id leakage
        for it in items:
            assert "_id" not in it

    def test_contact_minimal_required_fields(self, client):
        unique = f"TEST_{uuid.uuid4().hex[:8]}"
        payload = {
            "name": "Min User",
            "email": f"{unique}@example.com",
            "message": "Minimal message",
        }
        r = client.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 201
        body = r.json()
        assert body["company"] is None
        assert body["service"] is None

    def test_contact_rejects_invalid_email(self, client):
        r = client.post(f"{BASE_URL}/api/contact", json={
            "name": "Bad",
            "email": "not-an-email",
            "message": "hi",
        })
        assert r.status_code == 422

    def test_contact_rejects_missing_fields(self, client):
        r = client.post(f"{BASE_URL}/api/contact", json={"email": "a@b.com"})
        assert r.status_code == 422

    def test_contact_list_sorted_desc(self, client):
        r = client.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 200
        items = r.json()
        if len(items) >= 2:
            for i in range(len(items) - 1):
                assert items[i]["created_at"] >= items[i + 1]["created_at"]


# -------- Newsletter --------
class TestNewsletter:
    def test_subscribe(self, client):
        unique = f"TEST_news_{uuid.uuid4().hex[:8]}"
        email = f"{unique}@example.com"
        r = client.post(f"{BASE_URL}/api/newsletter", json={"email": email})
        assert r.status_code == 201, r.text
        body = r.json()
        assert body["email"] == email
        assert "id" in body
        assert "_id" not in body
        first_id = body["id"]

        # dedupe
        r2 = client.post(f"{BASE_URL}/api/newsletter", json={"email": email})
        assert r2.status_code == 201
        body2 = r2.json()
        assert body2["email"] == email
        assert body2["id"] == first_id  # same record returned

    def test_newsletter_rejects_invalid_email(self, client):
        r = client.post(f"{BASE_URL}/api/newsletter", json={"email": "invalid"})
        assert r.status_code == 422
