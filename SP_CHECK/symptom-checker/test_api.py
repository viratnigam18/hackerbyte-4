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
    "image_base64": None
})
print(json.dumps(response.json(), indent=2))

print("\n---------------------------------------")
print("TEST 2: Vague input (Testing Hallucination Risk Layer)")
print("---------------------------------------")
response = client.post("/predict", json={
    "symptoms": "feeling sick",
    "image_base64": None
})
print(json.dumps(response.json(), indent=2))
