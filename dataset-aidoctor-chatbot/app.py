import os
import joblib
import numpy as np
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Doctor Chatbot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini Configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
    llm_model = genai.GenerativeModel('gemini-1.5-flash')
else:
    llm_model = None

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
        print("Local model file not found. Running in Online/Generative mode only.")

class ChatRequest(BaseModel):
    query: str
    class Config:
        extra = "ignore"

class ChatResponse(BaseModel):
    query: str
    symptoms: List[str]
    response: str
    confidence: float
    mode: str  # Added to track if "Online" or "Offline"

def extract_symptoms(text: str) -> List[str]:
    """Helper to extract symptoms from text (can be enhanced with LLM)"""
    # Simple keyword placeholder for now, but Gemini can handle this in the prompt
    return []

async def get_gemini_response(prompt: str):
    if not llm_model:
        return None
    
    system_prompt = (
        "You are an AI Doctor Assistant. Analyze the user's symptoms and provide "
        "a professional, empathetic response. Always include a disclaimer that "
        "this is not medical advice and the user should consult a real doctor."
    )
    
    try:
        response = llm_model.generate_content(f"{system_prompt}\n\nUser: {prompt}")
        return response.text
    except Exception as e:
        print(f"Gemini Error: {e}")
        return None

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    query = req.query.strip()
    
    # 1. Try Gemini (Online Mode)
    if llm_model:
        gemini_res = await get_gemini_response(query)
        if gemini_res:
            return ChatResponse(
                query=query,
                symptoms=extract_symptoms(query),
                response=gemini_res,
                confidence=1.0,
                mode="Online (Gemini)"
            )

    # 2. Fallback to TF-IDF (Offline Mode)
    if vectorizer is not None and tfidf_matrix is not None:
        query_vec = vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
        best_match_idx = np.argmax(similarities)
        best_score = similarities[best_match_idx]
        retrieved_context = answers[best_match_idx]

        return ChatResponse(
            query=query,
            symptoms=extract_symptoms(query),
            response=retrieved_context,
            confidence=float(best_score),
            mode="Offline (TF-IDF Fallback)"
        )

    raise HTTPException(status_code=503, detail="Both Online and Offline models are unavailable.")

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "online_available": llm_model is not None,
        "offline_available": vectorizer is not None
    }
