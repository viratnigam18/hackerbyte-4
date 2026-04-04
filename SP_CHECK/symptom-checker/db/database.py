"""
Symptom Checker DB Layer
-------------------------
Collection: symptom_logs
Insert-only. No overwrites.
Uses the singleton MongoClient from mongo_config.
"""
from datetime import datetime
import uuid

# Import the singleton db instance (hackerbyte-4 root is on sys.path via main.py)
from mongo_config import db


def get_or_create_user(user_id: str, name: str = ""):
    if db is None:
        return user_id
    try:
        user = db.users.find_one({"id": user_id})
        if not user:
            db.users.insert_one({
                "id": user_id,
                "name": name,
                "created_at": datetime.utcnow()
            })
    except Exception as e:
        print(f"[SymptomDB] get_or_create_user error: {e}")
    return user_id


def log_prediction(user_id: str, symptoms: str, predictions: list, severity: list):
    """Insert-only log into symptom_logs collection."""
    if db is None:
        return None

    get_or_create_user(user_id)

    log_entry = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "symptoms": symptoms,
        "predictions": predictions,
        "severity": severity,
        "timestamp": datetime.utcnow()
    }

    try:
        db.symptom_logs.insert_one(log_entry)
        return log_entry["id"]
    except Exception as e:
        print(f"[SymptomDB] log_prediction error: {e}")
        return None


def get_user_history(user_id: str, limit: int = 10):
    if db is None:
        return []

    try:
        logs = list(
            db.symptom_logs
            .find({"user_id": user_id})
            .sort("timestamp", -1)
            .limit(limit)
        )
        for log in logs:
            log.pop("_id", None)
        return logs
    except Exception as e:
        print(f"[SymptomDB] get_user_history error: {e}")
        return []
