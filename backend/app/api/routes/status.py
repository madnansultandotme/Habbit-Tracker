"""Status/health check API routes."""

from datetime import datetime
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.models.status import StatusCheck, StatusCheckCreate

router = APIRouter(prefix="/status", tags=["status"])


@router.get("", response_model=list[StatusCheck])
async def get_status_checks(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all status checks."""
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    for check in status_checks:
        if isinstance(check.get("timestamp"), str):
            check["timestamp"] = datetime.fromisoformat(check["timestamp"])

    return status_checks


@router.post("", response_model=StatusCheck)
async def create_status_check(
    input_data: StatusCheckCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Create a new status check."""
    status_obj = StatusCheck(**input_data.model_dump())
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj
