# API Notes

All business endpoints are under `/api/v1`.

## Auth Flow

1. `POST /auth/register` creates a user. The first user receives the `admin` role.
2. `POST /auth/login` returns access and refresh JWTs.
3. Use `Authorization: Bearer <access_token>` on protected endpoints.
4. `POST /auth/refresh` rotates refresh tokens.

## RBAC

Roles own permission codes such as `assets:read`, `assets:write`, `bookings:write`, and `reports:read`. The built-in `admin` role bypasses individual permission checks.

## Pagination

List endpoints use `limit` and `offset` and return:

```json
{
  "items": [],
  "total": 0,
  "limit": 50,
  "offset": 0
}
```

## AI

AI endpoints never require provider credentials to function. Without `GEMINI_API_KEY`, the backend returns safe deterministic guidance and records the fallback in `ai_logs`.
