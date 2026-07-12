# POPPY

> AI-powered Enterprise Asset & Resource Management System

POPPY is a modern ERP platform that streamlines enterprise asset tracking, allocation, maintenance, resource booking, and audit management through a centralized, role-based system.

## Features

- Asset Registration & Lifecycle Management
- Asset Allocation & Transfer Workflow
- Resource Booking with Conflict Detection
- Maintenance Request & Approval Workflow
- Asset Audit & Discrepancy Reporting
- Dashboard & Analytics
- Role-Based Access Control (RBAC)
- Real-Time Notifications
- AI-Powered Insights

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

### Database
- PostgreSQL

### AI
- Google Gemini API

## Architecture

```text
React.js
    │
 REST API
    │
 FastAPI
    │
PostgreSQL
```

## Project Structure

```text
POPPY/
├── frontend/
├── backend/
├── docs/
└── README.md
```

## Getting Started

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Vision

To build an intelligent, scalable ERP platform that enables organizations to efficiently manage assets, optimize resource utilization, and automate operational workflows.

---

Built for Hackathon 2026 🚀