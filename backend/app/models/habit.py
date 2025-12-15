"""Habit-related Pydantic models."""

from datetime import datetime, timezone
from enum import Enum
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field


class HabitFrequency(str, Enum):
    """Habit frequency options."""

    DAILY = "daily"
    WEEKLY = "weekly"
    CUSTOM = "custom"


class HabitBase(BaseModel):
    """Base habit schema with common fields."""

    name: str = Field(..., min_length=1, max_length=100)
    color: str = Field(default="primary", max_length=50)
    category: str | None = Field(None, max_length=50)
    description: str | None = Field(None, max_length=500)
    frequency: HabitFrequency = Field(default=HabitFrequency.DAILY)
    target_days_per_week: int = Field(default=7, ge=1, le=7)
    reminder_time: str | None = Field(None, pattern=r"^\d{2}:\d{2}$")
    reminder_enabled: bool = False


class HabitCreate(HabitBase):
    """Schema for creating a new habit."""

    pass


class HabitUpdate(BaseModel):
    """Schema for updating a habit."""

    name: str | None = Field(None, min_length=1, max_length=100)
    color: str | None = Field(None, max_length=50)
    category: str | None = Field(None, max_length=50)
    description: str | None = Field(None, max_length=500)
    frequency: HabitFrequency | None = None
    target_days_per_week: int | None = Field(None, ge=1, le=7)
    reminder_time: str | None = Field(None, pattern=r"^\d{2}:\d{2}$")
    reminder_enabled: bool | None = None
    is_archived: bool | None = None


class Habit(HabitBase):
    """Complete habit schema with all fields."""

    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_archived: bool = False


class HabitWithStats(Habit):
    """Habit with computed statistics."""

    current_streak: int = 0
    longest_streak: int = 0
    completion_rate_30d: float = 0.0
    total_completions: int = 0


class CompletionToggle(BaseModel):
    """Schema for toggling habit completion."""

    habit_id: str
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")


class CompletionRecord(BaseModel):
    """Schema for a completion record."""

    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    habit_id: str
    date: str
    completed: bool = True
    notes: str | None = Field(None, max_length=500)


class CompletionCreate(BaseModel):
    """Schema for creating a completion."""

    habit_id: str
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    notes: str | None = Field(None, max_length=500)


class Category(BaseModel):
    """Habit category schema."""

    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    name: str = Field(..., min_length=1, max_length=50)
    color: str = Field(default="gray", max_length=50)
    icon: str | None = Field(None, max_length=50)


class CategoryCreate(BaseModel):
    """Schema for creating a category."""

    name: str = Field(..., min_length=1, max_length=50)
    color: str = Field(default="gray", max_length=50)
    icon: str | None = Field(None, max_length=50)
