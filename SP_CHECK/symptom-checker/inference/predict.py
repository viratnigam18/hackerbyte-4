import joblib
from sentence_transformers import SentenceTransformer

# =========================
# LOAD EVERYTHING
# =========================

print("Loading model...")
import os
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
try:
    model = joblib.load(os.path.join(base_dir, "models", "model.pkl"))
    label_encoder = joblib.load(os.path.join(base_dir, "models", "label_encoder.pkl"))
except Exception as e:
    print(f"Warning predicting module models: {e}")

embedder = SentenceTransformer("all-MiniLM-L6-v2")

print("Model loaded successfully!")

# =========================
# PREDICT FUNCTION
# =========================

import numpy as np

def predict(symptom_text):
    text = symptom_text.lower().replace("and", " ").replace(",", " ")

    vec = embedder.encode([text])

    probs = model.predict_proba(vec)[0]

    top_indices = np.argsort(probs)[-3:][::-1]

    diseases = label_encoder.inverse_transform(top_indices)

    results = []
    for i, idx in enumerate(top_indices):
        results.append((diseases[i], probs[idx]))

    return results

def get_severity(disease, confidence):
    high_risk = [
        "heart_attack",
        "paralysis_(brain_hemorrhage)",
        "stroke",
        "hypertension",
        "brain_hemorrhage"
    ]

    medium_risk = [
        "diabetes",
        "arthritis",
        "asthma",
        "pneumonia"
    ]

    if disease in high_risk and confidence > 0.2:
        return "HIGH", "Seek immediate medical attention"

    elif disease in medium_risk:
        return "MEDIUM", "Consult a doctor soon"

    else:
        return "LOW", "Monitor symptoms and rest"

# =========================
# TEST INPUT
# =========================

if __name__ == "__main__":
    while True:
        user_input = input("\nEnter symptoms: ")

        if user_input.lower() == "exit":
            break

        results = predict(user_input)

        print("\nTop Predictions:")
        for i, (disease, conf) in enumerate(results):
            print(f"{i+1}. {disease} ({conf:.2f})")

        # Take top prediction for severity
        top_disease, top_conf = results[0]

        severity, advice = get_severity(top_disease, top_conf)

        print(f"\nSeverity: {severity}")
        print(f"Advice: {advice}")