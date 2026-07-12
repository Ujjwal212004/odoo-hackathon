# AssetFlow Backend Memory

## Current Milestone

Backend foundation implemented on branch `backend`.

## Completed Modules

- FastAPI app factory, OpenAPI, CORS, structured logging, centralized database error handling.
- SQLAlchemy schema for users, roles, permissions, departments, asset categories, custom fields, assets, asset history, allocations, transfers, bookings, maintenance, maintenance history, audits, notifications, activity logs, reports, and AI logs.
- JWT authentication with refresh token rotation and bcrypt password hashing.
- RBAC dependency with seeded admin, manager, and employee roles.
- Core APIs for departments, categories, assets, allocation, transfers, bookings, maintenance, audits, dashboard, reports, notifications, activity logs, and AI features.
- Booking conflict validation, asset lifecycle status changes, activity logging, notifications, soft deletes, indexes, and dashboard cache.
- AI chat, report summary, maintenance prediction, and asset recommendation with Gemini integration and deterministic fallback.
- Backend README, API notes, environment template, and pytest smoke tests.

## Remaining Modules

- Generate and commit Alembic migration files after installing backend dependencies.
- Add deeper workflow status transition endpoints for approvals and maintenance resolution.
- Integrate frontend data layer with `/api/v1` endpoints.
- Add CI for backend tests and linting.

## Architecture Decisions

- FastAPI + SQLAlchemy 2.x + Pydantic v2 for a lean, typed Python backend.
- PostgreSQL is the production target; SQLite remains the default local/test fallback for frictionless hackathon runs.
- Bearer JWTs avoid cookie CSRF exposure; CSRF tokens are only needed if tokens move into cookies.
- AI provider calls are optional and isolated so missing credentials never break core operations.
- Dashboard stats use a short in-memory TTL cache and are invalidated on writes.

## Database Decisions

- UUID string primary keys keep client references stable.
- Soft deletes use `deleted_at` on primary tables.
- High-traffic queries have indexes on status, category, department, booking windows, and searchable asset fields.
- Unique constraints protect role names, permission codes, department codes, asset tags, serial numbers, category names, and audit asset membership.

## API Decisions

- Routes are versioned under `/api/v1`.
- List endpoints support `limit` and `offset`; assets also support search and status filtering.
- Business operations write activity logs in the same transaction as state changes.
- First registered user becomes admin to avoid requiring seed credentials.

## Assumptions

- Frontend currently uses mock data and can be migrated endpoint-by-endpoint.
- Department managers and approval chains can be inferred from department membership after frontend requirements solidify.
- Gemini is the intended provider based on project README, but the service can be swapped behind `ai_generate`.

## Known Issues

- Alembic migration files are not generated yet.
- In-memory rate limiting and caching are process-local; use Redis for multi-worker production deployments.

## Future Work

- Add workflow transition endpoints with full audit trails.
- Add bulk import/export and file validation.
- Add PostgreSQL full-text search for large asset inventories.
- Add Redis-backed job queue for notifications and report generation.

## Latest Commit

Pending initial backend commit.
