# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Czech elementary math learning website for 4th graders, featuring animated explanations and practice exercises with immediate feedback. The app supports both "Uceni" (Learning) mode with step-by-step animations and "Procvicovani" (Practice) mode with problem generation.

## Development Commands

### Backend (FastAPI + SQLite)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8000
```

### Frontend (React + Vite + TypeScript)

```bash
cd frontend
npm install

# Development
npm run dev          # Vite dev server on port 5173

# Build & lint
npm run build        # TypeScript compile + Vite build
npm run lint         # ESLint with zero warnings tolerance
```

### Docker

```bash
# Local development with Docker Compose
docker-compose up --build

# Production deployment (Dokploy)
docker-compose -f docker-compose.dokploy.yml up --build
```

## Architecture

### Frontend (`frontend/src/`)

- **React 18** with TypeScript, **Vite** bundler, **Framer Motion** for animations
- **React Router DOM** for navigation: `/` (ProfileSelect), `/child`, `/practice/:topic`, `/learn/:topic`, `/parent`
- **CSS Modules** for component styling (`.module.css` files)
- Path alias `@/` maps to `src/`

Key directories:
- `pages/` - Route components (ProfileSelect, ChildHome, Practice, Learn, ParentDashboard)
- `components/` - Reusable UI (Avatar, Layout, TopicCard, Problem, Feedback)
- `utils/problemGenerator.ts` - Client-side math problem generation with difficulty levels
- `utils/errorDetection.ts` - Identifies error patterns (carry/borrow mistakes)
- `api/` - Axios client and endpoint wrappers
- `context/UserContext.tsx` - Current user state management

### Backend (`backend/app/`)

- **FastAPI** with SQLAlchemy ORM and **SQLite** database
- API prefix: `/api/` (users, exercises, stats, badges)
- Database auto-initializes on startup via lifespan handler
- Seed data created automatically (`seed.py`)

Key files:
- `main.py` - FastAPI app, CORS config, router includes
- `models.py` - SQLAlchemy models: User, Exercise, Badge with enums (Topic, BadgeType, ErrorType)
- `schemas.py` - Pydantic request/response models
- `routers/` - API endpoints organized by resource
- `database.py` - SQLAlchemy engine and session setup

### Database Schema

Three tables: `users` (parent/child profiles), `exercises` (problem attempts with error tracking), `badges` (earned achievements)

## Math Topics

Five topics supported: `addition`, `subtraction`, `multiplication`, `division`, `rounding`

Each has 3 difficulty levels controlling digit count and whether carrying/borrowing is required. Problem generation happens client-side in `problemGenerator.ts`.

## Deployment

- Frontend builds to static files served by nginx
- Backend runs uvicorn on port 8000
- nginx proxies `/be/api/*` to backend container
- SQLite database persisted in `./data/` volume
