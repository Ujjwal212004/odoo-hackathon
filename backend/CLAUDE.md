# AssetFlow Backend Memory

## Current Milestone

Backend fully implemented on branch `backend` — MongoDB with mongomock for local/test.

## Completed Modules

- FastAPI app factory with OpenAPI, CORS, structured JSON logging, rate limiting, and centralized error handling.
- MongoDB data layer via PyMongo with mongomock fallback for zero-dependency local development and testing.
- Full document schema: users, roles, permissions, departments, asset categories (with custom fields), assets, asset history, allocations, transfers, bookings, maintenance, maintenance history, audit cycles, audit items, notifications, activity logs, reports, AI logs.
- Comprehensive indexes: unique constraints on email, role name, permission code, department name/code, asset tag, serial number, category name; compound indexes on status/category, booking windows, audit cycle/asset.
- JWT authentication with refresh token rotation, bcrypt password hashing, token hash storage.
- RBAC dependency with admin bypass; seeded admin, manager, and employee roles with granular permission codes.
- Full CRUD APIs: departments, categories, assets (with search/filter/pagination).
- Asset lifecycle: allocation (with approve/complete workflow), transfers, bookings (with conflict validation), maintenance (with resolve workflow), audits (auto-populates audit items from assets).
- Dashboard with TTL cache, report generation, notifications (with mark-as-read), activity logging.
- AI chat, report summary, maintenance prediction, asset recommendation via Gemini with deterministic fallback.
- Comprehensive pytest test suite (13+ tests) running against mongomock.
- Backend README, API docs, environment template.

## Remaining Modules

- Integrate frontend data layer with `/api/v1` endpoints (replace mock data).
- Add CI pipeline for backend tests and linting.
- Add bulk import/export and file upload validation.

## Architecture Decisions

- FastAPI + PyMongo + Pydantic v2 for a lean, typed Python backend.
- MongoDB is the data store; mongomock provides a zero-dependency local/test fallback.
- Bearer JWTs avoid cookie CSRF exposure; refresh tokens use SHA-256 hash storage.
- AI provider calls are optional and isolated — missing credentials never break core operations.
- Dashboard stats use a short in-memory TTL cache, invalidated on any write operation.
- All service functions are self-contained (call `get_store()` internally) for clean dependency injection.

## Database Decisions

- Documents use prefixed UUID string IDs (e.g., `usr-abc123`, `ast-def456`).
- Soft deletes via `deleted_at` field on all collections.
- High-traffic queries have compound indexes on status, category, department, booking windows, and searchable asset fields.
- Unique indexes protect role names, permission codes, department codes, asset tags, serial numbers, category names, and audit asset membership.

## API Decisions

- Routes versioned under `/api/v1`.
- List endpoints support `limit`/`offset` pagination with total counts.
- Assets support `search` (regex on tag/name/serial) and `status` filtering.
- Business operations write activity logs atomically with state changes.
- First registered user automatically becomes admin.
- Workflow endpoints: `PATCH /allocations/{id}/approve`, `PATCH /allocations/{id}/complete`, `PATCH /maintenance/{id}/resolve`, `PATCH /notifications/{id}/read`.

## Assumptions

- Frontend currently uses mock data and can be migrated endpoint-by-endpoint.
- Department managers and approval chains inferred from department membership after frontend requirements solidify.
- Gemini is the AI provider per project README; service can be swapped behind `ai_generate`.

## Known Issues

- In-memory rate limiting and dashboard cache are process-local; use Redis for multi-worker production deployments.
- mongomock does not support all MongoDB features (e.g., `$text` index queries); production should use real MongoDB.

## Future Work

- Add workflow transition endpoints with full approval chains.
- Add bulk import/export and file validation.
- Add MongoDB full-text search for large asset inventories.
- Add Redis-backed job queue for async notifications and report generation.
- Add WebSocket support for real-time notifications.

## Latest Commit

Backend fix and completion — aligned all layers to MongoDB, added workflow endpoints, comprehensive tests.
