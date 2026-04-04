from typing import List, Dict

def fuse_predictions(text_preds: List[Dict], vision_preds: List[Dict]) -> List[Dict]:
    """
    Fuses text and vision predictions.
    If both text and vision predict the same disease, it boosts confidence.
    """
    if not vision_preds:
        return text_preds
    if not text_preds:
        return vision_preds
        
    combined_scores = {}
    
    # Weight configuration
    TEXT_WEIGHT = 0.65
    VISION_WEIGHT = 0.35
    
    for tp in text_preds:
        disease = tp["disease"].lower().strip()
        combined_scores[disease] = combined_scores.get(disease, 0.0) + (tp["confidence"] * TEXT_WEIGHT)
        
    for vp in vision_preds:
        disease = vp["disease"].lower().strip()
        # If vision model detects something not in top text preds, we add it with a penalty
        combined_scores[disease] = combined_scores.get(disease, 0.0) + (vp["confidence"] * VISION_WEIGHT)
        
    # Sort by fused score
    sorted_fused = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
    
    # Reformat
    results = [{"disease": d.title(), "confidence": min(1.0, float(c))} for d, c in sorted_fused]
    
    return results[:3] # return top 3
