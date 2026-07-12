from __future__ import annotations

from collections.abc import Iterable
from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import uuid4

import httpx
from fastapi import HTTPException, status
from pymongo.collection import Collection
from pymongo.errors import DuplicateKeyError

from app.config import get_settings
from app.database import ALL_PERMISSIONS, MongoStore, get_store, seed_defaults
from app.models import AssetStatus, AuditItemStatus, MaintenanceStatus, WorkflowStatus
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
    MaintenanceCreate,
    TransferCreate,
    UserCreate,
)
from app.security import create_token, decode_token, hash_password, hash_token, verify_password


class TTLCache:
    def __init__(self) -> None:
        self.value: Any = None
        self.expires_at = datetime.min.replace(tzinfo=UTC)

    def get(self) -> Any | None:
        return self.value if datetime.now(UTC) < self.expires_at else None

    def set(self, value: Any, ttl_seconds: int) -> Any:
        self.value = value
        self.expires_at = datetime.now(UTC) + timedelta(seconds=ttl_seconds)
        return value

    def clear(self) -> None:
        self.value = None
        self.expires_at = datetime.min.replace(tzinfo=UTC)


dashboard_cache = TTLCache()


def now() -> datetime:
    return datetime.now(UTC)


def new_id(prefix: str) -> str:
    return f"{prefix}-{uuid4().hex[:12]}"


def public_permission(code: str) -> dict[str, str]:
    return {"id": code, "code": code, "description": code.replace(":", " ")}


def public_role(store: MongoStore, role_doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": role_doc["_id"],
        "name": role_doc["name"],
        "description": role_doc.get("description"),
        "permissions": [public_permission(code) for code in role_doc.get("permission_codes", [])],
    }


def public_department(department_doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": department_doc["_id"],
        "name": department_doc["name"],
        "code": department_doc["code"],
        "parent_id": department_doc.get("parent_id"),
        "manager_id": department_doc.get("manager_id"),
    }


def public_category(category_doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": category_doc["_id"],
        "name": category_doc["name"],
        "description": category_doc.get("description"),
        "custom_fields": [
            {"id": field.get("id") or new_id("field"), "name": field["name"], "field_type": field["field_type"], "required": field.get("required", False)}
            for field in category_doc.get("custom_fields", [])
        ],
    }


def public_user(store: MongoStore, user_doc: dict[str, Any]) -> dict[str, Any]:
    role_doc = store.roles.find_one({"_id": user_doc["role_id"]})
    if role_doc is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Role not configured")
    return {
        "id": user_doc["_id"],
        "email": user_doc["email"],
        "full_name": user_doc["full_name"],
        "is_active": user_doc.get("is_active", True),
        "department_id": user_doc.get("department_id"),
        "role": public_role(store, role_doc),
    }


def public_asset(store: MongoStore, asset_doc: dict[str, Any]) -> dict[str, Any]:
    category = store.categories.find_one({"_id": asset_doc["category_id"]})
    department = store.departments.find_one({"_id": asset_doc.get("department_id")}) if asset_doc.get("department_id") else None
    assigned_to = store.users.find_one({"_id": asset_doc.get("assigned_to_id")}) if asset_doc.get("assigned_to_id") else None
    return {
        "id": asset_doc["_id"],
        "tag": asset_doc["tag"],
        "name": asset_doc["name"],
        "serial_number": asset_doc.get("serial_number"),
        "category_id": asset_doc["category_id"],
        "department_id": asset_doc.get("department_id"),
        "assigned_to_id": asset_doc.get("assigned_to_id"),
        "location": asset_doc.get("location"),
        "purchase_date": asset_doc.get("purchase_date"),
        "purchase_value": asset_doc.get("purchase_value"),
        "health_score": asset_doc.get("health_score", 100),
        "metadata_json": asset_doc.get("metadata_json"),
        "status": asset_doc.get("status", AssetStatus.available.value),
        "created_at": asset_doc["created_at"],
        "updated_at": asset_doc["updated_at"],
        "category": public_category(category) if category else None,
        "department": public_department(department) if department else None,
        "assigned_to": public_user(store, assigned_to) if assigned_to else None,
    }


def public_allocation(store: MongoStore, doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": doc["_id"],
        "asset_id": doc["asset_id"],
        "allocated_to_id": doc["allocated_to_id"],
        "department_id": doc["department_id"],
        "due_back_at": doc.get("due_back_at"),
        "status": doc.get("status", WorkflowStatus.active.value),
        "approved_by_id": doc.get("approved_by_id"),
    }


def public_transfer(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": doc["_id"],
        "asset_id": doc["asset_id"],
        "from_department_id": doc["from_department_id"],
        "to_department_id": doc["to_department_id"],
        "requested_by_id": doc["requested_by_id"],
        "status": doc.get("status", WorkflowStatus.completed.value),
        "reason": doc["reason"],
    }


def public_booking(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": doc["_id"],
        "asset_id": doc["asset_id"],
        "booked_by_id": doc["booked_by_id"],
        "starts_at": doc["starts_at"],
        "ends_at": doc["ends_at"],
        "status": doc.get("status", WorkflowStatus.active.value),
        "purpose": doc["purpose"],
    }


def public_maintenance(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": doc["_id"],
        "asset_id": doc["asset_id"],
        "requested_by_id": doc["requested_by_id"],
        "assigned_to_id": doc.get("assigned_to_id"),
        "status": doc.get("status", MaintenanceStatus.pending.value),
        "priority": doc.get("priority", "medium"),
        "issue": doc["issue"],
        "resolution": doc.get("resolution"),
    }


def public_audit_cycle(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": doc["_id"],
        "name": doc["name"],
        "department_id": doc.get("department_id"),
        "starts_at": doc["starts_at"],
        "ends_at": doc["ends_at"],
        "status": doc.get("status", WorkflowStatus.active.value),
    }


def public_audit_item(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": doc["_id"],
        "audit_cycle_id": doc["audit_cycle_id"],
        "asset_id": doc["asset_id"],
        "status": doc.get("status", AuditItemStatus.pending.value),
        "expected_location": doc.get("expected_location"),
        "observed_location": doc.get("observed_location"),
        "notes": doc.get("notes"),
    }


def public_notification(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": doc["_id"],
        "title": doc["title"],
        "body": doc["body"],
        "type": doc["type"],
        "read_at": doc.get("read_at"),
        "created_at": doc["created_at"],
    }


def public_activity(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": doc["_id"],
        "actor_id": doc.get("actor_id"),
        "action": doc["action"],
        "entity_type": doc["entity_type"],
        "entity_id": doc.get("entity_id"),
        "metadata_json": doc.get("metadata_json"),
        "created_at": doc["created_at"],
    }


def public_report(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": doc["_id"],
        "name": doc["name"],
        "report_type": doc["report_type"],
        "generated_by_id": doc.get("generated_by_id"),
        "payload": doc["payload"],
    }


def public_ai_log(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": doc["_id"],
        "user_id": doc.get("user_id"),
        "feature": doc["feature"],
        "prompt": doc["prompt"],
        "response": doc["response"],
        "provider": doc["provider"],
        "success": doc["success"],
    }


def paginate(cursor: Iterable[dict[str, Any]], total: int, limit: int, offset: int, converter) -> dict[str, Any]:
    return {"items": [converter(doc) for doc in cursor], "total": total, "limit": limit, "offset": offset}


def log_activity(store: MongoStore, actor: dict[str, Any] | None, action: str, entity_type: str, entity_id: str | None = None, metadata: dict[str, Any] | None = None, ip_address: str | None = None) -> None:
    store.activity_logs.insert_one(
        {
            "_id": new_id("act"),
            "actor_id": actor["_id"] if actor else None,
            "action": action,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "metadata_json": metadata,
            "ip_address": ip_address,
            "created_at": now(),
            "updated_at": now(),
            "deleted_at": None,
        }
    )


def notify(store: MongoStore, user_id: str, title: str, body: str, type_: str) -> None:
    store.notifications.insert_one(
        {
            "_id": new_id("ntf"),
            "user_id": user_id,
            "title": title,
            "body": body,
            "type": type_,
            "read_at": None,
            "created_at": now(),
            "updated_at": now(),
            "deleted_at": None,
        }
    )


def get_required(collection: Collection, entity_id: str, label: str) -> dict[str, Any]:
    entity = collection.find_one({"_id": entity_id, "deleted_at": None})
    if entity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{label} not found")
    return entity


def register_user(payload: UserCreate) -> dict[str, Any]:
    store = get_store()
    if store.users.count_documents({}) == 0:
        seed_defaults(store)
    role_name = "admin" if store.users.count_documents({}) == 0 else "employee"
    role_doc = store.roles.find_one({"name": role_name})
    if role_doc is None:
        seed_defaults(store)
        role_doc = store.roles.find_one({"name": role_name})
    user_doc = {
        "_id": new_id("usr"),
        "email": str(payload.email).lower(),
        "full_name": payload.full_name,
        "hashed_password": hash_password(payload.password),
        "is_active": True,
        "refresh_token_hash": None,
        "role_id": role_doc["_id"],
        "department_id": payload.department_id,
        "created_at": now(),
        "updated_at": now(),
        "deleted_at": None,
    }
    try:
        store.users.insert_one(user_doc)
    except DuplicateKeyError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists") from exc
    return public_user(store, user_doc)


def authenticate(email: str, password: str) -> tuple[dict[str, Any], str, str]:
    store = get_store()
    user_doc = store.users.find_one({"email": email.lower(), "deleted_at": None})
    if user_doc is None or not verify_password(password, user_doc["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return issue_tokens(user_doc)


def issue_tokens(user_doc: dict[str, Any]) -> tuple[dict[str, Any], str, str]:
    store = get_store()
    role_doc = store.roles.find_one({"_id": user_doc["role_id"]}) or {"name": "employee", "permission_codes": []}
    access_token = create_token(user_doc["_id"], "access", timedelta(minutes=get_settings().access_token_expire_minutes), {"role": role_doc["name"]})
    refresh_token = create_token(user_doc["_id"], "refresh", timedelta(days=get_settings().refresh_token_expire_days))
    store.users.update_one({"_id": user_doc["_id"]}, {"$set": {"refresh_token_hash": hash_token(refresh_token), "updated_at": now()}})
    user_doc["refresh_token_hash"] = hash_token(refresh_token)
    return public_user(store, user_doc), access_token, refresh_token


def refresh_tokens(refresh_token: str) -> tuple[dict[str, Any], str, str]:
    payload = decode_token(refresh_token)
    if payload.get("typ") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    store = get_store()
    user_doc = store.users.find_one({"_id": payload["sub"], "deleted_at": None})
    if user_doc is None or user_doc.get("refresh_token_hash") != hash_token(refresh_token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked")
    return issue_tokens(user_doc)


def create_department(payload: DepartmentCreate, actor: dict[str, Any]) -> dict[str, Any]:
    store = get_store()
    doc = {
        "_id": new_id("dept"),
        "name": payload.name,
        "code": payload.code,
        "parent_id": payload.parent_id,
        "manager_id": payload.manager_id,
        "created_at": now(),
        "updated_at": now(),
        "deleted_at": None,
    }
    try:
        store.departments.insert_one(doc)
    except DuplicateKeyError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Department already exists") from exc
    log_activity(store, actor, "department.created", "department", doc["_id"])
    dashboard_cache.clear()
    return public_department(doc)


def create_category(payload: CategoryCreate, actor: dict[str, Any]) -> dict[str, Any]:
    store = get_store()
    doc = {
        "_id": new_id("cat"),
        "name": payload.name,
        "description": payload.description,
        "custom_fields": [field.model_dump() for field in payload.custom_fields],
        "created_at": now(),
        "updated_at": now(),
        "deleted_at": None,
    }
    try:
        store.categories.insert_one(doc)
    except DuplicateKeyError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category already exists") from exc
    log_activity(store, actor, "category.created", "category", doc["_id"])
    return public_category(doc)


def create_asset(payload: AssetCreate, actor: dict[str, Any]) -> dict[str, Any]:
    store = get_store()
    doc = {
        "_id": new_id("ast"),
        "tag": payload.tag,
        "name": payload.name,
        "serial_number": payload.serial_number,
        "status": payload.status.value if hasattr(payload, "status") and payload.status else AssetStatus.available.value,
        "category_id": payload.category_id,
        "department_id": payload.department_id,
        "assigned_to_id": payload.assigned_to_id,
        "location": payload.location,
        "purchase_date": payload.purchase_date,
        "purchase_value": payload.purchase_value,
        "health_score": payload.health_score,
        "metadata_json": payload.metadata_json,
        "created_at": now(),
        "updated_at": now(),
        "deleted_at": None,
    }
    try:
        store.assets.insert_one(doc)
    except DuplicateKeyError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Asset tag or serial number already exists") from exc
    store.asset_history.insert_one({"_id": new_id("ah"), "asset_id": doc["_id"], "actor_id": actor["_id"], "event_type": "created", "before": None, "after": payload.model_dump(mode="json"), "created_at": now(), "updated_at": now(), "deleted_at": None})
    log_activity(store, actor, "asset.created", "asset", doc["_id"])
    dashboard_cache.clear()
    return public_asset(store, doc)


def update_asset(asset_id: str, payload: AssetUpdate, actor: dict[str, Any]) -> dict[str, Any]:
    store = get_store()
    asset_doc = get_required(store.assets, asset_id, "Asset")
    before = {key: asset_doc.get(key) for key in ["status", "department_id", "assigned_to_id", "location", "health_score", "metadata_json"]}
    changes = payload.model_dump(exclude_unset=True)
    if "status" in changes and changes["status"] is not None:
        changes["status"] = changes["status"].value
    changes["updated_at"] = now()
    store.assets.update_one({"_id": asset_id}, {"$set": changes})
    store.asset_history.insert_one({"_id": new_id("ah"), "asset_id": asset_id, "actor_id": actor["_id"], "event_type": "updated", "before": before, "after": changes, "created_at": now(), "updated_at": now(), "deleted_at": None})
    log_activity(store, actor, "asset.updated", "asset", asset_id)
    dashboard_cache.clear()
    return public_asset(store, get_required(store.assets, asset_id, "Asset"))


def soft_delete_asset(asset_id: str, actor: dict[str, Any]) -> None:
    store = get_store()
    get_required(store.assets, asset_id, "Asset")
    store.assets.update_one({"_id": asset_id}, {"$set": {"deleted_at": now(), "updated_at": now()}})
    log_activity(store, actor, "asset.deleted", "asset", asset_id)
    dashboard_cache.clear()


def asset_query(search: str | None, status_filter: AssetStatus | None):
    store = get_store()
    query: dict[str, Any] = {"deleted_at": None}
    if status_filter:
        query["status"] = status_filter.value
    if search:
        query["$or"] = [
            {"tag": {"$regex": search, "$options": "i"}},
            {"name": {"$regex": search, "$options": "i"}},
            {"serial_number": {"$regex": search, "$options": "i"}},
        ]
    return store.assets.find(query).sort("created_at", -1)


def create_allocation(payload: AllocationCreate, actor: dict[str, Any]) -> dict[str, Any]:
    store = get_store()
    asset_doc = get_required(store.assets, payload.asset_id, "Asset")
    if asset_doc["status"] not in {AssetStatus.available.value, AssetStatus.booked.value}:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Asset is not available for allocation")
    doc = {
        "_id": new_id("alc"),
        "asset_id": payload.asset_id,
        "allocated_to_id": payload.allocated_to_id,
        "department_id": payload.department_id,
        "due_back_at": payload.due_back_at,
        "status": WorkflowStatus.active.value,
        "approved_by_id": actor["_id"],
        "created_at": now(),
        "updated_at": now(),
        "deleted_at": None,
    }
    store.allocations.insert_one(doc)
    store.assets.update_one({"_id": payload.asset_id}, {"$set": {"status": AssetStatus.allocated.value, "department_id": payload.department_id, "assigned_to_id": payload.allocated_to_id, "updated_at": now()}})
    notify(store, payload.allocated_to_id, "Asset allocated", f"{asset_doc['tag']} has been allocated to you.", "allocation")
    log_activity(store, actor, "allocation.created", "allocation", doc["_id"])
    dashboard_cache.clear()
    return public_allocation(store, doc)


def create_transfer(payload: TransferCreate, actor: dict[str, Any]) -> dict[str, Any]:
    store = get_store()
    get_required(store.assets, payload.asset_id, "Asset")
    doc = {
        "_id": new_id("trf"),
        "asset_id": payload.asset_id,
        "from_department_id": payload.from_department_id,
        "to_department_id": payload.to_department_id,
        "requested_by_id": actor["_id"],
        "status": WorkflowStatus.completed.value,
        "reason": payload.reason,
        "created_at": now(),
        "updated_at": now(),
        "deleted_at": None,
    }
    store.transfers.insert_one(doc)
    store.assets.update_one({"_id": payload.asset_id}, {"$set": {"department_id": payload.to_department_id, "updated_at": now()}})
    log_activity(store, actor, "transfer.completed", "transfer", doc["_id"])
    dashboard_cache.clear()
    return public_transfer(doc)


def create_booking(payload: BookingCreate, actor: dict[str, Any]) -> dict[str, Any]:
    store = get_store()
    asset_doc = get_required(store.assets, payload.asset_id, "Asset")
    if asset_doc["status"] in {AssetStatus.retired.value, AssetStatus.under_maintenance.value}:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Asset cannot be booked")
    conflict = store.bookings.find_one(
        {
            "asset_id": payload.asset_id,
            "deleted_at": None,
            "status": {"$in": [WorkflowStatus.active.value, WorkflowStatus.approved.value]},
            "starts_at": {"$lt": payload.ends_at},
            "ends_at": {"$gt": payload.starts_at},
        }
    )
    if conflict:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Booking conflicts with an existing reservation")
    doc = {
        "_id": new_id("bok"),
        "asset_id": payload.asset_id,
        "booked_by_id": actor["_id"],
        "starts_at": payload.starts_at,
        "ends_at": payload.ends_at,
        "status": WorkflowStatus.active.value,
        "purpose": payload.purpose,
        "created_at": now(),
        "updated_at": now(),
        "deleted_at": None,
    }
    store.bookings.insert_one(doc)
    store.assets.update_one({"_id": payload.asset_id}, {"$set": {"status": AssetStatus.booked.value, "updated_at": now()}})
    log_activity(store, actor, "booking.created", "booking", doc["_id"])
    dashboard_cache.clear()
    return public_booking(doc)


def create_maintenance(payload: MaintenanceCreate, actor: dict[str, Any]) -> dict[str, Any]:
    store = get_store()
    get_required(store.assets, payload.asset_id, "Asset")
    doc = {
        "_id": new_id("mnt"),
        "asset_id": payload.asset_id,
        "requested_by_id": actor["_id"],
        "assigned_to_id": payload.assigned_to_id,
        "status": MaintenanceStatus.pending.value,
        "priority": payload.priority,
        "issue": payload.issue,
        "resolution": None,
        "created_at": now(),
        "updated_at": now(),
        "deleted_at": None,
    }
    store.maintenance.insert_one(doc)
    store.maintenance_history.insert_one({"_id": new_id("mnh"), "maintenance_id": doc["_id"], "actor_id": actor["_id"], "status": MaintenanceStatus.pending.value, "note": payload.issue, "created_at": now(), "updated_at": now(), "deleted_at": None})
    store.assets.update_one({"_id": payload.asset_id}, {"$set": {"status": AssetStatus.under_maintenance.value, "updated_at": now()}})
    log_activity(store, actor, "maintenance.created", "maintenance", doc["_id"])
    dashboard_cache.clear()
    return public_maintenance(doc)


def create_audit_cycle(payload: AuditCycleCreate, actor: dict[str, Any]) -> dict[str, Any]:
    store = get_store()
    doc = {
        "_id": new_id("aud"),
        "name": payload.name,
        "department_id": payload.department_id,
        "starts_at": payload.starts_at,
        "ends_at": payload.ends_at,
        "status": WorkflowStatus.active.value,
        "created_at": now(),
        "updated_at": now(),
        "deleted_at": None,
    }
    store.audit_cycles.insert_one(doc)
    asset_filter = {"deleted_at": None}
    if payload.department_id:
        asset_filter["department_id"] = payload.department_id
    for asset_doc in store.assets.find(asset_filter):
        store.audit_items.insert_one(
            {
                "_id": new_id("ait"),
                "audit_cycle_id": doc["_id"],
                "asset_id": asset_doc["_id"],
                "status": AuditItemStatus.pending.value,
                "expected_location": asset_doc.get("location"),
                "observed_location": None,
                "notes": None,
                "created_at": now(),
                "updated_at": now(),
                "deleted_at": None,
            }
        )
    log_activity(store, actor, "audit.created", "audit_cycle", doc["_id"])
    return public_audit_cycle(doc)


def dashboard() -> dict[str, Any]:
    cached = dashboard_cache.get()
    if cached:
        return cached
    store = get_store()
    counts = {doc["_id"]: doc["count"] for doc in store.assets.aggregate([{"$match": {"deleted_at": None}}, {"$group": {"_id": "$status", "count": {"$sum": 1}}}])}
    payload = {
        "total_assets": sum(counts.values()),
        "assets_by_status": counts,
        "open_maintenance": store.maintenance.count_documents({"deleted_at": None, "status": {"$nin": [MaintenanceStatus.resolved.value, MaintenanceStatus.cancelled.value]}}),
        "active_bookings": store.bookings.count_documents({"deleted_at": None, "status": WorkflowStatus.active.value, "ends_at": {"$gte": now()}}),
        "departments": store.departments.count_documents({"deleted_at": None}),
    }
    return dashboard_cache.set(payload, 30)


def generate_report(report_type: str, actor: dict[str, Any]) -> dict[str, Any]:
    store = get_store()
    payload = dashboard() if report_type == "dashboard" else {"report_type": report_type, "generated_at": now().isoformat()}
    doc = {
        "_id": new_id("rpt"),
        "name": f"{report_type.title()} Report",
        "report_type": report_type,
        "generated_by_id": actor["_id"],
        "payload": payload,
        "created_at": now(),
        "updated_at": now(),
        "deleted_at": None,
    }
    store.reports.insert_one(doc)
    log_activity(store, actor, "report.generated", "report", doc["_id"])
    return public_report(doc)


def asset_list(limit: int, offset: int, search: str | None, status_filter: AssetStatus | None) -> dict[str, Any]:
    store = get_store()
    query: dict[str, Any] = {"deleted_at": None}
    if status_filter:
        query["status"] = status_filter.value
    if search:
        query["$or"] = [
            {"tag": {"$regex": search, "$options": "i"}},
            {"name": {"$regex": search, "$options": "i"}},
            {"serial_number": {"$regex": search, "$options": "i"}},
        ]
    total = store.assets.count_documents(query)
    cursor = store.assets.find(query).sort("created_at", -1).skip(offset).limit(limit)
    return paginate(cursor, total, limit, offset, lambda doc: public_asset(store, doc))


def list_collection(collection: Collection, limit: int, offset: int, query: dict[str, Any], converter) -> dict[str, Any]:
    total = collection.count_documents(query)
    cursor = collection.find(query).sort("created_at", -1).skip(offset).limit(limit)
    return paginate(cursor, total, limit, offset, converter)


def list_departments(limit: int, offset: int) -> dict[str, Any]:
    store = get_store()
    return list_collection(store.departments, limit, offset, {"deleted_at": None}, public_department)


def list_categories(limit: int, offset: int) -> dict[str, Any]:
    store = get_store()
    return list_collection(store.categories, limit, offset, {"deleted_at": None}, public_category)


def list_allocations(limit: int, offset: int) -> dict[str, Any]:
    store = get_store()
    return list_collection(store.allocations, limit, offset, {"deleted_at": None}, lambda doc: public_allocation(store, doc))


def list_transfers(limit: int, offset: int) -> dict[str, Any]:
    store = get_store()
    return list_collection(store.transfers, limit, offset, {"deleted_at": None}, public_transfer)


def list_bookings(limit: int, offset: int) -> dict[str, Any]:
    store = get_store()
    return list_collection(store.bookings, limit, offset, {"deleted_at": None}, public_booking)


def list_maintenance(limit: int, offset: int) -> dict[str, Any]:
    store = get_store()
    return list_collection(store.maintenance, limit, offset, {"deleted_at": None}, public_maintenance)


def list_audits(limit: int, offset: int) -> dict[str, Any]:
    store = get_store()
    return list_collection(store.audit_cycles, limit, offset, {"deleted_at": None}, public_audit_cycle)


def list_audit_items(audit_id: str, limit: int, offset: int) -> dict[str, Any]:
    store = get_store()
    return list_collection(store.audit_items, limit, offset, {"deleted_at": None, "audit_cycle_id": audit_id}, public_audit_item)


def list_notifications(user_id: str, limit: int, offset: int) -> dict[str, Any]:
    store = get_store()
    return list_collection(store.notifications, limit, offset, {"deleted_at": None, "user_id": user_id}, public_notification)


def list_activity(limit: int, offset: int) -> dict[str, Any]:
    store = get_store()
    return list_collection(store.activity_logs, limit, offset, {"deleted_at": None}, public_activity)


async def ai_generate(feature: str, prompt: str, actor: dict[str, Any], context: dict[str, Any] | None = None) -> AIResponse:
    store = get_store()
    settings = get_settings()
    fallback = deterministic_ai(feature, prompt, context)
    if not settings.gemini_api_key:
        store.ai_logs.insert_one({"_id": new_id("ail"), "user_id": actor["_id"], "feature": feature, "prompt": prompt, "response": fallback, "provider": "fallback", "success": True, "created_at": now(), "updated_at": now(), "deleted_at": None})
        return AIResponse(response=fallback, provider="fallback", fallback=True)
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent?key={settings.gemini_api_key}"
        body = {"contents": [{"parts": [{"text": f"Feature: {feature}\nContext: {context or {}}\nPrompt: {prompt}"}]}]}
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(url, json=body)
            response.raise_for_status()
        text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        store.ai_logs.insert_one({"_id": new_id("ail"), "user_id": actor["_id"], "feature": feature, "prompt": prompt, "response": text, "provider": "gemini", "success": True, "created_at": now(), "updated_at": now(), "deleted_at": None})
        return AIResponse(response=text, provider="gemini", fallback=False)
    except Exception:
        store.ai_logs.insert_one({"_id": new_id("ail"), "user_id": actor["_id"], "feature": feature, "prompt": prompt, "response": fallback, "provider": "fallback", "success": False, "created_at": now(), "updated_at": now(), "deleted_at": None})
        return AIResponse(response=fallback, provider="fallback", fallback=True)


def deterministic_ai(feature: str, prompt: str, context: dict[str, Any] | None) -> str:
    if feature == "maintenance_prediction":
        return "Assets with health_score below 70 or repeated maintenance events should be inspected first."
    if feature == "asset_recommendation":
        return "Prioritize available assets in the same department and category before procurement."
    if feature == "report_summary":
        return "Summary unavailable from AI provider; dashboard metrics were generated deterministically."
    return f"I can help with asset operations. Relevant request: {prompt[:240]}"


def approve_allocation(allocation_id: str, actor: dict[str, Any]) -> dict[str, Any]:
    """Approve a pending allocation."""
    store = get_store()
    doc = get_required(store.allocations, allocation_id, "Allocation")
    if doc.get("status") != WorkflowStatus.pending.value:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Allocation is not pending")
    store.allocations.update_one(
        {"_id": allocation_id},
        {"$set": {"status": WorkflowStatus.active.value, "approved_by_id": actor["_id"], "updated_at": now()}},
    )
    store.assets.update_one(
        {"_id": doc["asset_id"]},
        {"$set": {"status": AssetStatus.allocated.value, "assigned_to_id": doc["allocated_to_id"], "department_id": doc["department_id"], "updated_at": now()}},
    )
    notify(store, doc["allocated_to_id"], "Allocation approved", f"Your allocation request has been approved.", "allocation")
    log_activity(store, actor, "allocation.approved", "allocation", allocation_id)
    dashboard_cache.clear()
    return public_allocation(store, {**doc, "status": WorkflowStatus.active.value, "approved_by_id": actor["_id"]})


def complete_allocation(allocation_id: str, actor: dict[str, Any]) -> dict[str, Any]:
    """Mark an active allocation as completed (asset returned)."""
    store = get_store()
    doc = get_required(store.allocations, allocation_id, "Allocation")
    if doc.get("status") != WorkflowStatus.active.value:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Allocation is not active")
    store.allocations.update_one(
        {"_id": allocation_id},
        {"$set": {"status": WorkflowStatus.completed.value, "updated_at": now()}},
    )
    store.assets.update_one(
        {"_id": doc["asset_id"]},
        {"$set": {"status": AssetStatus.available.value, "assigned_to_id": None, "updated_at": now()}},
    )
    notify(store, doc["allocated_to_id"], "Allocation completed", "Your asset has been returned successfully.", "allocation")
    log_activity(store, actor, "allocation.completed", "allocation", allocation_id)
    dashboard_cache.clear()
    return public_allocation(store, {**doc, "status": WorkflowStatus.completed.value})


def resolve_maintenance(maintenance_id: str, resolution: str, actor: dict[str, Any]) -> dict[str, Any]:
    """Resolve a maintenance ticket and return the asset to available status."""
    store = get_store()
    doc = get_required(store.maintenance, maintenance_id, "Maintenance")
    terminal = {MaintenanceStatus.resolved.value, MaintenanceStatus.cancelled.value}
    if doc.get("status") in terminal:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Maintenance is already closed")
    store.maintenance.update_one(
        {"_id": maintenance_id},
        {"$set": {"status": MaintenanceStatus.resolved.value, "resolution": resolution, "updated_at": now()}},
    )
    store.maintenance_history.insert_one({
        "_id": new_id("mnh"),
        "maintenance_id": maintenance_id,
        "actor_id": actor["_id"],
        "status": MaintenanceStatus.resolved.value,
        "note": resolution,
        "created_at": now(),
        "updated_at": now(),
        "deleted_at": None,
    })
    store.assets.update_one(
        {"_id": doc["asset_id"]},
        {"$set": {"status": AssetStatus.available.value, "updated_at": now()}},
    )
    notify(store, doc["requested_by_id"], "Maintenance resolved", f"Issue has been resolved: {resolution[:120]}", "maintenance")
    log_activity(store, actor, "maintenance.resolved", "maintenance", maintenance_id)
    dashboard_cache.clear()
    return public_maintenance({**doc, "status": MaintenanceStatus.resolved.value, "resolution": resolution})


def mark_notification_read(notification_id: str, user_id: str) -> None:
    """Mark a notification as read for the given user."""
    store = get_store()
    result = store.notifications.update_one(
        {"_id": notification_id, "user_id": user_id, "deleted_at": None},
        {"$set": {"read_at": now(), "updated_at": now()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
