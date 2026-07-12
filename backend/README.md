# AssetFlow Backend

FastAPI backend for enterprise asset management: JWT auth, RBAC, departments, categories, assets, allocation, transfers, bookings, maintenance, audits, reports, notifications, activity logs, and AI-assisted workflows.

## Run

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

OpenAPI docs are available at `http://localhost:8000/docs`.

## Configuration

- `DATABASE_URL` defaults to SQLite for local development if omitted; set it to PostgreSQL in production.
- `JWT_SECRET_KEY` must be replaced with a strong random secret outside development.
- `GEMINI_API_KEY` is optional. AI endpoints fall back to deterministic responses when it is absent or the provider fails.
- Browser clients use Bearer tokens. CSRF protection is not required for Authorization-header API calls; do not store tokens in cookies without adding CSRF tokens.

## Database

The schema uses SQLAlchemy models with explicit foreign keys, unique constraints, soft deletes, and indexes for common filters. For production migrations, initialize Alembic from `backend/` and generate the first migration from `app.models.Base.metadata`.

## Default Data

Startup seeds roles, permissions, an IT department, and initial categories. The first registered user becomes `admin`; later users become `employee`.

## Tests

```bash
cd backend
pytest
```
