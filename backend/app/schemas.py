from datetime import datetime
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models import AssetStatus, AuditItemStatus, MaintenanceStatus, WorkflowStatus


T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    items: list[T]
    total: int
    limit: int
    offset: int


class Message(BaseModel):
    message: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=20)


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=160)
    password: str = Field(min_length=8, max_length=128)
    department_id: str | None = None


class PermissionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    code: str
    description: str | None = None


class RoleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str | None = None
    permissions: list[PermissionRead] = []


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    full_name: str
    is_active: bool
    role: RoleRead
    department_id: str | None = None


class DepartmentCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    code: str = Field(min_length=2, max_length=24, pattern=r"^[A-Z0-9_-]+$")
    parent_id: str | None = None
    manager_id: str | None = None


class DepartmentRead(DepartmentCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str


class CategoryFieldCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    field_type: str = Field(pattern=r"^(text|number|date|boolean|select)$")
    required: bool = False


class CategoryFieldRead(CategoryFieldCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str


class CategoryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str | None = None
    custom_fields: list[CategoryFieldCreate] = []


class CategoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str | None = None
    custom_fields: list[CategoryFieldRead] = []


class AssetCreate(BaseModel):
    tag: str = Field(min_length=2, max_length=80)
    name: str = Field(min_length=2, max_length=180)
    serial_number: str | None = Field(default=None, max_length=120)
    category_id: str
    department_id: str | None = None
    assigned_to_id: str | None = None
    location: str | None = Field(default=None, max_length=255)
    purchase_date: datetime | None = None
    purchase_value: float | None = Field(default=None, ge=0)
    health_score: int = Field(default=100, ge=0, le=100)
    metadata_json: dict[str, Any] | None = None


class AssetUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=180)
    status: AssetStatus | None = None
    department_id: str | None = None
    assigned_to_id: str | None = None
    location: str | None = Field(default=None, max_length=255)
    health_score: int | None = Field(default=None, ge=0, le=100)
    metadata_json: dict[str, Any] | None = None


class AssetRead(AssetCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: AssetStatus
    created_at: datetime
    updated_at: datetime


class AllocationCreate(BaseModel):
    asset_id: str
    allocated_to_id: str
    department_id: str
    due_back_at: datetime | None = None


class AllocationRead(AllocationCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: WorkflowStatus
    approved_by_id: str | None = None


class TransferCreate(BaseModel):
    asset_id: str
    from_department_id: str
    to_department_id: str
    reason: str = Field(min_length=5)


class TransferRead(TransferCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    requested_by_id: str
    status: WorkflowStatus


class BookingCreate(BaseModel):
    asset_id: str
    starts_at: datetime
    ends_at: datetime
    purpose: str = Field(min_length=3, max_length=255)

    @field_validator("ends_at")
    @classmethod
    def validate_window(cls, ends_at: datetime, values) -> datetime:
        starts_at = values.data.get("starts_at")
        if starts_at and ends_at <= starts_at:
            raise ValueError("ends_at must be after starts_at")
        return ends_at


class BookingRead(BookingCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    booked_by_id: str
    status: WorkflowStatus


class MaintenanceCreate(BaseModel):
    asset_id: str
    issue: str = Field(min_length=5)
    priority: str = Field(default="medium", pattern=r"^(low|medium|high|critical)$")
    assigned_to_id: str | None = None


class MaintenanceRead(MaintenanceCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    requested_by_id: str
    status: MaintenanceStatus
    resolution: str | None = None


class AuditCycleCreate(BaseModel):
    name: str = Field(min_length=3, max_length=160)
    department_id: str | None = None
    starts_at: datetime
    ends_at: datetime


class AuditCycleRead(AuditCycleCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: WorkflowStatus


class AuditItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    audit_cycle_id: str
    asset_id: str
    status: AuditItemStatus
    expected_location: str | None = None
    observed_location: str | None = None
    notes: str | None = None


class NotificationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    body: str
    type: str
    read_at: datetime | None = None
    created_at: datetime


class ActivityLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    actor_id: str | None
    action: str
    entity_type: str
    entity_id: str | None
    metadata_json: dict[str, Any] | None = None
    created_at: datetime


class AIChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=2000)
    context: dict[str, Any] | None = None


class AIResponse(BaseModel):
    response: str
    provider: str
    fallback: bool = False
