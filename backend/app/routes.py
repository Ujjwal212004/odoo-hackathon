"""AssetFlow API routes — all endpoints under /api/v1."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Query, Request

from app.dependencies import client_ip, get_current_user, require_permissions
from app.models import AssetStatus
from app.schemas import (
    AIChatRequest,
    AIResponse,
    AllocationCreate,
    AssetCreate,
    AssetUpdate,
    AuditCycleCreate,
    BookingCreate,
    CategoryCreate,
    DepartmentCreate,
    LoginRequest,
    MaintenanceCreate,
    Message,
    RefreshRequest,
    TokenResponse,
    TransferCreate,
    UserCreate,
)
from app.services import (
    ai_generate,
    asset_list,
    authenticate,
    create_allocation,
    create_asset,
    create_audit_cycle,
    create_booking,
    create_category,
    create_department,
    create_maintenance,
    create_transfer,
    dashboard,
    generate_report,
    list_activity,
    list_allocations,
    list_audit_items,
    list_audits,
    list_bookings,
    list_categories,
    list_departments,
    list_maintenance,
    list_notifications,
    log_activity,
    notify,
    public_user,
    refresh_tokens,
    register_user,
    soft_delete_asset,
    update_asset,
    approve_allocation,
    complete_allocation,
    resolve_maintenance,
    mark_notification_read,
)
from app.database import get_store


router = APIRouter(prefix="/api/v1")


# ── Health ──────────────────────────────────────────────────────────────

@router.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok"}


# ── Auth ────────────────────────────────────────────────────────────────

@router.post("/auth/register", status_code=201, tags=["auth"])
def register(payload: UserCreate, request: Request) -> dict[str, Any]:
    user = register_user(payload)
    store = get_store()
    actor = {"_id": user["id"], **user}
    log_activity(store, actor, "auth.registered", "user", user["id"], ip_address=client_ip(request))
    return user


@router.post("/auth/login", tags=["auth"])
def login(payload: LoginRequest, request: Request) -> TokenResponse:
    user, access_token, refresh_token = authenticate(str(payload.email), payload.password)
    store = get_store()
    log_activity(store, {"_id": user["id"], **user}, "auth.login", "user", user["id"], ip_address=client_ip(request))
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/auth/refresh", tags=["auth"])
def refresh(payload: RefreshRequest) -> TokenResponse:
    _, access_token, refresh_token = refresh_tokens(payload.refresh_token)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.get("/auth/me", tags=["auth"])
def me(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    store = get_store()
    return public_user(store, user)


# ── Departments ─────────────────────────────────────────────────────────

@router.post("/departments", status_code=201, tags=["departments"])
def add_department(
    payload: DepartmentCreate,
    user: dict[str, Any] = Depends(require_permissions("departments:write")),
) -> dict[str, Any]:
    return create_department(payload, user)


@router.get("/departments", tags=["departments"])
def list_departments_endpoint(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    _: dict[str, Any] = Depends(require_permissions("departments:read")),
) -> dict[str, Any]:
    return list_departments(limit, offset)


# ── Categories ──────────────────────────────────────────────────────────

@router.post("/categories", status_code=201, tags=["categories"])
def add_category(
    payload: CategoryCreate,
    user: dict[str, Any] = Depends(require_permissions("categories:write")),
) -> dict[str, Any]:
    return create_category(payload, user)


@router.get("/categories", tags=["categories"])
def list_categories_endpoint(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    _: dict[str, Any] = Depends(require_permissions("categories:read")),
) -> dict[str, Any]:
    return list_categories(limit, offset)


# ── Assets ──────────────────────────────────────────────────────────────

@router.post("/assets", status_code=201, tags=["assets"])
def add_asset(
    payload: AssetCreate,
    user: dict[str, Any] = Depends(require_permissions("assets:write")),
) -> dict[str, Any]:
    return create_asset(payload, user)


@router.get("/assets", tags=["assets"])
def list_assets(
    search: str | None = None,
    status_filter: AssetStatus | None = Query(default=None, alias="status"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    _: dict[str, Any] = Depends(require_permissions("assets:read")),
) -> dict[str, Any]:
    return asset_list(limit, offset, search, status_filter)


@router.get("/assets/{asset_id}", tags=["assets"])
def get_asset(
    asset_id: str,
    _: dict[str, Any] = Depends(require_permissions("assets:read")),
) -> dict[str, Any]:
    from app.services import get_required, public_asset
    store = get_store()
    doc = get_required(store.assets, asset_id, "Asset")
    return public_asset(store, doc)


@router.patch("/assets/{asset_id}", tags=["assets"])
def patch_asset(
    asset_id: str,
    payload: AssetUpdate,
    user: dict[str, Any] = Depends(require_permissions("assets:write")),
) -> dict[str, Any]:
    return update_asset(asset_id, payload, user)


@router.delete("/assets/{asset_id}", tags=["assets"])
def delete_asset(
    asset_id: str,
    user: dict[str, Any] = Depends(require_permissions("assets:write")),
) -> Message:
    soft_delete_asset(asset_id, user)
    return Message(message="Asset deleted")


# ── Allocations ─────────────────────────────────────────────────────────

@router.post("/allocations", status_code=201, tags=["allocations"])
def add_allocation(
    payload: AllocationCreate,
    user: dict[str, Any] = Depends(require_permissions("allocations:write")),
) -> dict[str, Any]:
    return create_allocation(payload, user)


@router.get("/allocations", tags=["allocations"])
def list_allocations_endpoint(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    _: dict[str, Any] = Depends(require_permissions("assets:read")),
) -> dict[str, Any]:
    return list_allocations(limit, offset)


@router.patch("/allocations/{allocation_id}/approve", tags=["allocations"])
def approve_allocation_endpoint(
    allocation_id: str,
    user: dict[str, Any] = Depends(require_permissions("allocations:write")),
) -> dict[str, Any]:
    return approve_allocation(allocation_id, user)


@router.patch("/allocations/{allocation_id}/complete", tags=["allocations"])
def complete_allocation_endpoint(
    allocation_id: str,
    user: dict[str, Any] = Depends(require_permissions("allocations:write")),
) -> dict[str, Any]:
    return complete_allocation(allocation_id, user)


# ── Transfers ───────────────────────────────────────────────────────────

@router.post("/transfers", status_code=201, tags=["transfers"])
def add_transfer(
    payload: TransferCreate,
    user: dict[str, Any] = Depends(require_permissions("transfers:write")),
) -> dict[str, Any]:
    return create_transfer(payload, user)


@router.get("/transfers", tags=["transfers"])
def list_transfers_endpoint(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    _: dict[str, Any] = Depends(require_permissions("assets:read")),
) -> dict[str, Any]:
    return list_transfers(limit, offset)


# ── Bookings ────────────────────────────────────────────────────────────

@router.post("/bookings", status_code=201, tags=["bookings"])
def add_booking(
    payload: BookingCreate,
    user: dict[str, Any] = Depends(require_permissions("bookings:write")),
) -> dict[str, Any]:
    return create_booking(payload, user)


@router.get("/bookings", tags=["bookings"])
def list_bookings_endpoint(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    _: dict[str, Any] = Depends(require_permissions("assets:read")),
) -> dict[str, Any]:
    return list_bookings(limit, offset)


# ── Maintenance ─────────────────────────────────────────────────────────

@router.post("/maintenance", status_code=201, tags=["maintenance"])
def add_maintenance(
    payload: MaintenanceCreate,
    user: dict[str, Any] = Depends(require_permissions("maintenance:write")),
) -> dict[str, Any]:
    return create_maintenance(payload, user)


@router.get("/maintenance", tags=["maintenance"])
def list_maintenance_endpoint(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    _: dict[str, Any] = Depends(require_permissions("assets:read")),
) -> dict[str, Any]:
    return list_maintenance(limit, offset)


@router.patch("/maintenance/{maintenance_id}/resolve", tags=["maintenance"])
def resolve_maintenance_endpoint(
    maintenance_id: str,
    resolution: str = Query(..., min_length=5),
    user: dict[str, Any] = Depends(require_permissions("maintenance:write")),
) -> dict[str, Any]:
    return resolve_maintenance(maintenance_id, resolution, user)


# ── Audits ──────────────────────────────────────────────────────────────

@router.post("/audits", status_code=201, tags=["audits"])
def add_audit(
    payload: AuditCycleCreate,
    user: dict[str, Any] = Depends(require_permissions("audits:write")),
) -> dict[str, Any]:
    return create_audit_cycle(payload, user)


@router.get("/audits", tags=["audits"])
def list_audits_endpoint(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    _: dict[str, Any] = Depends(require_permissions("assets:read")),
) -> dict[str, Any]:
    return list_audits(limit, offset)


@router.get("/audits/{audit_id}/items", tags=["audits"])
def list_audit_items_endpoint(
    audit_id: str,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    _: dict[str, Any] = Depends(require_permissions("assets:read")),
) -> dict[str, Any]:
    return list_audit_items(audit_id, limit, offset)


# ── Dashboard & Reports ────────────────────────────────────────────────

@router.get("/dashboard", tags=["dashboard"])
def dashboard_summary(
    _: dict[str, Any] = Depends(require_permissions("reports:read")),
) -> dict[str, Any]:
    return dashboard()


@router.post("/reports/{report_type}", tags=["reports"])
def create_report(
    report_type: str,
    user: dict[str, Any] = Depends(require_permissions("reports:read")),
) -> dict[str, Any]:
    return generate_report(report_type, user)


# ── Notifications ───────────────────────────────────────────────────────

@router.get("/notifications", tags=["notifications"])
def list_notifications_endpoint(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    user: dict[str, Any] = Depends(require_permissions("notifications:read")),
) -> dict[str, Any]:
    return list_notifications(user["_id"], limit, offset)


@router.patch("/notifications/{notification_id}/read", tags=["notifications"])
def mark_notification_read_endpoint(
    notification_id: str,
    user: dict[str, Any] = Depends(require_permissions("notifications:read")),
) -> Message:
    mark_notification_read(notification_id, user["_id"])
    return Message(message="Notification marked as read")


# ── Activity Logs ───────────────────────────────────────────────────────

@router.get("/activity-logs", tags=["activity"])
def list_activity_endpoint(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    _: dict[str, Any] = Depends(require_permissions("activity:read")),
) -> dict[str, Any]:
    return list_activity(limit, offset)


# ── AI Features ─────────────────────────────────────────────────────────

@router.post("/ai/chat", tags=["ai"])
async def ai_chat(
    payload: AIChatRequest,
    user: dict[str, Any] = Depends(require_permissions("ai:use")),
) -> AIResponse:
    return await ai_generate("chat", payload.message, user, payload.context)


@router.post("/ai/report-summary", tags=["ai"])
async def ai_report_summary(
    payload: AIChatRequest,
    user: dict[str, Any] = Depends(require_permissions("ai:use")),
) -> AIResponse:
    context = {"dashboard": dashboard(), **(payload.context or {})}
    return await ai_generate("report_summary", payload.message, user, context)


@router.post("/ai/maintenance-prediction", tags=["ai"])
async def ai_maintenance_prediction(
    payload: AIChatRequest,
    user: dict[str, Any] = Depends(require_permissions("ai:use")),
) -> AIResponse:
    return await ai_generate("maintenance_prediction", payload.message, user, payload.context)


@router.post("/ai/asset-recommendation", tags=["ai"])
async def ai_asset_recommendation(
    payload: AIChatRequest,
    user: dict[str, Any] = Depends(require_permissions("ai:use")),
) -> AIResponse:
    return await ai_generate("asset_recommendation", payload.message, user, payload.context)
