from pydantic import BaseModel, Field
from typing import List, Optional

class Prediction(BaseModel):
    disease: str
    confidence: float
    severity: str

class Reasoning(BaseModel):
    detected_symptoms: List[str]
    missing_symptoms_inquired: List[str]
    explanation: str

class Reliability(BaseModel):
    level: str
    warning: Optional[str] = None
    is_vague: bool

class SymptomRequest(BaseModel):
    symptoms: str = Field(..., example="I have severe headache and chest pain")
    image_base64: Optional[str] = Field(None, example="data:image/jpeg;base64,...")
    user_id: Optional[str] = Field(None, example="user123")

class SymptomResponse(BaseModel):
    predictions: List[Prediction]
    reasoning: Reasoning
    reliability: Reliability
    follow_up: List[str]
    history_insight: Optional[str] = None
    risk_level: Optional[str] = None
    stress_level: Optional[str] = None
    recommended_actions: Optional[list] = None

class HistoryEntry(BaseModel):
    id: str
    user_id: str
    symptoms: str
    predictions: list
    severity: list
    timestamp: str

class HistoryResponse(BaseModel):
    user_id: str
    history: List[HistoryEntry]
