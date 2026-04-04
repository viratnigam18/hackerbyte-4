import httpx
import json

VAPI_API_KEY = "2e5691aa-1c39-4a0c-b19a-af63a435b02d"
VAPI_ASSISTANT_ID = "9254f12b-f19e-49f2-86f7-8c50719acc53"
VAPI_PHONE_NUMBER_ID = "bb3e2528-8d39-4037-81b4-43aedac6f15e"
EMERGENCY_PHONE_NUMBER = "+918899026009"

def test_vapi():
    url = "https://api.vapi.ai/call/phone"
    headers = {
        "Authorization": f"Bearer {VAPI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "assistantId": VAPI_ASSISTANT_ID,
        "phoneNumberId": VAPI_PHONE_NUMBER_ID,
        "customer": {
            "number": EMERGENCY_PHONE_NUMBER
        }
    }
    
    response = httpx.post(url, headers=headers, json=payload, timeout=20.0)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_vapi()
