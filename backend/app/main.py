from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import users, exercises, stats, badges


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    # Seed initial data
    from app.seed import seed_database
    seed_database()
    yield
    # Shutdown


app = FastAPI(
    title="Elementary Math API",
    description="API for Czech elementary math learning application",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",
        "http://localhost",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(exercises.router, prefix="/api/exercises", tags=["exercises"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])
app.include_router(badges.router, prefix="/api/badges", tags=["badges"])


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
