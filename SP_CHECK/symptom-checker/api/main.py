import sys
import os
# append parent dir so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
import joblib
from sentence_transformers import SentenceTransformer
import numpy as np

from api.api_models import SymptomRequest, SymptomResponse, Prediction, Reliability, Reasoning
from inference.predict_vision import predict_image
from inference.fusion import fuse_predictions
from inference.reasoning import extract_symptoms, get_reliability_metrics, generate_explanation
from inference.follow_up import get_follow_up_questions
from inference.predict import get_severity

app = FastAPI(title="Elite AI Symptom Checker")

# load model once
try:
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model = joblib.load(os.path.join(base_dir, "models", "model.pkl"))
    label_encoder = joblib.load(os.path.join(base_dir, "models", "label_encoder.pkl"))
    embedder = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    print(f"Error loading models: {e}")

@app.post("/predict", response_model=SymptomResponse)
def predict_api(request: SymptomRequest):
    text = request.symptoms.lower().replace("and", " ").replace(",", " ")

    # 1. Text Inference
    vec = embedder.encode([text])
    probs = model.predict_proba(vec)[0]
    top_indices = np.argsort(probs)[-3:][::-1]
    diseases = label_encoder.inverse_transform(top_indices)
    
    text_preds = []
    for i, idx in enumerate(top_indices):
        text_preds.append({
            "disease": diseases[i],
            "confidence": float(probs[idx]),
        })

    # 2. Vision Inference
    vision_preds = []
    if request.image_base64:
        vision_preds = predict_image(request.image_base64)
        
    # 3. Multimodal Fusion (Part 1)
    fused_raw = fuse_predictions(text_preds, vision_preds)

    # 4. Intelligence & Reasoning (Part 2)
    extracted = extract_symptoms(text)
    
    top_disease = fused_raw[0]["disease"].replace("_", " ") if fused_raw else "Unknown"
    reasoning_text = generate_explanation(extracted, top_disease)
    
    # 5. Uncertainty & Reality Layer (Part 3)
    max_text_conf = text_preds[0]["confidence"] if text_preds else 0.0
    max_vis_conf = vision_preds[0]["confidence"] if vision_preds else 0.0
    
    reliability_metrics = get_reliability_metrics(request.symptoms, max(max_text_conf, max_vis_conf))
    
    # Convert fused dicts to Prediction pydantic schemas, injecting severity
    final_predictions = []
    for pred in fused_raw:
        d_norm = pred["disease"].lower().replace(" ", "_")
        severity, advice = get_severity(d_norm, pred["confidence"])
        
        final_predictions.append(Prediction(
            disease=pred["disease"],
            confidence=pred["confidence"],
            severity=severity
        ))
        
    # 6. Smart Follow-up Questions (Part 4)
    follow_up_qs = []
    if final_predictions:
        # Recommend follow ups if confidence isn't absolute 1.0 (or to all users to refine)
        follow_up_qs = get_follow_up_questions(final_predictions[0].disease)
        
    # Final response object satisfying the robust Part 5 API contract
    return SymptomResponse(
        predictions=final_predictions,
        reasoning=Reasoning(
            detected_symptoms=extracted,
            missing_symptoms_inquired=follow_up_qs[:1], # Record what we ask
            explanation=reasoning_text
        ),
        reliability=Reliability(
            level=reliability_metrics["level"],
            warning=reliability_metrics["warning"],
            is_vague=reliability_metrics["is_vague"]
        ),
        follow_up=follow_up_qs
    )