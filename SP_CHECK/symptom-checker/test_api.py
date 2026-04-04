import sys
import os
import json
from fastapi.testclient import TestClient

# Adjust path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.main import app

client = TestClient(app)

print("---------------------------------------")
print("TEST 1: Good clear accurate symptoms")
print("---------------------------------------")
response = client.post("/predict", json={
    "symptoms": "I have intense chest pain, sweating, and weakness in my limbs.",
    "image_base64": None,
    "user_id": "test_user_abc"
})
# Do it three times to trigger future prediction escalating risk logic
client.post("/predict", json={"symptoms": "I have intense chest pain.", "user_id": "test_user_abc"})
response_3 = client.post("/predict", json={"symptoms": "chest pain is getting worse.", "user_id": "test_user_abc"})
print("Repeated Post Response (Check risk_level):")
print(json.dumps(response_3.json(), indent=2))

print("\nTesting History GET Endpoint:")
history_res = client.get("/history/test_user_abc")
print(json.dumps(history_res.json(), indent=2))

print("\n---------------------------------------")
print("TEST 3: ANTI_STRESS GAMIFICATION")
print("---------------------------------------")
actions_res = client.get("/stress/actions/test_user_abc")
print("Suggested Actions Config:")
print(json.dumps(actions_res.json(), indent=2))

print("\nMarking 'Take 5 Deep Breaths' (ID: 2) as complete...")
complete_res = client.post("/stress/complete", json={"user_id": "test_user_abc", "action_id": 2})
print(json.dumps(complete_res.json(), indent=2))

print("\nFetching Gamified Stats...")
stats_res = client.get("/stress/stats/test_user_abc")
print(json.dumps(stats_res.json(), indent=2))
print(json.dumps(response.json(), indent=2))

print("\n---------------------------------------")
print("TEST 2: Vague input (Testing Hallucination Risk Layer)")
print("---------------------------------------")
response = client.post("/predict", json={
    "symptoms": "feeling sick",
    "image_base64": None
})
print(json.dumps(response.json(), indent=2))
