"""
Anti-Stress Gamification DB Layer
----------------------------------
Collections: stress_actions, user_actions, user_stats
Fully MongoDB. Zero SQLite.
Uses the singleton MongoClient from mongo_config.
"""
from pymongo import UpdateOne
from datetime import datetime, date

# Import the singleton db instance
from mongo_config import db


# ──────────────────────────
#  Startup: Seed Actions
# ──────────────────────────

def init_db():
    """Upsert default stress actions on startup. Safe to call multiple times."""
    if db is None:
        print("[AntiStress] DB unavailable — running in offline fallback mode.")
        return

    actions = [
        {"id": 1, "title": "Drink Water", "description": "Hydrate yourself with a glass of water", "points": 5, "category": "physical"},
        {"id": 2, "title": "Take 5 Deep Breaths", "description": "Inhale for 4s, hold for 4s, exhale for 4s", "points": 10, "category": "breathing"},
        {"id": 3, "title": "Short Walk", "description": "Walk around your space for 5 minutes", "points": 20, "category": "physical"},
        {"id": 4, "title": "Write Thoughts", "description": "Jot down 3 things on your mind", "points": 15, "category": "mental"},
        {"id": 5, "title": "Guided Breathing", "description": "Listen to a 10-minute 4-7-8 breathing guide", "points": 25, "category": "breathing"},
        {"id": 6, "title": "Grounding Exercise", "description": "Name 5 things you can see, 4 you can touch, 3 hear", "points": 30, "category": "mental"},
        {"id": 7, "title": "Calm-Down Protocol", "description": "Wash your face with cold water and stretch", "points": 30, "category": "physical"},
    ]

    operations = [
        UpdateOne({"id": a["id"]}, {"$setOnInsert": a}, upsert=True)
        for a in actions
    ]

    try:
        db.stress_actions.bulk_write(operations)
        print(f"[AntiStress] Seeded {len(actions)} actions into stress_actions.")
    except Exception as e:
        print(f"[AntiStress] Seed error: {e}")


# ──────────────────────────
#  Read helpers
# ──────────────────────────

def get_action(action_id: int):
    """Fetch a single stress action by its integer id."""
    if db is None:
        return None
    try:
        doc = db.stress_actions.find_one({"id": action_id}, {"_id": 0})
        return doc
    except Exception as e:
        print(f"[AntiStress] get_action error: {e}")
        return None


def get_user_stats_db(user_id: str):
    """Return the user_stats document. Creates one if missing."""
    default = {
        "user_id": user_id,
        "total_points": 0,
        "current_streak": 0,
        "last_completed_date": None,
    }
    if db is None:
        return default

    try:
        stats = db.user_stats.find_one({"user_id": user_id}, {"_id": 0})
        if not stats:
            db.user_stats.insert_one(default.copy())
            return default
        return stats
    except Exception as e:
        print(f"[AntiStress] get_user_stats_db error: {e}")
        return default


# ──────────────────────────
#  Complete action + streak
# ──────────────────────────

def complete_action(user_id: str, action_id: int):
    """
    Mark an action as completed.
    - Inserts into user_actions
    - Updates user_stats using $inc for points
    - Handles streak logic based on last_completed_date
    """
    if db is None:
        return False

    action = get_action(action_id)
    if not action:
        return False

    # 1. Log the completion
    try:
        db.user_actions.insert_one({
            "user_id": user_id,
            "action_id": action_id,
            "completed": True,
            "timestamp": datetime.utcnow(),
        })
    except Exception as e:
        print(f"[AntiStress] user_actions insert error: {e}")
        return False

    # 2. Get current stats
    stats = get_user_stats_db(user_id)
    points_earned = action["points"]
    today_str = date.today().isoformat()
    last_date = stats.get("last_completed_date")

    # 3. Streak logic
    new_streak = stats["current_streak"]
    if last_date != today_str:
        if last_date:
            try:
                last = date.fromisoformat(last_date)
                diff = (date.today() - last).days
                if diff == 1:
                    new_streak += 1
                elif diff > 1:
                    new_streak = 1
            except ValueError:
                new_streak = 1
        else:
            new_streak = 1

    # 4. Atomic update: $inc for points, $set for streak & date
    try:
        db.user_stats.update_one(
            {"user_id": user_id},
            {
                "$inc": {"total_points": points_earned},
                "$set": {
                    "current_streak": new_streak,
                    "last_completed_date": today_str,
                },
            },
            upsert=True,
        )
    except Exception as e:
        print(f"[AntiStress] user_stats update error: {e}")
        return False

    return True
