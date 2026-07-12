from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from typing import Any

from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

from app.config import get_settings


@dataclass(frozen=True)
class MongoStore:
    client: MongoClient
    db: Database

    @property
    def users(self) -> Collection:
        return self.db.users

    @property
    def roles(self) -> Collection:
        return self.db.roles

    @property
    def permissions(self) -> Collection:
        return self.db.permissions

    @property
    def departments(self) -> Collection:
        return self.db.departments

    @property
    def categories(self) -> Collection:
        return self.db.asset_categories

    @property
    def assets(self) -> Collection:
        return self.db.assets

    @property
    def asset_history(self) -> Collection:
        return self.db.asset_history

    @property
    def allocations(self) -> Collection:
        return self.db.allocations

    @property
    def transfers(self) -> Collection:
        return self.db.transfers

    @property
    def bookings(self) -> Collection:
        return self.db.bookings

    @property
    def maintenance(self) -> Collection:
        return self.db.maintenance

    @property
    def maintenance_history(self) -> Collection:
        return self.db.maintenance_history

    @property
    def audit_cycles(self) -> Collection:
        return self.db.audit_cycles

    @property
    def audit_items(self) -> Collection:
        return self.db.audit_items

    @property
    def notifications(self) -> Collection:
        return self.db.notifications

    @property
    def activity_logs(self) -> Collection:
        return self.db.activity_logs

    @property
    def reports(self) -> Collection:
        return self.db.reports

    @property
    def ai_logs(self) -> Collection:
        return self.db.ai_logs


def _create_client() -> MongoClient:
    settings = get_settings()
    if settings.mongo_use_mock or settings.environment == "test" or settings.mongodb_uri.startswith("mongomock://"):
        from mongomock import MongoClient as MockMongoClient

        return MockMongoClient()
    return MongoClient(settings.mongodb_uri, serverSelectionTimeoutMS=5000)


@lru_cache(maxsize=1)
def get_store() -> MongoStore:
    settings = get_settings()
    client = _create_client()
    db = client[settings.mongodb_database]
    store = MongoStore(client=client, db=db)
    create_indexes(store)
    return store


def create_indexes(store: MongoStore) -> None:
    store.users.create_index([("email", ASCENDING)], unique=True)
    store.roles.create_index([("name", ASCENDING)], unique=True)
    store.permissions.create_index([("code", ASCENDING)], unique=True)
    store.departments.create_index([("name", ASCENDING)], unique=True)
    store.departments.create_index([("code", ASCENDING)], unique=True)
    store.categories.create_index([("name", ASCENDING)], unique=True)
    store.assets.create_index([("tag", ASCENDING)], unique=True)
    store.assets.create_index([("serial_number", ASCENDING)], unique=True, sparse=True)
    store.assets.create_index([("status", ASCENDING), ("category_id", ASCENDING)])
    store.assets.create_index([("tag", "text"), ("name", "text"), ("serial_number", "text")])
    store.asset_history.create_index([("asset_id", ASCENDING), ("created_at", DESCENDING)])
    store.allocations.create_index([("asset_id", ASCENDING), ("status", ASCENDING)])
    store.transfers.create_index([("asset_id", ASCENDING), ("status", ASCENDING)])
    store.bookings.create_index([("asset_id", ASCENDING), ("starts_at", ASCENDING), ("ends_at", ASCENDING)])
    store.maintenance.create_index([("asset_id", ASCENDING), ("status", ASCENDING)])
    store.audit_items.create_index([("audit_cycle_id", ASCENDING), ("asset_id", ASCENDING)], unique=True)
    store.notifications.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
    store.activity_logs.create_index([("created_at", DESCENDING)])
    store.reports.create_index([("report_type", ASCENDING), ("created_at", DESCENDING)])
    store.ai_logs.create_index([("user_id", ASCENDING), ("feature", ASCENDING), ("created_at", DESCENDING)])


def reset_store() -> None:
    get_store().db.drop_collection("users")
    for collection_name in [
        "roles",
        "permissions",
        "departments",
        "asset_categories",
        "assets",
        "asset_history",
        "allocations",
        "transfers",
        "bookings",
        "maintenance",
        "maintenance_history",
        "audit_cycles",
        "audit_items",
        "notifications",
        "activity_logs",
        "reports",
        "ai_logs",
    ]:
        get_store().db.drop_collection(collection_name)
    create_indexes(get_store())


def seed_defaults(store: MongoStore) -> None:
    if store.roles.count_documents({}) > 0:
        return
    permissions = [{"_id": code, "code": code, "description": code.replace(":", " ")} for code in ALL_PERMISSIONS]
    roles = [
        {"_id": "admin", "name": "admin", "description": "System administrator", "permission_codes": ALL_PERMISSIONS},
        {
            "_id": "manager",
            "name": "manager",
            "description": "Department manager",
            "permission_codes": [code for code in ALL_PERMISSIONS if code != "activity:read"],
        },
        {
            "_id": "employee",
            "name": "employee",
            "description": "Employee self-service",
            "permission_codes": ["assets:read", "bookings:write", "notifications:read", "ai:use"],
        },
    ]
    store.permissions.insert_many(permissions)
    store.roles.insert_many(roles)
    store.departments.insert_one({"_id": "dept-it", "name": "Information Technology", "code": "IT", "parent_id": None, "manager_id": None})
    store.categories.insert_many(
        [
            {"_id": "cat-laptop", "name": "Laptop", "description": "Portable computers", "custom_fields": []},
            {"_id": "cat-display", "name": "Display", "description": "Monitors and display devices", "custom_fields": []},
            {"_id": "cat-equipment", "name": "Equipment", "description": "Shared workplace equipment", "custom_fields": []},
        ]
    )


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
