"""Analytics and statistics models."""

from datetime import date

from pydantic import BaseModel, Field


class DailyStats(BaseModel):
    """Daily completion statistics."""

    date: str
    completed_count: int
    total_habits: int
    completion_rate: float


class WeeklyStats(BaseModel):
    """Weekly completion statistics."""

    week_start: str
    week_end: str
    completed_count: int
    total_possible: int
    completion_rate: float
    best_day: str | None = None
    worst_day: str | None = None


class MonthlyStats(BaseModel):
    """Monthly completion statistics."""

    month: str  # YYYY-MM format
    completed_count: int
    total_possible: int
    completion_rate: float
    daily_breakdown: list[DailyStats]


class HabitAnalytics(BaseModel):
    """Analytics for a single habit."""

    habit_id: str
    habit_name: str
    current_streak: int
    longest_streak: int
    completion_rate_7d: float
    completion_rate_30d: float
    completion_rate_all_time: float
    total_completions: int
    best_streak_start: str | None = None
    best_streak_end: str | None = None


class OverallAnalytics(BaseModel):
    """Overall user analytics."""

    total_habits: int
    active_habits: int
    archived_habits: int
    total_completions: int
    overall_completion_rate_7d: float
    overall_completion_rate_30d: float
    current_best_streak_habit: str | None = None
    current_best_streak: int = 0
    habits_by_category: dict[str, int]


class ExportData(BaseModel):
    """Data export schema."""

    export_date: str
    user_id: str
    habits: list[dict]
    completions: list[dict]
    categories: list[dict]
    analytics: OverallAnalytics
