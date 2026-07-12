import os
import sys
from pathlib import Path

os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-with-enough-length"

sys.path.append(str(Path(__file__).resolve().parents[1]))

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.main import create_app  # noqa: E402


@pytest.fixture(scope="module")
def client() -> TestClient:
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


def test_register_login_and_asset_flow(client: TestClient) -> None:
    headers = auth_headers(client)
    department = client.post("/api/v1/departments", json={"name": "Engineering", "code": "ENG"}, headers=headers)
    assert department.status_code == 201
    category = client.post("/api/v1/categories", json={"name": "Laptop", "description": "Computers"}, headers=headers)
    assert category.status_code in {201, 409}
    categories = client.get("/api/v1/categories", headers=headers).json()["items"]
    category_id = next(item["id"] for item in categories if item["name"] == "Laptop")
    asset = client.post(
        "/api/v1/assets",
        json={"tag": "AST-1", "name": "MacBook Pro", "category_id": category_id, "department_id": department.json()["id"]},
        headers=headers,
    )
    assert asset.status_code == 201
    listed = client.get("/api/v1/assets?search=MacBook", headers=headers)
    assert listed.status_code == 200
    assert listed.json()["total"] >= 1


def test_ai_fallback_without_key(client: TestClient) -> None:
    headers = auth_headers(client)
    response = client.post("/api/v1/ai/chat", json={"message": "Which asset should I book?"}, headers=headers)
    assert response.status_code == 200
    assert response.json()["fallback"] is True
