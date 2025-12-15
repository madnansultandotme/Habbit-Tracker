"""Status check models (health/monitoring)."""

from datetime import datetime, timezone
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field


class StatusCheckCreate(BaseModel):
    """Schema for creating a status check."""

    client_name: str


class StatusCheck(BaseModel):
    """Complete status check schema."""

    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
