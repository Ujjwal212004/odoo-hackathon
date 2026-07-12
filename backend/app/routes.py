from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import client_ip, get_current_user, require_permissions
from app.models import (
    ActivityLog,
    Allocation,
    Asset,
    AssetCategory,
    AssetStatus,
    AuditCycle,
    AuditItem,
    Booking,
    Department,
    Maintenance,
    Notification,
    Transfer,
    User,
)
from app.schemas import (
    AIChatRequest,
    AIResponse,
    AllocationCreate,
    AllocationRead,
    AssetCreate,
    AssetRead,
    AssetUpdate,
    AuditCycleCreate,
    AuditCycleRead,
    AuditItemRead,
    BookingCreate,
    BookingRead,
    CategoryCreate,
    CategoryRead,
    DepartmentCreate,
    DepartmentRead,
    LoginRequest,
    MaintenanceCreate,
    MaintenanceRead,
    Message,
    NotificationRead,
    Page,
    RefreshRequest,
    TokenResponse,
    TransferCreate,
    TransferRead,
    UserCreate,
    UserRead,
)
from app.services import (
    activity,
    ai_generate,
    asset_query,
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
    paginate,
    refresh_tokens,
    register_user,
    update_asset,
)


router = APIRouter(prefix="/api/v1")


@router.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/auth/register", response_model=UserRead, status_code=status.HTTP_201_CREATED, tags=["auth"])
def register(payload: UserCreate, request: Request, db: Session = Depends(get_db)) -> User:
    user = register_user(db, payload)
    activity(db, user, "auth.registered", "user", user.id, ip_address=client_ip(request))
    db.commit()
    return user


@router.post("/auth/login", response_model=TokenResponse, tags=["auth"])
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)) -> TokenResponse:
    user, access_token, refresh_token = authenticate(db, str(payload.email), payload.password)
    activity(db, user, "auth.login", "user", user.id, ip_address=client_ip(request))
    db.commit()
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/auth/refresh", response_model=TokenResponse, tags=["auth"])
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)) -> TokenResponse:
    _, access_token, refresh_token = refresh_tokens(db, payload.refresh_token)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.get("/auth/me", response_model=UserRead, tags=["auth"])
def me(user: User = Depends(get_current_user)) -> User:
    return user


@router.post("/departments", response_model=DepartmentRead, status_code=status.HTTP_201_CREATED, tags=["departments"])
def add_department(payload: DepartmentCreate, db: Session = Depends(get_db), user: User = Depends(require_permissions("departments:write"))) -> Department:
    return create_department(db, payload, user)


@router.get("/departments", response_model=Page[DepartmentRead], tags=["departments"])
def list_departments(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    _: User = Depends(require_permissions("departments:read")),
) -> Page[DepartmentRead]:
    items, total = paginate(select(Department).where(Department.deleted_at.is_(None)).order_by(Department.name), db, limit, offset)
    return Page(items=items, total=total, limit=limit, offset=offset)


@router.post("/categories", response_model=CategoryRead, status_code=status.HTTP_201_CREATED, tags=["categories"])
def add_category(payload: CategoryCreate, db: Session = Depends(get_db), user: User = Depends(require_permissions("categories:write"))) -> AssetCategory:
    return create_category(db, payload, user)


@router.get("/categories", response_model=Page[CategoryRead], tags=["categories"])
def list_categories(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    _: User = Depends(require_permissions("categories:read")),
) -> Page[CategoryRead]:
    items, total = paginate(select(AssetCategory).where(AssetCategory.deleted_at.is_(None)).order_by(AssetCategory.name), db, limit, offset)
    return Page(items=items, total=total, limit=limit, offset=offset)


@router.post("/assets", response_model=AssetRead, status_code=status.HTTP_201_CREATED, tags=["assets"])
def add_asset(payload: AssetCreate, db: Session = Depends(get_db), user: User = Depends(require_permissions("assets:write"))) -> Asset:
    return create_asset(db, payload, user)


@router.get("/assets", response_model=Page[AssetRead], tags=["assets"])
def list_assets(
    search: str | None = None,
    status_filter: AssetStatus | None = Query(default=None, alias="status"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    _: User = Depends(require_permissions("assets:read")),
) -> Page[AssetRead]:
    items, total = paginate(asset_query(search, status_filter), db, limit, offset)
    return Page(items=items, total=total, limit=limit, offset=offset)


@router.get("/assets/{asset_id}", response_model=AssetRead, tags=["assets"])
def get_asset(asset_id: str, db: Session = Depends(get_db), _: User = Depends(require_permissions("assets:read"))) -> Asset:
    from app.services import get_required

    return get_required(db, Asset, asset_id)


@router.patch("/assets/{asset_id}", response_model=AssetRead, tags=["assets"])
def patch_asset(asset_id: str, payload: AssetUpdate, db: Session = Depends(get_db), user: User = Depends(require_permissions("assets:write"))) -> Asset:
    return update_asset(db, asset_id, payload, user)


@router.post("/allocations", response_model=AllocationRead, status_code=status.HTTP_201_CREATED, tags=["allocations"])
def add_allocation(payload: AllocationCreate, db: Session = Depends(get_db), user: User = Depends(require_permissions("allocations:write"))) -> Allocation:
    return create_allocation(db, payload, user)


@router.get("/allocations", response_model=Page[AllocationRead], tags=["allocations"])
def list_allocations(limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0), db: Session = Depends(get_db), _: User = Depends(require_permissions("assets:read"))) -> Page[AllocationRead]:
    items, total = paginate(select(Allocation).where(Allocation.deleted_at.is_(None)).order_by(Allocation.created_at.desc()), db, limit, offset)
    return Page(items=items, total=total, limit=limit, offset=offset)


@router.post("/transfers", response_model=TransferRead, status_code=status.HTTP_201_CREATED, tags=["transfers"])
def add_transfer(payload: TransferCreate, db: Session = Depends(get_db), user: User = Depends(require_permissions("transfers:write"))) -> Transfer:
    return create_transfer(db, payload, user)


@router.get("/transfers", response_model=Page[TransferRead], tags=["transfers"])
def list_transfers(limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0), db: Session = Depends(get_db), _: User = Depends(require_permissions("assets:read"))) -> Page[TransferRead]:
    items, total = paginate(select(Transfer).where(Transfer.deleted_at.is_(None)).order_by(Transfer.created_at.desc()), db, limit, offset)
    return Page(items=items, total=total, limit=limit, offset=offset)


@router.post("/bookings", response_model=BookingRead, status_code=status.HTTP_201_CREATED, tags=["bookings"])
def add_booking(payload: BookingCreate, db: Session = Depends(get_db), user: User = Depends(require_permissions("bookings:write"))) -> Booking:
    return create_booking(db, payload, user)


@router.get("/bookings", response_model=Page[BookingRead], tags=["bookings"])
def list_bookings(limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0), db: Session = Depends(get_db), _: User = Depends(require_permissions("assets:read"))) -> Page[BookingRead]:
    items, total = paginate(select(Booking).where(Booking.deleted_at.is_(None)).order_by(Booking.starts_at.desc()), db, limit, offset)
    return Page(items=items, total=total, limit=limit, offset=offset)


@router.post("/maintenance", response_model=MaintenanceRead, status_code=status.HTTP_201_CREATED, tags=["maintenance"])
def add_maintenance(payload: MaintenanceCreate, db: Session = Depends(get_db), user: User = Depends(require_permissions("maintenance:write"))) -> Maintenance:
    return create_maintenance(db, payload, user)


@router.get("/maintenance", response_model=Page[MaintenanceRead], tags=["maintenance"])
def list_maintenance(limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0), db: Session = Depends(get_db), _: User = Depends(require_permissions("assets:read"))) -> Page[MaintenanceRead]:
    items, total = paginate(select(Maintenance).where(Maintenance.deleted_at.is_(None)).order_by(Maintenance.created_at.desc()), db, limit, offset)
    return Page(items=items, total=total, limit=limit, offset=offset)


@router.post("/audits", response_model=AuditCycleRead, status_code=status.HTTP_201_CREATED, tags=["audits"])
def add_audit(payload: AuditCycleCreate, db: Session = Depends(get_db), user: User = Depends(require_permissions("audits:write"))) -> AuditCycle:
    return create_audit_cycle(db, payload, user)


@router.get("/audits", response_model=Page[AuditCycleRead], tags=["audits"])
def list_audits(limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0), db: Session = Depends(get_db), _: User = Depends(require_permissions("assets:read"))) -> Page[AuditCycleRead]:
    items, total = paginate(select(AuditCycle).where(AuditCycle.deleted_at.is_(None)).order_by(AuditCycle.created_at.desc()), db, limit, offset)
    return Page(items=items, total=total, limit=limit, offset=offset)


@router.get("/audits/{audit_id}/items", response_model=Page[AuditItemRead], tags=["audits"])
def list_audit_items(audit_id: str, limit: int = Query(100, ge=1, le=500), offset: int = Query(0, ge=0), db: Session = Depends(get_db), _: User = Depends(require_permissions("assets:read"))) -> Page[AuditItemRead]:
    items, total = paginate(select(AuditItem).where(AuditItem.audit_cycle_id == audit_id, AuditItem.deleted_at.is_(None)), db, limit, offset)
    return Page(items=items, total=total, limit=limit, offset=offset)


@router.get("/dashboard", tags=["dashboard"])
def dashboard_summary(db: Session = Depends(get_db), _: User = Depends(require_permissions("reports:read"))) -> dict[str, Any]:
    return dashboard(db)


@router.post("/reports/{report_type}", tags=["reports"])
def create_report(report_type: str, db: Session = Depends(get_db), user: User = Depends(require_permissions("reports:read"))) -> dict[str, Any]:
    report = generate_report(db, report_type, user)
    return {"id": report.id, "name": report.name, "report_type": report.report_type, "payload": report.payload}


@router.get("/notifications", response_model=Page[NotificationRead], tags=["notifications"])
def list_notifications(limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0), db: Session = Depends(get_db), user: User = Depends(require_permissions("notifications:read"))) -> Page[NotificationRead]:
    items, total = paginate(select(Notification).where(Notification.user_id == user.id, Notification.deleted_at.is_(None)).order_by(Notification.created_at.desc()), db, limit, offset)
    return Page(items=items, total=total, limit=limit, offset=offset)


@router.get("/activity-logs", tags=["activity"])
def list_activity(limit: int = Query(100, ge=1, le=500), offset: int = Query(0, ge=0), db: Session = Depends(get_db), _: User = Depends(require_permissions("activity:read"))) -> dict[str, Any]:
    items, total = paginate(select(ActivityLog).where(ActivityLog.deleted_at.is_(None)).order_by(ActivityLog.created_at.desc()), db, limit, offset)
    return {"items": [{"id": item.id, "action": item.action, "entity_type": item.entity_type, "entity_id": item.entity_id, "created_at": item.created_at} for item in items], "total": total, "limit": limit, "offset": offset}


@router.post("/ai/chat", response_model=AIResponse, tags=["ai"])
async def ai_chat(payload: AIChatRequest, db: Session = Depends(get_db), user: User = Depends(require_permissions("ai:use"))) -> AIResponse:
    response, provider, fallback = await ai_generate(db, user, "chat", payload.message, payload.context)
    return AIResponse(response=response, provider=provider, fallback=fallback)


@router.post("/ai/report-summary", response_model=AIResponse, tags=["ai"])
async def ai_report_summary(payload: AIChatRequest, db: Session = Depends(get_db), user: User = Depends(require_permissions("ai:use"))) -> AIResponse:
    response, provider, fallback = await ai_generate(db, user, "report_summary", payload.message, {"dashboard": dashboard(db), **(payload.context or {})})
    return AIResponse(response=response, provider=provider, fallback=fallback)


@router.post("/ai/maintenance-prediction", response_model=AIResponse, tags=["ai"])
async def ai_maintenance_prediction(payload: AIChatRequest, db: Session = Depends(get_db), user: User = Depends(require_permissions("ai:use"))) -> AIResponse:
    response, provider, fallback = await ai_generate(db, user, "maintenance_prediction", payload.message, payload.context)
    return AIResponse(response=response, provider=provider, fallback=fallback)


@router.post("/ai/asset-recommendation", response_model=AIResponse, tags=["ai"])
async def ai_asset_recommendation(payload: AIChatRequest, db: Session = Depends(get_db), user: User = Depends(require_permissions("ai:use"))) -> AIResponse:
    response, provider, fallback = await ai_generate(db, user, "asset_recommendation", payload.message, payload.context)
    return AIResponse(response=response, provider=provider, fallback=fallback)


@router.delete("/assets/{asset_id}", response_model=Message, tags=["assets"])
def delete_asset(asset_id: str, db: Session = Depends(get_db), user: User = Depends(require_permissions("assets:write"))) -> Message:
    from app.services import get_required

    asset = get_required(db, Asset, asset_id)
    asset.deleted_at = datetime.now(UTC)
    activity(db, user, "asset.deleted", "asset", asset.id)
    db.commit()
    return Message(message="Asset deleted")
