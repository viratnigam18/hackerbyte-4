import requests
import json

base_url = "http://127.0.0.1:8000"

try:
    # 1. Post to predict
    print("\n--- 1. POST /predict ---")
    predict_payload = {
        "symptoms": "I am feeling very stressed and have chest pains.",
        "user_id": "demo_user_123",
        "image_base64": None
    }
    r1 = requests.post(f"{base_url}/predict", json=predict_payload)
    print("Predict Response:")
    print(json.dumps(r1.json(), indent=2))

    # 2. Get actions
    print("\n--- 2. GET /stress/actions/demo_user_123 ---")
    r2 = requests.get(f"{base_url}/stress/actions/demo_user_123?severity=HIGH")
    print(json.dumps(r2.json(), indent=2))

    # 3. Complete action
    print("\n--- 3. POST /stress/complete ---")
    r3 = requests.post(f"{base_url}/stress/complete", json={"user_id": "demo_user_123", "action_id": 5})
    print(json.dumps(r3.json(), indent=2))
    
    # 4. Get stats
    print("\n--- 4. GET /stress/stats/demo_user_123 ---")
    r4 = requests.get(f"{base_url}/stress/stats/demo_user_123")
    print(json.dumps(r4.json(), indent=2))

except Exception as e:
    print(f"Connection error: {e}")
