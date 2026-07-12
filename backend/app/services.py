from datetime import UTC, datetime, timedelta
from typing import Any

import httpx
from fastapi import HTTPException, status
from sqlalchemy import and_, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import (
    AILog,
    ActivityLog,
    Allocation,
    Asset,
    AssetCategory,
    AssetHistory,
    AssetStatus,
    AuditCycle,
    AuditItem,
    Booking,
    Department,
    Maintenance,
    MaintenanceHistory,
    MaintenanceStatus,
    Notification,
    Permission,
    Report,
    Role,
    Transfer,
    User,
    WorkflowStatus,
    CategoryCustomField,
)
from app.schemas import (
    AllocationCreate,
    AssetCreate,
    AssetUpdate,
    AuditCycleCreate,
    BookingCreate,
    CategoryCreate,
    DepartmentCreate,
    MaintenanceCreate,
    TransferCreate,
    UserCreate,
)
from app.security import create_token, hash_password, hash_token, verify_password


ALL_PERMISSIONS = [
    "departments:read",
    "departments:write",
    "categories:read",
    "categories:write",
    "assets:read",
    "assets:write",
    "allocations:write",
    "transfers:write",
    "bookings:write",
    "maintenance:write",
    "audits:write",
    "reports:read",
    "notifications:read",
    "activity:read",
    "ai:use",
]


class TTLCache:
    def __init__(self) -> None:
        self._value: Any = None
        self._expires_at = datetime.min.replace(tzinfo=UTC)

    def get(self) -> Any | None:
        if datetime.now(UTC) >= self._expires_at:
            return None
        return self._value

    def set(self, value: Any, ttl_seconds: int) -> Any:
        self._value = value
        self._expires_at = datetime.now(UTC) + timedelta(seconds=ttl_seconds)
        return value

    def clear(self) -> None:
        self._value = None
        self._expires_at = datetime.min.replace(tzinfo=UTC)


dashboard_cache = TTLCache()


def commit(db: Session) -> None:
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Unique or foreign-key constraint failed") from exc


def seed_defaults(db: Session) -> None:
    existing = db.scalar(select(func.count(Role.id)))
    if existing:
        return
    permissions = [Permission(code=code, description=code.replace(":", " ")) for code in ALL_PERMISSIONS]
    admin = Role(name="admin", description="System administrator", permissions=permissions)
    manager = Role(name="manager", description="Department manager", permissions=[p for p in permissions if p.code != "activity:read"])
    employee = Role(name="employee", description="Employee self-service", permissions=[p for p in permissions if p.code in {"assets:read", "bookings:write", "notifications:read", "ai:use"}])
    it = Department(name="Information Technology", code="IT")
    categories = [
        AssetCategory(name="Laptop", description="Portable computers"),
        AssetCategory(name="Display", description="Monitors and display devices"),
        AssetCategory(name="Equipment", description="Shared workplace equipment"),
    ]
    db.add_all([*permissions, admin, manager, employee, it, *categories])
    commit(db)


def activity(db: Session, actor: User | None, action: str, entity_type: str, entity_id: str | None = None, metadata: dict | None = None, ip_address: str | None = None) -> None:
    db.add(ActivityLog(actor_id=actor.id if actor else None, action=action, entity_type=entity_type, entity_id=entity_id, metadata_json=metadata, ip_address=ip_address))


def notify(db: Session, user_id: str, title: str, body: str, type_: str) -> None:
    db.add(Notification(user_id=user_id, title=title, body=body, type=type_))


def paginate(query, db: Session, limit: int, offset: int):
    total = db.scalar(select(func.count()).select_from(query.order_by(None).subquery())) or 0
    items = db.scalars(query.limit(limit).offset(offset)).all()
    return items, total


def register_user(db: Session, payload: UserCreate) -> User:
    role_name = "admin" if (db.scalar(select(func.count(User.id))) or 0) == 0 else "employee"
    role = db.scalar(select(Role).where(Role.name == role_name))
    if role is None:
        seed_defaults(db)
        role = db.scalar(select(Role).where(Role.name == role_name))
    user = User(email=str(payload.email).lower(), full_name=payload.full_name, hashed_password=hash_password(payload.password), role_id=role.id, department_id=payload.department_id)
    db.add(user)
    commit(db)
    db.refresh(user)
    return user


def authenticate(db: Session, email: str, password: str) -> tuple[User, str, str]:
    user = db.scalar(select(User).where(User.email == email.lower(), User.deleted_at.is_(None)))
    if user is None or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return issue_tokens(db, user)


def issue_tokens(db: Session, user: User) -> tuple[User, str, str]:
    settings = get_settings()
    access_token = create_token(user.id, "access", timedelta(minutes=settings.access_token_expire_minutes), {"role": user.role.name})
    refresh_token = create_token(user.id, "refresh", timedelta(days=settings.refresh_token_expire_days))
    user.refresh_token_hash = hash_token(refresh_token)
    commit(db)
    return user, access_token, refresh_token


def refresh_tokens(db: Session, refresh_token: str) -> tuple[User, str, str]:
    try:
        from app.security import decode_token

        payload = decode_token(refresh_token)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc
    if payload.get("typ") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    user = db.scalar(select(User).where(User.id == payload["sub"], User.deleted_at.is_(None)))
    if user is None or user.refresh_token_hash != hash_token(refresh_token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked")
    return issue_tokens(db, user)


def create_department(db: Session, payload: DepartmentCreate, actor: User) -> Department:
    department = Department(**payload.model_dump())
    db.add(department)
    activity(db, actor, "department.created", "department", department.id)
    commit(db)
    dashboard_cache.clear()
    db.refresh(department)
    return department


def create_category(db: Session, payload: CategoryCreate, actor: User) -> AssetCategory:
    category = AssetCategory(name=payload.name, description=payload.description)
    for field in payload.custom_fields:
        category.custom_fields.append(CategoryCustomField(**field.model_dump()))
    db.add(category)
    activity(db, actor, "category.created", "category", category.id)
    commit(db)
    db.refresh(category)
    return category


def create_asset(db: Session, payload: AssetCreate, actor: User) -> Asset:
    asset = Asset(**payload.model_dump())
    db.add(asset)
    db.flush()
    db.add(AssetHistory(asset_id=asset.id, actor_id=actor.id, event_type="created", after=payload.model_dump(mode="json")))
    activity(db, actor, "asset.created", "asset", asset.id)
    commit(db)
    dashboard_cache.clear()
    db.refresh(asset)
    return asset


def update_asset(db: Session, asset_id: str, payload: AssetUpdate, actor: User) -> Asset:
    asset = get_required(db, Asset, asset_id)
    before = {"status": asset.status.value, "department_id": asset.department_id, "assigned_to_id": asset.assigned_to_id}
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(asset, field, value)
    db.add(AssetHistory(asset_id=asset.id, actor_id=actor.id, event_type="updated", before=before, after=payload.model_dump(exclude_unset=True, mode="json")))
    activity(db, actor, "asset.updated", "asset", asset.id)
    commit(db)
    dashboard_cache.clear()
    db.refresh(asset)
    return asset


def get_required(db: Session, model, entity_id: str):
    entity = db.get(model, entity_id)
    if entity is None or getattr(entity, "deleted_at", None) is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{model.__name__} not found")
    return entity


def create_allocation(db: Session, payload: AllocationCreate, actor: User) -> Allocation:
    asset = get_required(db, Asset, payload.asset_id)
    if asset.status not in {AssetStatus.available, AssetStatus.booked}:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Asset is not available for allocation")
    allocation = Allocation(**payload.model_dump(), status=WorkflowStatus.active, approved_by_id=actor.id)
    asset.status = AssetStatus.allocated
    asset.assigned_to_id = payload.allocated_to_id
    asset.department_id = payload.department_id
    db.add(allocation)
    activity(db, actor, "allocation.created", "allocation", allocation.id)
    notify(db, payload.allocated_to_id, "Asset allocated", f"{asset.tag} has been allocated to you.", "allocation")
    commit(db)
    dashboard_cache.clear()
    db.refresh(allocation)
    return allocation


def create_transfer(db: Session, payload: TransferCreate, actor: User) -> Transfer:
    asset = get_required(db, Asset, payload.asset_id)
    transfer = Transfer(**payload.model_dump(), requested_by_id=actor.id, status=WorkflowStatus.completed)
    asset.department_id = payload.to_department_id
    asset.status = AssetStatus.available if asset.assigned_to_id is None else AssetStatus.allocated
    db.add(transfer)
    activity(db, actor, "transfer.completed", "transfer", transfer.id)
    commit(db)
    dashboard_cache.clear()
    db.refresh(transfer)
    return transfer


def create_booking(db: Session, payload: BookingCreate, actor: User) -> Booking:
    asset = get_required(db, Asset, payload.asset_id)
    if asset.status in {AssetStatus.retired, AssetStatus.under_maintenance}:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Asset cannot be booked")
    conflict = db.scalar(
        select(Booking.id).where(
            Booking.asset_id == payload.asset_id,
            Booking.status.in_([WorkflowStatus.active, WorkflowStatus.approved]),
            Booking.starts_at < payload.ends_at,
            Booking.ends_at > payload.starts_at,
            Booking.deleted_at.is_(None),
        )
    )
    if conflict:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Booking conflicts with an existing reservation")
    booking = Booking(**payload.model_dump(), booked_by_id=actor.id)
    db.add(booking)
    activity(db, actor, "booking.created", "booking", booking.id)
    commit(db)
    dashboard_cache.clear()
    db.refresh(booking)
    return booking


def create_maintenance(db: Session, payload: MaintenanceCreate, actor: User) -> Maintenance:
    asset = get_required(db, Asset, payload.asset_id)
    maintenance = Maintenance(**payload.model_dump(), requested_by_id=actor.id)
    asset.status = AssetStatus.under_maintenance
    db.add(maintenance)
    db.flush()
    db.add(MaintenanceHistory(maintenance_id=maintenance.id, actor_id=actor.id, status=MaintenanceStatus.pending, note=payload.issue))
    activity(db, actor, "maintenance.created", "maintenance", maintenance.id)
    commit(db)
    dashboard_cache.clear()
    db.refresh(maintenance)
    return maintenance


def create_audit_cycle(db: Session, payload: AuditCycleCreate, actor: User) -> AuditCycle:
    cycle = AuditCycle(**payload.model_dump())
    db.add(cycle)
    db.flush()
    asset_query = select(Asset).where(Asset.deleted_at.is_(None))
    if payload.department_id:
        asset_query = asset_query.where(Asset.department_id == payload.department_id)
    for asset in db.scalars(asset_query):
        db.add(AuditItem(audit_cycle_id=cycle.id, asset_id=asset.id, expected_location=asset.location))
    activity(db, actor, "audit.created", "audit_cycle", cycle.id)
    commit(db)
    db.refresh(cycle)
    return cycle


def dashboard(db: Session) -> dict[str, Any]:
    cached = dashboard_cache.get()
    if cached:
        return cached
    by_status = dict(db.execute(select(Asset.status, func.count(Asset.id)).where(Asset.deleted_at.is_(None)).group_by(Asset.status)).all())
    maintenance_open = db.scalar(select(func.count(Maintenance.id)).where(Maintenance.status.not_in([MaintenanceStatus.resolved, MaintenanceStatus.cancelled]), Maintenance.deleted_at.is_(None))) or 0
    active_bookings = db.scalar(select(func.count(Booking.id)).where(Booking.status == WorkflowStatus.active, Booking.ends_at >= datetime.now(UTC), Booking.deleted_at.is_(None))) or 0
    payload = {
        "total_assets": sum(by_status.values()),
        "assets_by_status": {status.value if hasattr(status, "value") else status: count for status, count in by_status.items()},
        "open_maintenance": maintenance_open,
        "active_bookings": active_bookings,
        "departments": db.scalar(select(func.count(Department.id)).where(Department.deleted_at.is_(None))) or 0,
    }
    return dashboard_cache.set(payload, 30)


def generate_report(db: Session, report_type: str, actor: User) -> Report:
    payload = dashboard(db) if report_type == "dashboard" else {"report_type": report_type, "generated_at": datetime.now(UTC).isoformat()}
    report = Report(name=f"{report_type.title()} Report", report_type=report_type, generated_by_id=actor.id, payload=payload)
    db.add(report)
    activity(db, actor, "report.generated", "report", report.id)
    commit(db)
    db.refresh(report)
    return report


async def ai_generate(db: Session, actor: User, feature: str, prompt: str, context: dict[str, Any] | None = None) -> tuple[str, str, bool]:
    settings = get_settings()
    fallback = deterministic_ai(feature, prompt, context)
    if not settings.gemini_api_key:
        db.add(AILog(user_id=actor.id, feature=feature, prompt=prompt, response=fallback, provider="fallback", success=True))
        commit(db)
        return fallback, "fallback", True
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent?key={settings.gemini_api_key}"
        body = {"contents": [{"parts": [{"text": f"Feature: {feature}\nContext: {context or {}}\nPrompt: {prompt}"}]}]}
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(url, json=body)
            response.raise_for_status()
        text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        db.add(AILog(user_id=actor.id, feature=feature, prompt=prompt, response=text, provider="gemini", success=True))
        commit(db)
        return text, "gemini", False
    except Exception:
        db.add(AILog(user_id=actor.id, feature=feature, prompt=prompt, response=fallback, provider="fallback", success=False))
        commit(db)
        return fallback, "fallback", True


def deterministic_ai(feature: str, prompt: str, context: dict[str, Any] | None) -> str:
    if feature == "maintenance_prediction":
        return "Assets with health_score below 70 or repeated maintenance events should be inspected first."
    if feature == "asset_recommendation":
        return "Prioritize available assets in the same department and category before procurement."
    if feature == "report_summary":
        return "Summary unavailable from AI provider; dashboard metrics were generated deterministically."
    return f"I can help with asset operations. Relevant request: {prompt[:240]}"


def asset_query(search: str | None, status_filter: AssetStatus | None):
    query = select(Asset).where(Asset.deleted_at.is_(None)).order_by(Asset.created_at.desc())
    if search:
        like = f"%{search}%"
        query = query.where(or_(Asset.tag.ilike(like), Asset.name.ilike(like), Asset.serial_number.ilike(like)))
    if status_filter:
        query = query.where(Asset.status == status_filter)
    return query
