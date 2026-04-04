import sys, os

# ── Path setup ──────────────────────────────────────────────────────
# base_dir = SP_CHECK/symptom-checker  (parent of api/)
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# project_root = hackerbyte-4  (for mongo_config and ANTI_STRESS)
project_root = os.path.dirname(os.path.dirname(base_dir))

# Insert at position 0 so our packages beat any site-packages shadows
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# ── Framework & ML imports ──────────────────────────────────────────
from fastapi import FastAPI
import joblib
from sentence_transformers import SentenceTransformer
import numpy as np

# ── Internal imports ────────────────────────────────────────────────
from api_models import SymptomRequest, SymptomResponse, Prediction, Reliability, Reasoning, HistoryResponse, HistoryEntry
from inference.predict_vision import predict_image
from inference.fusion import fuse_predictions
from inference.reasoning import extract_symptoms, get_reliability_metrics, generate_explanation
from inference.follow_up import get_follow_up_questions
from inference.predict import get_severity

# SP_CHECK local DB layer (symptom_logs)
from db.database import log_prediction, get_user_history
from db.analytics import analyze_user_risk
from ANTI_STRESS.api_routes import stress_router
from ANTI_STRESS.engine import get_recommended_actions

# ── App ─────────────────────────────────────────────────────────────
app = FastAPI(title="Elite AI Symptom Checker")
app.include_router(stress_router)

# ── Load ML models once ────────────────────────────────────────────
model = label_encoder = embedder = None
try:
    model = joblib.load(os.path.join(base_dir, "models", "model.pkl"))
    label_encoder = joblib.load(os.path.join(base_dir, "models", "label_encoder.pkl"))
    embedder = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    print(f"Error loading models: {e}")


# ── Predict endpoint ───────────────────────────────────────────────
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

    # 3. Multimodal Fusion
    fused_raw = fuse_predictions(text_preds, vision_preds)

    # 4. Intelligence & Reasoning
    extracted = extract_symptoms(text)
    top_disease = fused_raw[0]["disease"].replace("_", " ") if fused_raw else "Unknown"
    reasoning_text = generate_explanation(extracted, top_disease)

    # 5. Uncertainty & Reliability Layer
    max_text_conf = text_preds[0]["confidence"] if text_preds else 0.0
    max_vis_conf = vision_preds[0]["confidence"] if vision_preds else 0.0
    reliability_metrics = get_reliability_metrics(request.symptoms, max(max_text_conf, max_vis_conf))

    # 6. Build final predictions with severity
    final_predictions = []
    for pred in fused_raw:
        d_norm = pred["disease"].lower().replace(" ", "_")
        severity, advice = get_severity(d_norm, pred["confidence"])
        final_predictions.append(Prediction(
            disease=pred["disease"],
            confidence=pred["confidence"],
            severity=severity,
        ))

    # 7. Smart Follow-up Questions
    follow_up_qs = []
    if final_predictions:
        follow_up_qs = get_follow_up_questions(final_predictions[0].disease)

    # 8. History logging & risk analysis
    history_insight = None
    risk_level = None
    if request.user_id:
        raw_predictions = [{"disease": p.disease, "confidence": p.confidence} for p in final_predictions]
        raw_severities = [p.severity for p in final_predictions]
        log_prediction(request.user_id, request.symptoms, raw_predictions, raw_severities)
        history_insight, risk_level = analyze_user_risk(request.user_id)

    # 9. Anti-Stress recommended actions
    top_severity_in_preds = "LOW"
    if final_predictions:
        top_severity_in_preds = final_predictions[0].severity.upper()
    recommended_actions_list = get_recommended_actions(
        top_severity_in_preds, request.user_id or "anonymous"
    )

    # 10. Build response
    return SymptomResponse(
        predictions=final_predictions,
        reasoning=Reasoning(
            detected_symptoms=extracted,
            missing_symptoms_inquired=follow_up_qs[:1],
            explanation=reasoning_text,
        ),
        reliability=Reliability(
            level=reliability_metrics["level"],
            warning=reliability_metrics["warning"],
            is_vague=reliability_metrics["is_vague"],
        ),
        follow_up=follow_up_qs,
        history_insight=history_insight,
        risk_level=risk_level,
        stress_level=top_severity_in_preds,
        recommended_actions=recommended_actions_list,
    )


# ── History endpoint ────────────────────────────────────────────────
@app.get("/history/{user_id}", response_model=HistoryResponse)
def get_history_api(user_id: str):
    logs = get_user_history(user_id, limit=10)
    entries = []
    for log in logs:
        ts = log.get("timestamp")
        if not isinstance(ts, str):
            ts = ts.isoformat() if ts else ""
        entries.append(HistoryEntry(
            id=log.get("id", ""),
            user_id=log.get("user_id", ""),
            symptoms=log.get("symptoms", ""),
            predictions=log.get("predictions", []),
            severity=log.get("severity", []),
            timestamp=ts,
        ))
    return HistoryResponse(user_id=user_id, history=entries)