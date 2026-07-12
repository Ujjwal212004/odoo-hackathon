# 🚀 POPPY - Enterprise Asset Management System

> **AI-Powered Enterprise Asset & Resource Management Platform**
>
> <div align="center">
>   <img src="https://user-images.githubusercontent.com/74038190/213911110-aedbef38-a29f-4b6b-a65c-11608b4f75a5.gif" width="300" alt="Fire Animation" />
> </div>

POPPY is a modern, full-stack ERP system that streamlines enterprise asset tracking, allocation, maintenance, resource booking, and audit management through an intelligent, role-based platform. Built with cutting-edge technologies and production-ready standards.

---

## 🎯 What POPPY Does

| Feature | Description | Visual |
|---------|-------------|--------|
| 📦 **Asset Management** | Register, track, and manage asset lifecycle | ![Asset Icon](https://user-images.githubusercontent.com/74038190/212749695-a6817c5a-a794-462b-afca-1b5ce7dd5e63.gif) |
| 🔄 **Allocation & Transfers** | Streamlined workflow for resource allocation | ![Flow Icon](https://user-images.githubusercontent.com/74038190/212750680-266fa8aa-39f1-4e8b-8873-7181dbaf3d7c.gif) |
| 🗓️ **Resource Booking** | Smart conflict-detection booking system | ![Calendar Icon](https://user-images.githubusercontent.com/74038190/212749726-d36b8253-74bb-4509-870d-e29ed3b8ff4a.gif) |
| 🔧 **Maintenance Tracking** | Request, approve, and resolve maintenance tickets | ![Tools Icon](https://user-images.githubusercontent.com/74038190/212750672-2f3f2b50-c84f-4ed8-a60a-849ae69ff9df.gif) |
| 📋 **Audit Management** | Automated audit cycles with discrepancy reporting | ![Checklist Icon](https://user-images.githubusercontent.com/74038190/212748842-9fcbad5b-6173-4175-8a61-521f3dbb7514.gif) |
| 📊 **Analytics Dashboard** | Real-time insights and performance metrics | ![Charts Icon](https://user-images.githubusercontent.com/74038190/212751381-b0b2320e-6ef6-4041-a77a-de279fe5d3ae.gif) |
| 🤖 **AI Features** | Gemini-powered predictions and recommendations | ![AI Icon](https://user-images.githubusercontent.com/74038190/213760686-dcb02031-af46-4b9d-a6b1-9c367a379d9f.gif) |
| 👥 **RBAC** | Role-based access control for security | ![Security Icon](https://user-images.githubusercontent.com/74038190/213760677-e45ca5f7-d1aa-4c2c-91e0-573819287304.gif) |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     POPPY PLATFORM                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📱 FRONTEND (React 18.3 + Vite + Tailwind)                │
│  ├─ Modern UI Components (Radix UI + shadcn)             │
│  ├─ Drag-and-Drop Support (react-dnd)                     │
│  ├─ Real-time Charts (recharts)                           │
│  └─ State Management (React Router)                        │
│                                                              │
│              🔗 REST API (JSON)                            │
│                                                              │
│  🔧 BACKEND (FastAPI 0.115 + Python)                      │
│  ├─ JWT Authentication + RBAC                             │
│  ├─ Pydantic v2 Validation                                │
│  ├─ Async Request Handling                                │
│  └─ AI Integration (Google Gemini)                        │
│                                                              │
│  🗄️ DATABASE (MongoDB or mongomock)                        │
│  ├─ Flexible Schema for Complex Assets                    │
│  ├─ Indexed Collections for Fast Queries                  │
│  └─ Automatic Data Seeding                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/216122049-276bc7a5-c760-4849-805a-995d8fa6ea13.png" width="50" />
</div>

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

<img src="https://user-images.githubusercontent.com/74038190/212281756-450d3ffa-9335-4b98-a965-db8a18fee927.gif" width="80" alt="React" />
<img src="https://user-images.githubusercontent.com/74038190/212281763-e6ecd7ef-c4aa-45b6-a97c-f33f6bb592bd.gif" width="80" alt="Vite" />
<img src="https://user-images.githubusercontent.com/74038190/212281775-b468df30-4edc-4bf8-a4ee-f52e1aaddc86.gif" width="80" alt="TypeScript" />

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

<img src="https://user-images.githubusercontent.com/74038190/212257472-08e5d93b-1f0c-41af-8e21-082122388c80.gif" width="80" alt="Python" />
<img src="https://user-images.githubusercontent.com/74038190/212257463-4d082cb4-7483-4eaf-bc25-6dde2628aabd.gif" width="80" alt="FastAPI" />
<img src="https://user-images.githubusercontent.com/74038190/212257460-738ff738-247f-4445-a718-cdd0ca76e2db.gif" width="80" alt="MongoDB" />

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

```
Request → FastAPI Router → Security Check (JWT) → 
RBAC Validation → Service Layer (Business Logic) → 
Database (MongoDB) → Response (Pydantic Model)
```

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212749443-0810e511-4f46-4492-96aa-3c110d7bc41a.gif" width="400" alt="Development Flow" />
</div>

---

## 🚀 Quick Start

### **Backend Setup** (backend branch)

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

<img src="https://user-images.githubusercontent.com/74038190/212750999-42ff8a64-dad8-4772-9648-849968543991.gif" width="300" alt="Backend Setup" />

### **Frontend Setup** (main branch)

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

<img src="https://user-images.githubusercontent.com/74038190/212749447-bfb7e725-6987-49d9-ae85-2015e3e7cc41.gif" width="300" alt="Frontend Setup" />

### **Run Tests**

```bash
# Backend tests (uses mongomock)
cd backend
pytest tests/ -v

# All tests pass without needing MongoDB! ✅
```

<img src="https://user-images.githubusercontent.com/74038190/212898792-2844553a-e201-4eec-a5e2-3b0f532712e6.gif" width="250" alt="Testing" />

---

## 🔌 API Endpoints (REST)

**Base URL:** `http://localhost:8000/api/v1`

### **Authentication 🔐**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/auth/register` | Register new user (first → admin) |
| `POST` | `/auth/login` | Login → JWT tokens |
| `POST` | `/auth/refresh` | Refresh access token |
| `GET` | `/auth/me` | Get current user profile |

<img src="https://user-images.githubusercontent.com/74038190/213760705-0d5bf320-4f43-4352-b74b-0889ae726bf7.gif" width="300" alt="Auth" />

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

<img src="https://user-images.githubusercontent.com/74038190/216122005-3226fcc7-8713-41a1-ae5a-51d4b4cbcb83.png" width="80" alt="Allocations" />

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

<img src="https://user-images.githubusercontent.com/74038190/213760710-201a57d2-95f1-45c7-b910-44faf209d2f8.gif" width="250" alt="AI Features" />

### **Dashboard & Reports 📊**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/dashboard` | Aggregated stats (cached) |
| `POST` | `/reports/{type}` | Generate report (PDF/CSV) |

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

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212748830-4c709398-a386-4761-84d7-9e10b98fbe6e.gif" width="400" alt="Frontend Features" />
</div>

---

## 📈 Data Flow Example: Asset Allocation

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

<img src="https://user-images.githubusercontent.com/74038190/212749168-86d6c7ab-98da-409b-998f-c5b74721badd.gif" width="350" alt="Data Flow" />

---

## 🧪 Testing

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

<img src="https://user-images.githubusercontent.com/74038190/215283295-44de9069-d569-4963-ba8f-264443a54c6d.gif" width="350" alt="Testing with Coffee" />

---

## 🤖 AI Integration

POPPY includes **Google Gemini API** integration for:
- 💬 Asset-related chat assistance
- 📊 Smart report summarization
- 🔮 Predictive maintenance forecasting
- 💡 Asset recommendation engine

**Fallback:** Deterministic responses if Gemini unavailable ✅

<img src="https://user-images.githubusercontent.com/74038190/212751818-13da6fd2-27ca-45c4-9c64-3940ccfa6fd3.gif" width="250" alt="AI Coder" />

---

## 🔑 Key Design Decisions

✅ **Separate Branches:** Frontend & backend isolated for clarity
✅ **MongoDB/mongomock:** Zero-setup local development
✅ **JWT Auth:** Stateless, scalable authentication
✅ **Pydantic v2:** Strong type validation
✅ **FastAPI:** High performance, auto-docs, async support
✅ **React + Vite:** Lightning-fast builds & HMR
✅ **Tailwind + Radix:** Accessible, composable UI

<img src="https://user-images.githubusercontent.com/74038190/216122069-5b8169d7-1d8e-4a13-b245-a8e4176c99f8.png" width="80" alt="Bullseye" />

---

## 🛠️ Development Workflow

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

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212747903-e9bdf048-2dc8-41f9-b973-0e72ff07bfba.gif" width="350" alt="Development Workflow" />
</div>

---

## 📚 Additional Resources

- **Backend Docs:** Visit `http://localhost:8000/docs` (Swagger) 📖
- **Backend Memory:** Check `backend/CLAUDE.md`
- **Attributions:** See `ATTRIBUTIONS.md`

---

## 🎓 Learning Path

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

<img src="https://user-images.githubusercontent.com/74038190/212750155-3ceddfbd-19d3-40a3-87af-8d329c8323c4.gif" width="350" alt="Learning" />

---

## 🚀 Deployment Ready

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/235224431-e8c8c12e-6826-47f1-89fb-2ddad83b3abf.gif" width="300" alt="Deployment Ready" />
</div>

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

<div align="center">
  <img src="https://github.com/Anmol-Baranwal/Cool-GIFs-For-GitHub/assets/74038190/97626055-a2f8-453b-9d67-c749f99ff0b9" width="300" alt="Success" />
</div>

**Happy coding!** 

```
███████████████████████████████ 100% READY 
🚀 POPPY is production-ready and waiting for you!
```

---

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/216120974-24a76b31-7f39-41f1-a38f-b3c1377cc612.png" width="60" alt="Tea" />
  <img src="https://user-images.githubusercontent.com/74038190/216120986-f2752ca9-fe82-4aa3-befe-0a58db010d85.png" width="60" alt="Smile" />
  <img src="https://user-images.githubusercontent.com/74038190/216121919-60befe4d-11c6-4227-8992-35221d12ff54.png" width="60" alt="Jack" />
</div>

**Made with ❤️ for Hackathon 2026** 🏆

---

**Developed and Engineered by Meet Limbachiya, Siddh Patel and Ujjwal Bharambe** 🏆

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/216649417-9acc58df-9186-4132-ad43-819a57babb67.gif" width="120" alt="Dev 1" />
  <img src="https://user-images.githubusercontent.com/74038190/216649421-9e00c0cf-6656-4d16-97dd-42fedd8b74f0.gif" width="120" alt="Dev 2" />
  <img src="https://user-images.githubusercontent.com/74038190/216649426-0c2ee152-84d8-4707-85c4-27a378d2f78a.gif" width="120" alt="Dev 3" />
</div>

---

<div align="center">
  <img src="https://cultofthepartyparrot.com/parrots/hd/githubparrot.gif" width="25" height="25"/>
  <img src="https://cultofthepartyparrot.com/flags/hd/iranparrot.gif" width="25" height="25"/>
  <img src="https://cultofthepartyparrot.com/parrots/asyncparrot.gif" width="36" height="25"/>
  <img src="https://cultofthepartyparrot.com/parrots/hd/60fpsparrot.gif" width="25" height="25"/>
  <img src="https://cultofthepartyparrot.com/parrots/hd/jumpingparrot.gif" width="25" height="25"/>
  <img src="https://cultofthepartyparrot.com/parrots/hd/opensourceparrot.gif" width="25" height="25"/>
  <img src="https://cultofthepartyparrot.com/parrots/hd/dealwithitnowparrot.gif" width="25" height="25"/>
  <img src="https://cultofthepartyparrot.com/parrots/hd/hypnoparrotlight.gif" width="25" height="25"/>
</div>
