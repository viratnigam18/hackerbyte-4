"""
Anti-Stress API Routes
-----------------------
No direct DB logic — all calls go through database.py / engine.py service layer.
"""
from fastapi import APIRouter, HTTPException
from .schemas import CompleteActionRequest, CompleteActionResponse, UserStatsResponse, StressAction
from .database import complete_action, get_user_stats_db, init_db
from .engine import get_recommended_actions
from typing import List

stress_router = APIRouter(prefix="/stress", tags=["Anti-Stress Gamification"])

# Seed default actions on module load
init_db()


@stress_router.get("/actions/{user_id}", response_model=List[StressAction])
def get_actions(user_id: str, severity: str = "MEDIUM"):
    """Returns 2 recommended stress-relief actions based on severity."""
    actions = get_recommended_actions(severity, user_id)
    return actions


@stress_router.post("/complete", response_model=CompleteActionResponse)
def mark_complete(payload: CompleteActionRequest):
    """Marks an action as completed, updates points and streak."""
    success = complete_action(payload.user_id, payload.action_id)
    if success:
        return CompleteActionResponse(success=True, message="Action completed and stats updated!")
    raise HTTPException(status_code=404, detail="Action not found or could not be completed.")


@stress_router.get("/stats/{user_id}", response_model=UserStatsResponse)
def get_stats(user_id: str):
    """Returns total points, current streak, and last completed date."""
    stats = get_user_stats_db(user_id)
    return UserStatsResponse(
        total_points=stats.get("total_points", 0),
        current_streak=stats.get("current_streak", 0),
        last_completed_date=stats.get("last_completed_date"),
    )
