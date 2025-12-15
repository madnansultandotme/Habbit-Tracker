"""Habit management API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.models.habit import (
    Habit,
    HabitCreate,
    HabitUpdate,
    CompletionRecord,
    CompletionToggle,
)

router = APIRouter(prefix="/habits", tags=["habits"])


@router.get("", response_model=list[Habit])
async def get_habits(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Get all habits."""
    habits = await db.habits.find({}, {"_id": 0}).to_list(1000)
    return habits


@router.post("", response_model=Habit, status_code=status.HTTP_201_CREATED)
async def create_habit(
    habit_in: HabitCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Create a new habit."""
    habit = Habit(**habit_in.model_dump())
    doc = habit.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.habits.insert_one(doc)
    return habit


@router.get("/{habit_id}", response_model=Habit)
async def get_habit(
    habit_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Get a specific habit by ID."""
    habit = await db.habits.find_one({"id": habit_id}, {"_id": 0})
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.patch("/{habit_id}", response_model=Habit)
async def update_habit(
    habit_id: str,
    habit_in: HabitUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Update a habit."""
    update_data = habit_in.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await db.habits.update_one({"id": habit_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Habit not found")

    habit = await db.habits.find_one({"id": habit_id}, {"_id": 0})
    return habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(
    habit_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Delete a habit and its completions."""
    result = await db.habits.delete_one({"id": habit_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Habit not found")
    # Clean up completions
    await db.completions.delete_many({"habit_id": habit_id})


@router.post("/completions/toggle", response_model=CompletionRecord)
async def toggle_completion(
    toggle: CompletionToggle,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Toggle habit completion for a specific date."""
    existing = await db.completions.find_one(
        {"habit_id": toggle.habit_id, "date": toggle.date},
        {"_id": 0},
    )

    if existing:
        new_completed = not existing.get("completed", False)
        await db.completions.update_one(
            {"habit_id": toggle.habit_id, "date": toggle.date},
            {"$set": {"completed": new_completed}},
        )
        existing["completed"] = new_completed
        return existing
    else:
        record = CompletionRecord(habit_id=toggle.habit_id, date=toggle.date)
        await db.completions.insert_one(record.model_dump())
        return record


@router.get("/completions/{habit_id}", response_model=list[CompletionRecord])
async def get_completions(
    habit_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Get all completions for a habit."""
    completions = await db.completions.find(
        {"habit_id": habit_id}, {"_id": 0}
    ).to_list(1000)
    return completions
