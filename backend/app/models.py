import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Table,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def new_id() -> str:
    return str(uuid.uuid4())


class TimestampMixin:
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)


class AssetStatus(str, enum.Enum):
    available = "available"
    allocated = "allocated"
    booked = "booked"
    under_maintenance = "under_maintenance"
    in_transit = "in_transit"
    retired = "retired"


class WorkflowStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    active = "active"
    completed = "completed"
    cancelled = "cancelled"


class MaintenanceStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    assigned = "assigned"
    in_progress = "in_progress"
    resolved = "resolved"
    cancelled = "cancelled"


class AuditItemStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    missing = "missing"
    discrepancy = "discrepancy"
    damaged = "damaged"


role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    Column("permission_id", ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True),
)


class Role(TimestampMixin, Base):
    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    permissions: Mapped[list["Permission"]] = relationship(secondary=role_permissions, lazy="selectin")
    users: Mapped[list["User"]] = relationship(back_populates="role")


class Permission(TimestampMixin, Base):
    __tablename__ = "permissions"

    code: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)


class Department(TimestampMixin, Base):
    __tablename__ = "departments"

    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(24), unique=True, nullable=False, index=True)
    parent_id: Mapped[str | None] = mapped_column(ForeignKey("departments.id"))
    manager_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))


class User(TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(160), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    refresh_token_hash: Mapped[str | None] = mapped_column(String(255))
    role_id: Mapped[str] = mapped_column(ForeignKey("roles.id"), nullable=False, index=True)
    department_id: Mapped[str | None] = mapped_column(ForeignKey("departments.id"), index=True)
    role: Mapped[Role] = relationship(back_populates="users", lazy="joined")
    department: Mapped[Department | None] = relationship(foreign_keys=[department_id], lazy="joined")


class AssetCategory(TimestampMixin, Base):
    __tablename__ = "asset_categories"

    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    custom_fields: Mapped[list["CategoryCustomField"]] = relationship(back_populates="category", cascade="all, delete-orphan")


class CategoryCustomField(TimestampMixin, Base):
    __tablename__ = "category_custom_fields"
    __table_args__ = (UniqueConstraint("category_id", "name", name="uq_category_custom_field_name"),)

    category_id: Mapped[str] = mapped_column(ForeignKey("asset_categories.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    field_type: Mapped[str] = mapped_column(String(40), nullable=False)
    required: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    category: Mapped[AssetCategory] = relationship(back_populates="custom_fields")


class Asset(TimestampMixin, Base):
    __tablename__ = "assets"
    __table_args__ = (
        Index("ix_assets_search", "tag", "name", "serial_number"),
        Index("ix_assets_status_category", "status", "category_id"),
    )

    tag: Mapped[str] = mapped_column(String(80), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False, index=True)
    serial_number: Mapped[str | None] = mapped_column(String(120), unique=True)
    status: Mapped[AssetStatus] = mapped_column(Enum(AssetStatus, native_enum=False), default=AssetStatus.available, nullable=False, index=True)
    category_id: Mapped[str] = mapped_column(ForeignKey("asset_categories.id"), nullable=False, index=True)
    department_id: Mapped[str | None] = mapped_column(ForeignKey("departments.id"), index=True)
    assigned_to_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), index=True)
    location: Mapped[str | None] = mapped_column(String(255))
    purchase_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    purchase_value: Mapped[float | None] = mapped_column(Numeric(12, 2))
    health_score: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    metadata_json: Mapped[dict | None] = mapped_column(JSON)
    category: Mapped[AssetCategory] = relationship(lazy="joined")
    department: Mapped[Department | None] = relationship(lazy="joined")
    assigned_to: Mapped[User | None] = relationship(lazy="joined")


class AssetHistory(TimestampMixin, Base):
    __tablename__ = "asset_history"

    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id"), nullable=False, index=True)
    actor_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), index=True)
    event_type: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    before: Mapped[dict | None] = mapped_column(JSON)
    after: Mapped[dict | None] = mapped_column(JSON)


class Allocation(TimestampMixin, Base):
    __tablename__ = "allocations"
    __table_args__ = (Index("ix_allocations_asset_status", "asset_id", "status"),)

    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id"), nullable=False, index=True)
    allocated_to_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    department_id: Mapped[str] = mapped_column(ForeignKey("departments.id"), nullable=False, index=True)
    status: Mapped[WorkflowStatus] = mapped_column(Enum(WorkflowStatus, native_enum=False), default=WorkflowStatus.pending, nullable=False)
    approved_by_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    due_back_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    asset: Mapped[Asset] = relationship(lazy="joined")
    allocated_to: Mapped[User] = relationship(foreign_keys=[allocated_to_id], lazy="joined")


class Transfer(TimestampMixin, Base):
    __tablename__ = "transfers"

    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id"), nullable=False, index=True)
    from_department_id: Mapped[str] = mapped_column(ForeignKey("departments.id"), nullable=False)
    to_department_id: Mapped[str] = mapped_column(ForeignKey("departments.id"), nullable=False)
    requested_by_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    status: Mapped[WorkflowStatus] = mapped_column(Enum(WorkflowStatus, native_enum=False), default=WorkflowStatus.pending, nullable=False, index=True)
    reason: Mapped[str] = mapped_column(Text, nullable=False)


class Booking(TimestampMixin, Base):
    __tablename__ = "bookings"
    __table_args__ = (Index("ix_bookings_asset_window", "asset_id", "starts_at", "ends_at"),)

    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id"), nullable=False, index=True)
    booked_by_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    status: Mapped[WorkflowStatus] = mapped_column(Enum(WorkflowStatus, native_enum=False), default=WorkflowStatus.active, nullable=False, index=True)
    purpose: Mapped[str] = mapped_column(String(255), nullable=False)


class Maintenance(TimestampMixin, Base):
    __tablename__ = "maintenance"

    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id"), nullable=False, index=True)
    requested_by_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    assigned_to_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    status: Mapped[MaintenanceStatus] = mapped_column(Enum(MaintenanceStatus, native_enum=False), default=MaintenanceStatus.pending, nullable=False, index=True)
    priority: Mapped[str] = mapped_column(String(24), default="medium", nullable=False, index=True)
    issue: Mapped[str] = mapped_column(Text, nullable=False)
    resolution: Mapped[str | None] = mapped_column(Text)


class MaintenanceHistory(TimestampMixin, Base):
    __tablename__ = "maintenance_history"

    maintenance_id: Mapped[str] = mapped_column(ForeignKey("maintenance.id", ondelete="CASCADE"), nullable=False, index=True)
    actor_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    status: Mapped[MaintenanceStatus] = mapped_column(Enum(MaintenanceStatus, native_enum=False), nullable=False)
    note: Mapped[str | None] = mapped_column(Text)


class AuditCycle(TimestampMixin, Base):
    __tablename__ = "audit_cycles"

    name: Mapped[str] = mapped_column(String(160), nullable=False)
    department_id: Mapped[str | None] = mapped_column(ForeignKey("departments.id"), index=True)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[WorkflowStatus] = mapped_column(Enum(WorkflowStatus, native_enum=False), default=WorkflowStatus.active, nullable=False)


class AuditItem(TimestampMixin, Base):
    __tablename__ = "audit_items"
    __table_args__ = (UniqueConstraint("audit_cycle_id", "asset_id", name="uq_audit_cycle_asset"),)

    audit_cycle_id: Mapped[str] = mapped_column(ForeignKey("audit_cycles.id", ondelete="CASCADE"), nullable=False, index=True)
    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id"), nullable=False, index=True)
    status: Mapped[AuditItemStatus] = mapped_column(Enum(AuditItemStatus, native_enum=False), default=AuditItemStatus.pending, nullable=False)
    expected_location: Mapped[str | None] = mapped_column(String(255))
    observed_location: Mapped[str | None] = mapped_column(String(255))
    notes: Mapped[str | None] = mapped_column(Text)


class Notification(TimestampMixin, Base):
    __tablename__ = "notifications"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class ActivityLog(TimestampMixin, Base):
    __tablename__ = "activity_logs"

    actor_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), index=True)
    action: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    entity_id: Mapped[str | None] = mapped_column(String(36), index=True)
    ip_address: Mapped[str | None] = mapped_column(String(64))
    metadata_json: Mapped[dict | None] = mapped_column(JSON)


class Report(TimestampMixin, Base):
    __tablename__ = "reports"

    name: Mapped[str] = mapped_column(String(160), nullable=False)
    report_type: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    generated_by_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    payload: Mapped[dict] = mapped_column(JSON, nullable=False)


class AILog(TimestampMixin, Base):
    __tablename__ = "ai_logs"

    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), index=True)
    feature: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    response: Mapped[str] = mapped_column(Text, nullable=False)
    provider: Mapped[str] = mapped_column(String(40), nullable=False)
    success: Mapped[bool] = mapped_column(Boolean, nullable=False)
