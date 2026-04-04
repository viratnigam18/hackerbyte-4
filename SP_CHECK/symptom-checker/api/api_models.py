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

class SymptomResponse(BaseModel):
    predictions: List[Prediction]
    reasoning: Reasoning
    reliability: Reliability
    follow_up: List[str]
