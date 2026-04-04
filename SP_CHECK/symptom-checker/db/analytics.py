from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple
import collections
from db.database import get_user_history
from inference.reasoning import extract_symptoms

def analyze_user_risk(user_id: str) -> Tuple[Optional[str], Optional[str]]:
    """
    Evaluates short-term risk based entirely on offline stored logs.
    Returns (history_insight, risk_level)
    """
    if not user_id:
        return None, None
        
    logs = get_user_history(user_id, limit=30)
    if not logs:
        return None, "low"
        
    now = datetime.utcnow()
    recent_logs = []
    
    # Filter to last 7 days for acute tracking
    for log in logs:
        # MongoDB creates real datetime objects for us
        ts = log.get('timestamp')
        if isinstance(ts, str):
            try:
                ts = datetime.fromisoformat(ts)
            except:
                continue
                
        if ts and (now - ts) <= timedelta(days=7):
            recent_logs.append(log)
            
    if len(recent_logs) < 2:
        return None, "low"
        
    # Count repeating extracted symptoms
    symptom_counter = collections.Counter()
    severe_incidents = 0
    
    for log in recent_logs:
        symptoms_text = log.get("symptoms", "")
        extracted = extract_symptoms(symptoms_text)
        for s in extracted:
            symptom_counter[s] += 1
            
        # Check if they had high severity before
        sev_list = log.get("severity", [])
        if "HIGH" in sev_list:
            severe_incidents += 1
            
    if not symptom_counter:
        return None, "low"
        
    most_common_symptom, count = symptom_counter.most_common(1)[0]
    
    risk_level = "low"
    insight = None
    
    if count >= 3:
        risk_level = "high"
        insight = f"You have reported '{most_common_symptom}' {count} times in the last 7 days. Possible pattern detected: risk increasing."
    elif count == 2:
        risk_level = "medium"
        insight = f"You have reported '{most_common_symptom}' twice recently. Keep monitoring."
        
    # Escalation check
    if severe_incidents >= 2 and risk_level != "high":
        risk_level = "high"
        insight = "Multiple high severity entries detected recently. Please consult a doctor."
        
    return insight, risk_level
