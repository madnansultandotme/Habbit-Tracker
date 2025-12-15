"""Habit-related Pydantic models."""

from datetime import datetime, timezone
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field


class HabitBase(BaseModel):
    """Base habit schema with common fields."""

    name: str = Field(..., min_length=1, max_length=100)
    color: str = Field(default="primary", max_length=50)


class HabitCreate(HabitBase):
    """Schema for creating a new habit."""

    pass


class HabitUpdate(BaseModel):
    """Schema for updating a habit."""

    name: str | None = Field(None, min_length=1, max_length=100)
    color: str | None = Field(None, max_length=50)


class Habit(HabitBase):
    """Complete habit schema with all fields."""

    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CompletionToggle(BaseModel):
    """Schema for toggling habit completion."""

    habit_id: str
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")


class CompletionRecord(BaseModel):
    """Schema for a completion record."""

    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid4()))
    habit_id: str
    date: str
    completed: bool = True
