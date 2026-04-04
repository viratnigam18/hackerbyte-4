import os
import json
import httpx
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load Environment Variables from the root folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
ENV_PATH = os.path.join(ROOT_DIR, ".env")
load_dotenv(ENV_PATH)

print(f"DEBUG: Looking for .env at {ENV_PATH}")
OPENROUTER_API_KEY = os.getenv("open_router")

# Green API Credentials
GREEN_INSTANCE_ID = "7107576476"
GREEN_API_TOKEN = "9015786b56dd4ce69cd5fd22fa8e6986f4062fa63c6f4e238c"
EMERGENCY_RECIPIENT = "918899026009@c.us"
GREEN_API_HOST = "7107.api.greenapi.com"

# Vapi Credentials
VAPI_API_KEY = "2e5691aa-1c39-4a0c-b19a-af63a435b02d"
VAPI_ASSISTANT_ID = "9254f12b-f19e-49f2-86f7-8c50719acc53"
VAPI_PHONE_NUMBER_ID = "bb3e2528-8d39-4037-81b4-43aedac6f15e"
EMERGENCY_PHONE_NUMBER = "+918899026009"

if OPENROUTER_API_KEY:
    print(f"DEBUG: OpenRouter Key loaded: {OPENROUTER_API_KEY[:6]}...")
else:
    print("DEBUG: OpenRouter Key (open_router) NOT FOUND in .env")
GPT_MODEL = "openai/gpt-3.5-turbo"

app = FastAPI(title="LifeLine Cloud-AI Mental Health Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# System Prompt for the LLM to handle both classification and support
SYSTEM_PROMPT = """
You are a professional, clinical, and deeply empathetic mental health assistant.
Your task is to analyze the user's message and provide a structured diagnosis and supportive response.

CATEGORIES & SEVERITY:
- Anxiety (moderate, #F59E0B)
- Depression (high, #EF4444)
- Normal (low, #10B981)
- Suicidal (critical, #DC2626)
- Bipolar (moderate, #8B5CF6)
- Stress (moderate, #F97316)
- Personality disorder (moderate, #6366F1)

RESPONSE GUIDELINES:
1. Provide a comforting, human-like response (2-3 sentences).
2. Provide 3 specific, actionable self-care tips.
3. Classify the message into one of the categories above.
4. If the status is 'Suicidal', prioritize crisis helpline info.

YOU MUST RESPOND ONLY IN THIS JSON FORMAT:
{
  "predicted_status": "Category Name",
  "response_message": "Your empathetic response here",
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "severity": "low/moderate/high/critical",
  "color": "Hex Color"
}
"""

async def get_llm_analysis(user_message: str) -> Optional[dict]:
    """Calls OpenRouter for a full AI analysis (Classification + Response)."""
    if not OPENROUTER_API_KEY:
        return None

    try:
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "LifeLine AI"
            }
            
            payload = {
                "model": GPT_MODEL,
                "messages": [
                    { "role": "system", "content": SYSTEM_PROMPT },
                    { "role": "user", "content": user_message }
                ],
                "response_format": { "type": "json_object" }, # Ensures JSON output if supported
                "temperature": 0.5
            }
            
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=15.0
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                return json.loads(content)
            
            print(f"LLM Error {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print(f"LLM AI integration failed: {e}")
        return None

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    
    # 1. Direct Cloud AI analysis (Classification + Empathy combined)
    analysis = await get_llm_analysis(message)
    
    if not analysis:
        # Fallback if LLM is down
        return ChatResponse(
            user_message=message,
            predicted_status="Normal",
            confidence=0.5,
            response_message="I'm here for you, but I'm having trouble connecting to my central brain. Please try again or reach out to a friend.",
            tips=["Take a deep breath", "Stay hydrated", "Consider talking to a professional"],
            severity="low",
            color="#6B7280"
        )

    return ChatResponse(
        user_message=message,
        predicted_status=analysis.get("predicted_status", "Normal"),
        confidence=0.98, # LLM-based is considered high confidence
        response_message=analysis.get("response_message", "I hear you, and I'm here to help."),
        tips=analysis.get("tips", []),
        severity=analysis.get("severity", "moderate"),
        color=analysis.get("color", "#6B7280")
    )


async def trigger_vapi_call(patient_name: str, symptoms: str, history: str, maps_link: str, location_coords: str):
    """Triggers an automated emergency voice call via Vapi."""
    try:
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {VAPI_API_KEY}",
                "Content-Type": "application/json"
            }
            
            # Payload using dynamic variables for Vapi Dashboard templates
            payload = {
                "assistantId": VAPI_ASSISTANT_ID,
                "phoneNumberId": VAPI_PHONE_NUMBER_ID,
                "customer": {
                    "number": EMERGENCY_PHONE_NUMBER,
                    "name": patient_name
                },
                "assistantOverrides": {
                    "variableValues": {
                        "name": patient_name,
                        "symptoms": symptoms,
                        "history": history,
                        "location": location_coords,
                        "maps_link": maps_link
                    }
                }
            }
            
            response = await client.post(
                "https://api.vapi.ai/call/phone",
                headers=headers,
                json=payload,
                timeout=20.0
            )
            
            if response.status_code in [200, 201]:
                print(f"Vapi Emergency Call Triggered: {response.status_code}")
                return True
            else:
                print(f"Vapi Error {response.status_code}: {response.text}")
                return False
    except Exception as e:
        print(f"Vapi Call Failed: {e}")
        return False


@app.post("/sos")
async def sos_proxy_endpoint(payload: dict):
    """Sends a formatted WhatsApp emergency alert and triggers a Vapi voice call."""
    try:
        # Extract data from the payload
        current_data = payload.get("current_data", "N/A")
        previous_data = payload.get("previous_data", [])
        location = payload.get("location", {})
        patient_name = payload.get("patient_name", "Unknown Patient")
        timestamp = payload.get("timestamp", "N/A")

        # Format medical history
        history_str = ", ".join(previous_data) if isinstance(previous_data, list) else str(previous_data)

        # Format Location info
        maps_link = "N/A"
        location_coords = "IIITDM Jabalpur" # Updated as requested
        if isinstance(location, dict) and "lat" in location and "lng" in location:
            lat, lng = location['lat'], location['lng']
            maps_link = f"https://www.google.com/maps?q={lat},{lng}"

        # 1. Trigger WhatsApp (Green API) - Text and Mapping
        wa_success = False
        async with httpx.AsyncClient() as client:
            # Send the detailed text report
            whatsapp_message = (
                f"*MEDICAL EMERGENCY ALERT*\n\n"
                f"*Patient:* {patient_name}\n"
                f"*Current Symptoms:* {current_data}\n"
                f"*Clinical History:* {history_str}\n"
                f"*Timestamp:* {timestamp}\n\n"
                f"Note: An automated emergency voice call has been initiated. Please locate the patient using the map pin below."
            )
            
            url_msg = f"https://{GREEN_API_HOST}/waInstance{GREEN_INSTANCE_ID}/sendMessage/{GREEN_API_TOKEN}"
            res_wa = await client.post(url_msg, json={"chatId": EMERGENCY_RECIPIENT, "message": whatsapp_message}, timeout=15.0)
            
            # Send the native clickable Location pin
            if isinstance(location, dict) and "lat" in location and "lng" in location:
                url_loc = f"https://{GREEN_API_HOST}/waInstance{GREEN_INSTANCE_ID}/sendLocation/{GREEN_API_TOKEN}"
                loc_payload = {
                    "chatId": EMERGENCY_RECIPIENT,
                    "latitude": location['lat'],
                    "longitude": location['lng'],
                    "nameLocation": "Patient Distress Location",
                    "address": "IIITDM Jabalpur"
                }
                await client.post(url_loc, json=loc_payload, timeout=15.0)
            
            wa_success = res_wa.status_code == 200

        # 2. Trigger Voice Call (Vapi)
        vapi_success = await trigger_vapi_call(patient_name, current_data, history_str, "Maps Pin Sent", "IIITDM Jabalpur")

        return {
            "status": "success" if (wa_success or vapi_success) else "error",
            "whatsapp": "sent" if wa_success else "failed",
            "voice_call": "initiated" if vapi_success else "failed"
        }

    except Exception as e:
        print(f"SOS Global Proxy Error: {e}")
        return {"status": "error", "detail": str(e)}

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Cloud-AI Mental Health Assistant"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
