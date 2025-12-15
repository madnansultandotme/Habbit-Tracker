"""Database connection and lifecycle management."""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings


class Database:
    """MongoDB database connection manager."""

    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


db_instance = Database()


async def connect_to_database() -> None:
    """Initialize database connection."""
    settings = get_settings()
    db_instance.client = AsyncIOMotorClient(settings.mongo_url)
    db_instance.db = db_instance.client[settings.db_name]


async def close_database_connection() -> None:
    """Close database connection."""
    if db_instance.client:
        db_instance.client.close()


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance for dependency injection."""
    if db_instance.db is None:
        raise RuntimeError("Database not initialized")
    return db_instance.db
