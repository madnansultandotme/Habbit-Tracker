"""Main API router that aggregates all route modules."""

from fastapi import APIRouter

from app.api.routes import habits, status

api_router = APIRouter(prefix="/api")

api_router.include_router(habits.router)
api_router.include_router(status.router)


@api_router.get("/", tags=["root"])
async def root():
    """API root endpoint."""
    return {"message": "Habit Tracker API", "version": "1.0.0"}


@api_router.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
