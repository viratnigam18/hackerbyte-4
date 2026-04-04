import sys
import os

# Add hackerbyte-4 to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ANTI_STRESS.engine import get_recommended_actions
from ANTI_STRESS.database import complete_action, get_user_stats_db

def demo():
    user = 'demo_user_123'
    
    print("\n" + "="*50)
    print(" 🎮 ANTI-STRESS GAMIFICATION DEMO ")
    print("="*50)
    
    # 1. Fetch recommendations based on HIGH stress
    print("\n[SCENARIO 1] AI detects HIGH Stress level")
    actions = get_recommended_actions('HIGH', user)
    print(f"-> System recommends {len(actions)} offline/fallback actions:")
    for a in actions:
        print(f"   ⭐ [{a['id']}] {a['title']}: {a['description']} (+{a['points']} pts)")
        
    if not actions:
        print("No actions returned.")
        return
        
    target_action = actions[0]
        
    print("\n[SCENARIO 2] User Completes an Action")
    print(f"-> User selects Action ID {target_action['id']} ({target_action['title']}) and completes the real-world task.")
    
    # Attempt to mark complete (will return False if DB is offline, but we can see the attempt)
    success = complete_action(user, target_action['id'])
    
    if success:
        print(f"✅ Success! User earned {target_action['points']} points.")
    else:
        print(f"⚠️ Action could not be saved to DB! (Offline Graceful Degradation in effect)")
        
    print("\n[SCENARIO 3] Checking User Stats")
    stats = get_user_stats_db(user)
    print(f"-> Current Stats for '{user}':")
    print(f"   🏆 Total Points: {stats.get('total_points')}")
    print(f"   🔥 Current Streak: {stats.get('current_streak')} days")
    print(f"   📅 Last Completed Date: {stats.get('last_completed_date', 'Never')}")
    print("\n" + "="*50 + "\n")

if __name__ == "__main__":
    demo()
