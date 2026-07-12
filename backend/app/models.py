import enum


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
