"""
Anti-Stress Behaviour Engine
------------------------------
Selects & rotates recommended actions based on severity level.
Avoids repeating actions completed in the last 24 hours.
All queries are MongoDB — zero SQL.
"""
import random
from datetime import datetime, timedelta

from mongo_config import db


# Static fallbacks when MongoDB is unavailable
_FALLBACK_LOW = [
    {"id": 1, "title": "Drink Water", "description": "Hydrate yourself with a glass of water", "points": 5, "category": "physical"},
]
_FALLBACK_HIGH = [
    {"id": 5, "title": "Guided Breathing", "description": "Listen to a 10-minute 4-7-8 breathing guide", "points": 25, "category": "breathing"},
]

# Action IDs mapped to severity tiers
_SEVERITY_MAP = {
    "LOW": [1, 2],
    "MEDIUM": [2, 3, 4],
    "HIGH": [5, 6, 7, 2],
}


def get_recommended_actions(stress_level: str, user_id: str):
    """
    Returns 2 recommended actions for the given severity.
    Filters out actions completed in the last 24h to avoid repetition.
    Falls back to static data if MongoDB is offline.
    """
    level = stress_level.upper()

    # Offline fallback
    if db is None:
        return _FALLBACK_HIGH if level == "HIGH" else _FALLBACK_LOW

    target_ids = _SEVERITY_MAP.get(level, [1, 2, 3])

    # Query: which actions did this user complete in the last 24h?
    yesterday = datetime.utcnow() - timedelta(days=1)
    recently_completed = []
    try:
        cursor = db.user_actions.find(
            {"user_id": user_id, "timestamp": {"$gte": yesterday}},
            {"action_id": 1, "_id": 0},
        )
        recently_completed = [doc["action_id"] for doc in cursor]
    except Exception as e:
        print(f"[Engine] recent-actions query error: {e}")

    # Prefer actions NOT recently completed
    preferred = [tid for tid in target_ids if tid not in recently_completed]
    if len(preferred) < 2:
        preferred = target_ids

    sampled_ids = random.sample(preferred, min(2, len(preferred)))

    # Fetch full action documents
    actions = []
    for sid in sampled_ids:
        try:
            doc = db.stress_actions.find_one({"id": sid}, {"_id": 0})
            if doc:
                actions.append(doc)
        except Exception as e:
            print(f"[Engine] stress_actions fetch error: {e}")

    return actions
