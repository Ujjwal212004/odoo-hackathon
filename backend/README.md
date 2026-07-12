# AssetFlow Backend

Production-quality REST API for the AssetFlow Enterprise Asset Management System.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | FastAPI 0.115 |
| Database | MongoDB (PyMongo) / mongomock for local dev |
| Auth | JWT (python-jose) + bcrypt |
| Validation | Pydantic v2 |
| AI | Google Gemini (optional, with deterministic fallback) |
| Testing | pytest + mongomock |

## Quick Start

```bash
# 1. Create virtual environment
python -m venv .venv
.venv\Scripts\activate     # Windows
# source .venv/bin/activate  # macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment (mongomock = no external DB needed)
copy .env.example .env

# 4. Run the server
uvicorn app.main:app --reload --port 8000

# 5. Open Swagger docs
# http://localhost:8000/docs
```

## Running Tests

```bash
pytest tests/ -v
```

Tests run against mongomock — no MongoDB instance required.

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register (first user → admin) |
| POST | `/auth/login` | Login → JWT tokens |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Current user profile |

### Departments
| Method | Path | Description |
|--------|------|-------------|
| POST | `/departments` | Create department |
| GET | `/departments` | List departments |

### Categories
| Method | Path | Description |
|--------|------|-------------|
| POST | `/categories` | Create asset category |
| GET | `/categories` | List categories |

### Assets
| Method | Path | Description |
|--------|------|-------------|
| POST | `/assets` | Create asset |
| GET | `/assets` | List/search/filter assets |
| GET | `/assets/{id}` | Get asset detail |
| PATCH | `/assets/{id}` | Update asset |
| DELETE | `/assets/{id}` | Soft-delete asset |

### Allocations
| Method | Path | Description |
|--------|------|-------------|
| POST | `/allocations` | Create allocation |
| GET | `/allocations` | List allocations |
| PATCH | `/allocations/{id}/approve` | Approve pending allocation |
| PATCH | `/allocations/{id}/complete` | Complete (return asset) |

### Transfers
| Method | Path | Description |
|--------|------|-------------|
| POST | `/transfers` | Create transfer |
| GET | `/transfers` | List transfers |

### Bookings
| Method | Path | Description |
|--------|------|-------------|
| POST | `/bookings` | Create booking (conflict-checked) |
| GET | `/bookings` | List bookings |

### Maintenance
| Method | Path | Description |
|--------|------|-------------|
| POST | `/maintenance` | Create maintenance ticket |
| GET | `/maintenance` | List maintenance tickets |
| PATCH | `/maintenance/{id}/resolve` | Resolve with resolution text |

### Audits
| Method | Path | Description |
|--------|------|-------------|
| POST | `/audits` | Create audit cycle (auto-populates items) |
| GET | `/audits` | List audit cycles |
| GET | `/audits/{id}/items` | List audit items |

### Dashboard & Reports
| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard` | Aggregated stats (cached) |
| POST | `/reports/{type}` | Generate report |

### Notifications
| Method | Path | Description |
|--------|------|-------------|
| GET | `/notifications` | List user notifications |
| PATCH | `/notifications/{id}/read` | Mark as read |

### Activity Logs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/activity-logs` | List activity logs |

### AI Features
| Method | Path | Description |
|--------|------|-------------|
| POST | `/ai/chat` | AI chat assistant |
| POST | `/ai/report-summary` | AI report summary |
| POST | `/ai/maintenance-prediction` | Maintenance predictions |
| POST | `/ai/asset-recommendation` | Asset recommendations |

## Environment Variables

See [`.env.example`](.env.example) for all available settings. Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_USE_MOCK` | `true` | Use mongomock (no real MongoDB needed) |
| `MONGODB_URI` | `mongodb://localhost:27017` | MongoDB connection string |
| `JWT_SECRET_KEY` | — | **Must change in production** |
| `GEMINI_API_KEY` | — | Optional; enables AI features |

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py          # Pydantic settings
│   ├── database.py        # MongoStore, indexes, seeding
│   ├── dependencies.py    # Auth, RBAC, request context
│   ├── main.py            # App factory, middleware
│   ├── models.py          # Enum definitions
│   ├── routes.py          # API endpoint handlers
│   ├── schemas.py         # Pydantic request/response models
│   ├── security.py        # JWT, password hashing
│   └── services.py        # Business logic layer
├── tests/
│   └── test_api.py        # Comprehensive API tests
├── docs/
├── .env.example
├── CLAUDE.md              # Project memory
├── README.md
└── requirements.txt
```

Built for Hackathon 2026 🚀
