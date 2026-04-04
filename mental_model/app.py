import os
import pickle
import torch
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification

app = FastAPI(title="Mental Health Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "mental_model")
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, "models", "label_encoder.pkl")

tokenizer = None
model = None
label_encoder = None

SUPPORTIVE_RESPONSES = {
    "Anxiety": {
        "message": "It sounds like you may be experiencing anxiety. Remember, you're not alone in this.",
        "tips": [
            "Try deep breathing exercises - inhale for 4 seconds, hold for 4, exhale for 4.",
            "Ground yourself using the 5-4-3-2-1 technique: notice 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
            "Consider talking to a mental health professional for personalized support.",
            "Limit caffeine and try to maintain a regular sleep schedule.",
        ],
        "severity": "moderate",
        "color": "#F59E0B",
    },
    "Depression": {
        "message": "I hear you, and what you're feeling matters. Depression can feel overwhelming, but help is available.",
        "tips": [
            "Reach out to someone you trust - a friend, family member, or counselor.",
            "Try to maintain small daily routines, even something as simple as a short walk.",
            "Consider speaking with a mental health professional who can guide you.",
            "Remember: asking for help is a sign of strength, not weakness.",
        ],
        "severity": "high",
        "color": "#EF4444",
    },
    "Normal": {
        "message": "You seem to be in a good mental space right now. That's great!",
        "tips": [
            "Keep up with activities that bring you joy and relaxation.",
            "Maintain healthy social connections and routines.",
            "Practice gratitude - write down 3 things you're thankful for each day.",
            "Regular exercise and good sleep hygiene go a long way.",
        ],
        "severity": "low",
        "color": "#10B981",
    },
    "Suicidal": {
        "message": "I'm really concerned about what you've shared. You matter, and help is available right now.",
        "tips": [
            "Please call a crisis helpline immediately: iCall (9152987821) or Vandrevala Foundation (1860-2662-345)",
            "If you're in immediate danger, please call emergency services (112).",
            "Reach out to someone you trust right now - you don't have to face this alone.",
            "Text 'HELLO' to 741741 (Crisis Text Line) if you prefer texting.",
        ],
        "severity": "critical",
        "color": "#DC2626",
    },
    "Bipolar": {
        "message": "It seems like you might be experiencing mood fluctuations. Understanding your patterns can help.",
        "tips": [
            "Keep a mood journal to track your emotional states over time.",
            "Maintain consistent sleep schedules - sleep disruption can trigger episodes.",
            "Consider consulting a psychiatrist who specializes in mood disorders.",
            "Avoid alcohol and recreational drugs as they can worsen symptoms.",
        ],
        "severity": "moderate",
        "color": "#8B5CF6",
    },
    "Stress": {
        "message": "It sounds like you're under a lot of stress. Let's work on managing that.",
        "tips": [
            "Break large tasks into smaller, manageable steps.",
            "Practice progressive muscle relaxation before bed.",
            "Set boundaries - it's okay to say no to additional responsibilities.",
            "Physical exercise is one of the most effective stress relievers.",
        ],
        "severity": "moderate",
        "color": "#F97316",
    },
    "Personality disorder": {
        "message": "What you're experiencing may be related to complex emotional patterns. Professional support can make a real difference.",
        "tips": [
            "Dialectical Behavior Therapy (DBT) has been shown to be very effective.",
            "Practice mindfulness to become aware of emotional triggers.",
            "Build a support network of people who understand your experiences.",
            "Consider joining a support group to connect with others who share similar experiences.",
        ],
        "severity": "moderate",
        "color": "#6366F1",
    },
}

DEFAULT_RESPONSE = {
    "message": "Thank you for sharing. I've analyzed your message and here's what I found.",
    "tips": [
        "Consider talking to a mental health professional for personalized guidance.",
        "Practice self-care: sleep well, eat healthy, and stay active.",
        "Journaling can help you process and understand your emotions better.",
    ],
    "severity": "moderate",
    "color": "#6B7280",
}


@app.on_event("startup")
def load_model():
    global tokenizer, model, label_encoder
    print(f"Loading model from: {MODEL_PATH}")
    print(f"Loading label encoder from: {LABEL_ENCODER_PATH}")
    
    if os.path.exists(MODEL_PATH):
        try:
            tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
            model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
            model.eval()
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
    else:
        print(f"Model not found at {MODEL_PATH}")

    if os.path.exists(LABEL_ENCODER_PATH):
        try:
            with open(LABEL_ENCODER_PATH, "rb") as f:
                label_encoder = pickle.load(f)
            print(f"Label encoder loaded. Classes: {list(label_encoder.classes_)}")
        except Exception as e:
            print(f"Error loading label encoder: {e}")
    else:
        print(f"Label encoder not found at {LABEL_ENCODER_PATH}")


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    user_message: str
    predicted_status: str
    confidence: float
    response_message: str
    tips: List[str]
    severity: str
    color: str


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    if tokenizer is None or model is None or label_encoder is None:
        raise HTTPException(status_code=503, detail="Model is not loaded.")
    
    inputs = tokenizer(message, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=1)
    pred_idx = torch.argmax(probs).item()
    confidence = probs[0][pred_idx].item()
    predicted_label = label_encoder.inverse_transform([pred_idx])[0]
    response_data = SUPPORTIVE_RESPONSES.get(predicted_label, DEFAULT_RESPONSE)

    return ChatResponse(
        user_message=message,
        predicted_status=predicted_label,
        confidence=confidence,
        response_message=response_data["message"],
        tips=response_data["tips"],
        severity=response_data["severity"],
        color=response_data["color"],
    )


@app.get("/")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
