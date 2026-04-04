from pydantic import BaseModel
from typing import List, Optional

class CompleteActionRequest(BaseModel):
    user_id: str
    action_id: int

class CompleteActionResponse(BaseModel):
    success: bool
    message: str

class UserStatsResponse(BaseModel):
    total_points: int
    current_streak: int
    last_completed_date: Optional[str] = None
    
class StressAction(BaseModel):
    id: int
    title: str
    description: str
    points: int
    category: str
