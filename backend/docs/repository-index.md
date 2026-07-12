# Repository Index

## Existing Application

- `src/` contains a Vite React application using React Router and static mock data from `src/app/data/mockData.ts`.
- `src/app/router.tsx` defines landing, login, dashboard, assets, allocation, transfers, booking, maintenance, audit, reports, notifications, and settings pages.
- No existing backend implementation was present before this branch.
- `package.json` only defines frontend `dev` and `build` scripts.

## Backend Implementation

- `backend/app/main.py` creates the FastAPI app, CORS, rate limiting, structured request logging, exception handling, startup schema creation, and default seed data.
- `backend/app/models.py` is the SQLAlchemy symbol index for all persisted business entities.
- `backend/app/schemas.py` defines Pydantic request and response contracts.
- `backend/app/routes.py` maps REST endpoints under `/api/v1`.
- `backend/app/services.py` owns transaction-safe business workflows: auth, assets, bookings, allocation, transfers, maintenance, audits, reports, notifications, activity logs, and AI fallback.
- `backend/app/dependencies.py` provides authentication and RBAC middleware dependencies.
- `backend/app/security.py` owns password hashing, refresh-token hashing, and JWT creation/validation.

## Dependency Graph

```text
main -> routes -> dependencies -> security
main -> services -> models
routes -> services -> models
routes -> schemas
database -> models
tests -> main
```

## API Surface

- Auth: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/me`
- Core data: `/departments`, `/categories`, `/assets`
- Workflows: `/allocations`, `/transfers`, `/bookings`, `/maintenance`, `/audits`
- Intelligence: `/dashboard`, `/reports/{report_type}`, `/ai/*`
- Operations: `/notifications`, `/activity-logs`

## Ponytail Use

Ponytail was inspected and applied as a constraint for backend understanding and implementation: reuse existing frontend mock-domain concepts, avoid speculative abstractions, prefer framework-native FastAPI/OpenAPI and SQLAlchemy constraints, and keep the backend compact while preserving validation, security, and error handling.
