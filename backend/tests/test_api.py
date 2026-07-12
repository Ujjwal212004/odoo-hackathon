"""AssetFlow API smoke tests — runs against mongomock."""

import os
import sys
from pathlib import Path

os.environ["ENVIRONMENT"] = "test"
os.environ["MONGO_USE_MOCK"] = "true"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-with-enough-length"

sys.path.append(str(Path(__file__).resolve().parents[1]))

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.database import get_store  # noqa: E402
from app.main import create_app  # noqa: E402


@pytest.fixture(scope="module")
def client() -> TestClient:
    get_store.cache_clear()
    with TestClient(create_app()) as test_client:
        yield test_client


def auth_headers(client: TestClient) -> dict[str, str]:
    user = {"email": "admin@example.com", "full_name": "Admin User", "password": "strongpassword"}
    client.post("/api/v1/auth/register", json=user)
    response = client.post("/api/v1/auth/login", json={"email": user["email"], "password": user["password"]})
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def test_health(client: TestClient) -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_register_login_and_me(client: TestClient) -> None:
    headers = auth_headers(client)
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@example.com"
    assert data["role"]["name"] == "admin"


def test_department_crud(client: TestClient) -> None:
    headers = auth_headers(client)
    response = client.post("/api/v1/departments", json={"name": "Engineering", "code": "ENG"}, headers=headers)
    assert response.status_code == 201
    assert response.json()["name"] == "Engineering"
    listed = client.get("/api/v1/departments", headers=headers)
    assert listed.status_code == 200
    assert listed.json()["total"] >= 1


def test_category_crud(client: TestClient) -> None:
    headers = auth_headers(client)
    response = client.post("/api/v1/categories", json={"name": "TestCat", "description": "Test"}, headers=headers)
    assert response.status_code in {201, 409}
    listed = client.get("/api/v1/categories", headers=headers)
    assert listed.status_code == 200
    assert listed.json()["total"] >= 1


def test_asset_lifecycle(client: TestClient) -> None:
    headers = auth_headers(client)
    categories = client.get("/api/v1/categories", headers=headers).json()["items"]
    category_id = categories[0]["id"]
    asset = client.post(
        "/api/v1/assets",
        json={"tag": "AST-TEST-1", "name": "MacBook Pro", "category_id": category_id},
        headers=headers,
    )
    assert asset.status_code == 201
    asset_id = asset.json()["id"]

    listed = client.get("/api/v1/assets?search=MacBook", headers=headers)
    assert listed.status_code == 200
    assert listed.json()["total"] >= 1

    detail = client.get(f"/api/v1/assets/{asset_id}", headers=headers)
    assert detail.status_code == 200
    assert detail.json()["tag"] == "AST-TEST-1"

    patched = client.patch(f"/api/v1/assets/{asset_id}", json={"location": "NYC"}, headers=headers)
    assert patched.status_code == 200

    deleted = client.delete(f"/api/v1/assets/{asset_id}", headers=headers)
    assert deleted.status_code == 200


def test_dashboard(client: TestClient) -> None:
    headers = auth_headers(client)
    response = client.get("/api/v1/dashboard", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_assets" in data
    assert "departments" in data


def test_ai_fallback_without_key(client: TestClient) -> None:
    headers = auth_headers(client)
    response = client.post("/api/v1/ai/chat", json={"message": "Which asset should I book?"}, headers=headers)
    assert response.status_code == 200
    assert response.json()["fallback"] is True


def test_notifications_and_activity(client: TestClient) -> None:
    headers = auth_headers(client)
    notifications = client.get("/api/v1/notifications", headers=headers)
    assert notifications.status_code == 200

    activity = client.get("/api/v1/activity-logs", headers=headers)
    assert activity.status_code == 200
    assert activity.json()["total"] >= 1


def test_report_generation(client: TestClient) -> None:
    headers = auth_headers(client)
    response = client.post("/api/v1/reports/dashboard", headers=headers)
    assert response.status_code == 200
    assert response.json()["report_type"] == "dashboard"


def test_token_refresh(client: TestClient) -> None:
    user = {"email": "refresh@example.com", "full_name": "Refresh User", "password": "strongpassword"}
    client.post("/api/v1/auth/register", json=user)
    login = client.post("/api/v1/auth/login", json={"email": user["email"], "password": user["password"]})
    assert login.status_code == 200
    refresh_token = login.json()["refresh_token"]
    response = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_unauthorized_access(client: TestClient) -> None:
    response = client.get("/api/v1/assets")
    assert response.status_code in {401, 403}
