# 🚀 POPPY - Enterprise Asset Management System

> **AI-Powered Enterprise Asset & Resource Management Platform**
>
> ![Coding GIF](https://media.giphy.com/media/SvZvO5c0VabM0/giphy.gif)

POPPY is a modern, full-stack ERP system that streamlines enterprise asset tracking, allocation, maintenance, resource booking, and audit management through an intelligent, role-based platform. Built for the Hackathon 2026 with production-ready architecture.

---

## 🎯 What POPPY Does

| Feature | Description | Visual |
|---------|-------------|--------|
| 📦 **Asset Management** | Register, track, and manage asset lifecycle | ![Asset Icon](https://media.giphy.com/media/3ohzdKZ5I0CP3bAJDO/giphy.gif) |
| 🔄 **Allocation & Transfers** | Streamlined workflow for resource allocation | ![Flow Icon](https://media.giphy.com/media/3o7TKU9qKTrM5gAEfu/giphy.gif) |
| 🗓️ **Resource Booking** | Smart conflict-detection booking system | ![Calendar Icon](https://media.giphy.com/media/26u48Ial4rE06TCik/giphy.gif) |
| 🔧 **Maintenance Tracking** | Request, approve, and resolve maintenance tickets | ![Tools Icon](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif) |
| 📋 **Audit Management** | Automated audit cycles with discrepancy reporting | ![Checklist Icon](https://media.giphy.com/media/l0HlQaQ6HzIbYWI0w/giphy.gif) |
| 📊 **Analytics Dashboard** | Real-time insights and performance metrics | ![Charts Icon](https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif) |
| 🤖 **AI Features** | Gemini-powered predictions and recommendations | ![AI Icon](https://media.giphy.com/media/xT9IgEx8SbW7gf6Sj2/giphy.gif) |
| 👥 **RBAC** | Role-based access control for security | ![Security Icon](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif) |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     POPPY PLATFORM                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📱 FRONTEND (React 18.3 + Vite + Tailwind)                │
│  ![Frontend GIF](https://media.giphy.com/media/g9Ys7m02             │
│  ├─ Modern UI Components (Radix UI + shadcn)             │
│  ├─ Drag-and-Drop Support (react-dnd)                     │
│  ├─ Real-time Charts (recharts)                           │
│  └─ State Management (React Router)                        │
│                                                              │
│              🔗 REST API (JSON)                            │
│  ![API GIF](https://media.giphy.com/media/3oKIPf3C7HqqYE6209  │
│                                                              │
│  🔧 BACKEND (FastAPI 0.115 + Python)                      │
│  ![Backend GIF](https://media.giphy.com/media/l0Hlv         │
│  ├─ JWT Authentication + RBAC                             │
│  ├─ Pydantic v2 Validation                                │
│  ├─ Async Request Handling                                │
│  └─ AI Integration (Google Gemini)                        │
│                                                              │
│  🗄️ DATABASE (MongoDB or mongomock)                        │
│  ![Database GIF](https://media.giphy.com/media/3oKIPj       │
│  ├─ Flexible Schema for Complex Assets                    │
│  ├─ Indexed Collections for Fast Queries                  │
│  └─ Automatic Data Seeding                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Tech Stack

### **Frontend Branch (main)**

```
Language:        TypeScript (95.7%)
Framework:       React 18.3 + Vite
Styling:         Tailwind CSS 4.1 + Radix UI Components
UI Components:   shadcn/ui (20+ components)
State & Routing: React Router v7
Forms:           React Hook Form 7.55
Charts:          Recharts 2.15
Animations:      Motion 12.23 + Canvas Confetti 🎉
Icons:           Lucide React 0.487
```

![React GIF](https://media.giphy.com/media/l0HlDy9x8FZo0XO1i/giphy.gif)

### **Backend Branch (backend)**

```
Language:        Python 3.x  🐍
Framework:       FastAPI 0.115 + Uvicorn
Database:        MongoDB (PyMongo) / mongomock (dev)
Validation:      Pydantic v2
Auth:            JWT (python-jose) + bcrypt 🔐
API Docs:        Swagger/OpenAPI Auto-generated
Testing:         pytest + mongomock ✅
AI:              Google Gemini API (optional) 🤖
```

![Python GIF](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)

---

## 📂 Project Structure

### **Frontend** (`main` branch)

```
src/
├── components/          UI Components (Radix + shadcn)
│   ├── ui/             Base components (buttons, dialogs, etc.)
│   ├── pages/          Page layouts & views
│   └── shared/         Reusable components
├── services/           API client & utilities
├── hooks/              Custom React hooks
├── context/            Global state (auth, theme)
├── styles/             Tailwind + Custom CSS
├── App.tsx             Main app router
└── main.tsx            React DOM entry point

Config Files:
├── vite.config.ts      Vite bundler config
├── tailwind.config.ts  Tailwind CSS config
├── tsconfig.json       TypeScript settings
└── package.json        Dependencies (95+ packages)
```

### **Backend** (`backend` branch)

```
backend/
├── app/
│   ├── main.py                 🚀 FastAPI app factory
│   ├── config.py               ⚙️  Pydantic settings
│   ├── database.py             🗄️  MongoDB connection & indexes
│   ├── dependencies.py         🔐 Auth & RBAC decorators
│   ├── security.py             🔑 JWT & password hashing
│   ├── models.py               📊 Enum definitions
│   ├── schemas.py              📝 Pydantic request/response models
│   ├── routes.py               🛣️  ALL API endpoints
│   └── services.py             💼 Business logic layer
├── tests/
│   └── test_api.py             ✅ Comprehensive pytest suite
├── docs/                       📚 API documentation
├── .env.example                🔐 Environment template
└── requirements.txt            📦 Python dependencies
```

**How it Flows:**

![Flow GIF](https://media.giphy.com/media/l3q2K6K0BNW25TrKU/giphy.gif)

```
Request → FastAPI Router → Security Check (JWT) → 
RBAC Validation → Service Layer (Business Logic) → 
Database (MongoDB) → Response (Pydantic Model)
```

---

## 🚀 Quick Start

### **Backend Setup** (backend branch)

![Setup GIF](https://media.giphy.com/media/l0MYY7jVWo5QSTmXm/giphy.gif)

```bash
# 1. Clone & switch to backend branch
git clone https://github.com/Ujjwal212004/odoo-hackathon.git
cd odoo-hackathon
git checkout backend

# 2. Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r backend/requirements.txt

# 4. Setup environment (uses mongomock = no real DB needed!)
cp backend/.env.example backend/.env

# 5. Run the server 🎬
cd backend
uvicorn app.main:app --reload --port 8000

# 6. 📖 Open Swagger Docs
# Visit: http://localhost:8000/docs
```

### **Frontend Setup** (main branch)

![Frontend Setup GIF](https://media.giphy.com/media/l0MYY7jVWo5QSTmXm/giphy.gif)

```bash
# 1. Switch to main branch
git checkout main

# 2. Install dependencies
npm install
# or with pnpm:
pnpm install

# 3. Run dev server ⚡
npm run dev

# 4. 🌐 Open browser
# Visit: http://localhost:5173
```

### **Run Tests**

![Testing GIF](https://media.giphy.com/media/l0HlTy9x8FZo0/giphy.gif)

```bash
# Backend tests (uses mongomock)
cd backend
pytest tests/ -v

# All tests pass without needing MongoDB! ✅
```

---

## 🔌 API Endpoints (REST)

**Base URL:** `http://localhost:8000/api/v1`

![API GIF](https://media.giphy.com/media/l3q2K6K0BNW2ZZn3W/giphy.gif)

### **Authentication 🔐**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/auth/register` | Register new user (first → admin) |
| `POST` | `/auth/login` | Login → JWT tokens |
| `POST` | `/auth/refresh` | Refresh access token |
| `GET` | `/auth/me` | Get current user profile |

![Login GIF](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)

### **Assets 📦**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/assets` | Create new asset |
| `GET` | `/assets` | List/search/filter assets |
| `GET` | `/assets/{id}` | Get asset details |
| `PATCH` | `/assets/{id}` | Update asset |
| `DELETE` | `/assets/{id}` | Soft-delete asset |

### **Allocations 🔄**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/allocations` | Create allocation request |
| `GET` | `/allocations` | List all allocations |
| `PATCH` | `/allocations/{id}/approve` | Approve pending allocation |
| `PATCH` | `/allocations/{id}/complete` | Return asset (complete) |

![Allocation GIF](https://media.giphy.com/media/l0HlTy9x8FZo0/giphy.gif)

### **Bookings 🗓️**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/bookings` | Create booking (conflict-checked) |
| `GET` | `/bookings` | List all bookings |

### **Maintenance 🔧**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/maintenance` | Create maintenance ticket |
| `GET` | `/maintenance` | List maintenance tickets |
| `PATCH` | `/maintenance/{id}/resolve` | Resolve with notes |

![Maintenance GIF](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)

### **Audits 📋**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/audits` | Create audit cycle |
| `GET` | `/audits` | List audit cycles |
| `GET` | `/audits/{id}/items` | List audit items |

### **AI Features 🤖**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/ai/chat` | AI chat assistant |
| `POST` | `/ai/report-summary` | Generate summary |
| `POST` | `/ai/maintenance-prediction` | Predict maintenance needs |
| `POST` | `/ai/asset-recommendation` | Get recommendations |

![AI GIF](https://media.giphy.com/media/xT9IgEx8SbW7gf6Sj2/giphy.gif)

### **Dashboard & Reports 📊**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/dashboard` | Aggregated stats (cached) |
| `POST` | `/reports/{type}` | Generate report (PDF/CSV) |

![Dashboard GIF](https://media.giphy.com/media/3o7TKU9qKTrM5gAEfu/giphy.gif)

---

## 🔐 Environment Variables

### Backend (`.env`)

```bash
# Database
MONGO_USE_MOCK=true              # Use mongomock (no MongoDB needed)
MONGODB_URI=mongodb://localhost:27017/poppy

# Security (⚠️ CHANGE IN PRODUCTION)
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Features (Optional)
GEMINI_API_KEY=your-gemini-key   # Enable AI features

# Server
DEBUG=false
LOG_LEVEL=INFO
```

---

## 🎨 Frontend Features Showcase

![UI Components GIF](https://media.giphy.com/media/l0HlDy9x8FZo0XO1i/giphy.gif)

✨ **UI Components:**
- Responsive buttons, cards, dialogs, forms
- Dropdown menus, tabs, toggles, sliders
- Alert dialogs, popovers, tooltips
- Carousels, progress bars, scroll areas

🎯 **Advanced Features:**
- Drag-and-drop interface (react-dnd) 🎪
- Data visualization (recharts) 📊
- Smooth animations & transitions ✨
- Dark/light theme toggle (next-themes) 🌓
- Form validation (react-hook-form) ✓
- Toast notifications (sonner) 🔔
- Command palette (cmdk) 🎹

---

## 📈 Data Flow Example: Asset Allocation

![Data Flow GIF](https://media.giphy.com/media/l3q2K6K0BNW2ZZn3W/giphy.gif)

```
User Action (Frontend) 👆
    ↓
Create Allocation Request → POST /api/v1/allocations 📤
    ↓
Backend validates JWT, checks RBAC 🔐
    ↓
Service layer: Check asset availability 📦
    ↓
MongoDB: Store allocation record 🗄️
    ↓
Return response with status → Frontend notified ✅
    ↓
UI updates in real-time 🎬
```

---

## 🧪 Testing

![Test GIF](https://media.giphy.com/media/l0HlTy9x8FZo0/giphy.gif)

```bash
# Run all backend tests
cd backend
pytest tests/ -v

# Run specific test
pytest tests/test_api.py::test_auth_login -v

# Coverage report
pytest tests/ --cov=app

# Tests use mongomock, so no external dependencies! ✅
```

---

## 🤖 AI Integration

![AI GIF](https://media.giphy.com/media/xT9IgEx8SbW7gf6Sj2/giphy.gif)

POPPY includes **Google Gemini API** integration for:
- 💬 Asset-related chat assistance
- 📊 Smart report summarization
- 🔮 Predictive maintenance forecasting
- 💡 Asset recommendation engine

**Fallback:** Deterministic responses if Gemini unavailable ✅

---

## 🔑 Key Design Decisions

![Decision Making GIF](https://media.giphy.com/media/l0HlTy9x8FZo0XO1i/giphy.gif)

✅ **Separate Branches:** Frontend & backend isolated for clarity
✅ **MongoDB/mongomock:** Zero-setup local development
✅ **JWT Auth:** Stateless, scalable authentication
✅ **Pydantic v2:** Strong type validation
✅ **FastAPI:** High performance, auto-docs, async support
✅ **React + Vite:** Lightning-fast builds & HMR
✅ **Tailwind + Radix:** Accessible, composable UI

---

## 🛠️ Development Workflow

![Dev Workflow GIF](https://media.giphy.com/media/l0MYY7jVWo5QSTmXm/giphy.gif)

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Frontend
npm run dev

# Terminal 3: Optionally run tests
pytest tests/ -v --watch
```

**Result:** Full-stack development environment running in parallel! 🚀

---

## 📚 Additional Resources

- **Backend Docs:** Visit `http://localhost:8000/docs` (Swagger) 📖
- **Backend Memory:** Check `backend/CLAUDE.md`
- **Attributions:** See `ATTRIBUTIONS.md`

---

## 🎓 Learning Path

![Learning GIF](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)

1. **Start Backend:**
   - Read `backend/app/main.py` → understand app setup
   - Check `backend/app/schemas.py` → data models
   - Explore `backend/app/routes.py` → endpoint handlers

2. **Frontend Exploration:**
   - Check `src/App.tsx` → routing setup
   - Browse `src/components/` → UI components
   - Review `src/services/` → API calls

3. **Full Integration:**
   - Run both servers
   - Test API via Swagger docs
   - Use frontend to interact with backend

---

## 🚀 Deployment Ready

![Deploy GIF](https://media.giphy.com/media/l0HlTy9x8FZo0XO1i/giphy.gif)

✅ Production-quality code
✅ Comprehensive error handling
✅ Security best practices (JWT, bcrypt, RBAC)
✅ Pydantic validation on all inputs
✅ Test coverage
✅ Environment configuration
✅ Auto-generated API documentation
✅ Scalable architecture

---

## 📞 Support & Questions

Built for **Hackathon 2026** 🎉

![Hackathon GIF](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)

**Repository:** [Ujjwal212004/odoo-hackathon](https://github.com/Ujjwal212004/odoo-hackathon)

---

## 📌 Try These Next

1. **"Can I test the API without MongoDB?"** ✅ Yes! Use `MONGO_USE_MOCK=true`
2. **"How do I add a new asset type?"** Check `backend/app/models.py` enums
3. **"How is user authentication handled?"** See `backend/app/security.py` JWT logic
4. **"Can I customize the UI components?"** Yes! All components are in `src/components/ui/`
5. **"What's included in the AI features?"** See `/ai/*` endpoints in backend routes

---

## 🎉 Let's Ship It!

![Success GIF](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)

**Happy coding!** 

```
███████████████████████████████ 100% READY 
🚀 POPPY is production-ready and waiting for you!
```

---

**Made with ❤️ for Hackathon 2026** 🏆
