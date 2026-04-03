import os
import joblib
import numpy as np
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="AI Doctor Chatbot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Local Model Path
MODEL_PATH = "chatbot_model.joblib"
vectorizer = None
tfidf_matrix = None
answers = None

@app.on_event("startup")
def load_model():
    global vectorizer, tfidf_matrix, answers
    if os.path.exists(MODEL_PATH):
        try:
            model_data = joblib.load(MODEL_PATH)
            vectorizer = model_data["vectorizer"]
            tfidf_matrix = model_data["tfidf_matrix"]
            answers = model_data["answers"]
            print("Local model loaded successfully.")
        except Exception as e:
            print(f"Error loading local model: {e}")
    else:
        print("Local model file not found. Ensure chatbot_model.joblib is in the directory.")

class ChatRequest(BaseModel):
    query: str
    class Config:
        extra = "ignore"

class ChatResponse(BaseModel):
    query: str
    symptoms: List[str]
    response: str
    confidence: float

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    query = req.query.strip()
    
    if vectorizer is None or tfidf_matrix is None or answers is None:
        raise HTTPException(
            status_code=503, 
            detail="Offline model is not loaded. Please ensure the .joblib file exists."
        )

    # TF-IDF Matching (Offline Mode)
    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    best_match_idx = np.argmax(similarities)
    best_score = similarities[best_match_idx]
    retrieved_context = answers[best_match_idx]

    return ChatResponse(
        query=query,
        symptoms=[], # Symptom extraction logic can be added here
        response=retrieved_context,
        confidence=float(best_score)
    )

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "offline_available": vectorizer is not None
    }
