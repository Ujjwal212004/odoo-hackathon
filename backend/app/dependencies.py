"""FastAPI dependency injection for authentication, RBAC, and request context."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database import MongoStore, get_store
from app.security import decode_token


bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> dict[str, Any]:
    """Decode JWT and return the matching user document from MongoDB."""
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    try:
        payload = decode_token(credentials.credentials)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc
    if payload.get("typ") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    store = get_store()
    user_doc = store.users.find_one({"_id": payload["sub"], "deleted_at": None})
    if user_doc is None or not user_doc.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive or missing user")
    return user_doc


def _resolve_role(user_doc: dict[str, Any]) -> dict[str, Any]:
    """Look up the user's role document."""
    store = get_store()
    role_doc = store.roles.find_one({"_id": user_doc.get("role_id")})
    if role_doc is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Role not configured")
    return role_doc


def require_permissions(*required: str) -> Callable[..., dict[str, Any]]:
    """Return a FastAPI dependency that enforces permission codes."""

    def dependency(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
        role_doc = _resolve_role(user)
        if role_doc["name"] == "admin":
            return user
        granted = set(role_doc.get("permission_codes", []))
        missing = set(required) - granted
        if missing:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user

    return dependency


def client_ip(request: Request) -> str:
    """Extract the originating client IP from the request."""
    forwarded = request.headers.get("x-forwarded-for")
    return forwarded.split(",", 1)[0].strip() if forwarded else request.client.host if request.client else "unknown"
