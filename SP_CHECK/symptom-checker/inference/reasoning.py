import re

# Comprehensive list derived from raw_dataset.csv
KNOWN_SYMPTOMS = [
    "itching", "skin rash", "nodal skin eruptions", "continuous sneezing", 
    "shivering", "chills", "joint pain", "stomach pain", "acidity", 
    "ulcers on tongue", "muscle wasting", "vomiting", "burning micturition",
    "spotting urination", "fatigue", "weight gain", "anxiety", "cold hands and feets",
    "mood swings", "weight loss", "restlessness", "lethargy", "patches in throat",
    "irregular sugar level", "cough", "high fever", "sunken eyes", "breathlessness",
    "sweating", "dehydration", "indigestion", "headache", "yellowish skin",
    "dark urine", "nausea", "loss of appetite", "pain behind the eyes",
    "back pain", "constipation", "abdominal pain", "diarrhoea", "mild fever",
    "yellow urine", "yellowing of eyes", "acute liver failure", "fluid overload",
    "swelling of stomach", "swelled lymph nodes", "malaise", "blurred and distorted vision",
    "phlegm", "throat irritation", "redness of eyes", "sinus pressure", "runny nose",
    "congestion", "chest pain", "weakness in limbs", "fast heart rate",
    "pain during bowel movements", "pain in anal region", "bloody stool",
    "irritation in anus", "neck pain", "dizziness", "cramps", "bruising",
    "obesity", "swollen legs", "swollen blood vessels", "puffy face and eyes",
    "enlarged thyroid", "brittle nails", "swollen extremeties", "excessive hunger",
    "extra marital contacts", "drying and tingling lips", "slurred speech",
    "knee pain", "hip joint pain", "muscle weakness", "stiff neck",
    "swelling joints", "movement stiffness", "spinning movements", "loss of balance",
    "unsteadiness", "weakness of one body side", "loss of smell", "bladder discomfort",
    "foul smell of urine", "continuous feel of urine", "passage of gases", "internal itching",
    "toxic look (typhos)", "depression", "irritability", "muscle pain", "altered sensorium",
    "red spots over body", "belly pain", "abnormal menstruation", "dischromic patches",
    "watering from eyes", "increased appetite", "polyuria", "family history", 
    "mucoid sputum", "rusty sputum", "lack of concentration", "visual disturbances",
    "receiving blood transfusion", "receiving unsterile injections", "coma",
    "stomach bleeding", "distention of abdomen", "history of alcohol consumption",
    "fluid overload", "blood in sputum", "prominent veins on calf", "palpitations",
    "painful walking", "pus filled pimples", "blackheads", "scurring",
    "skin peeling", "silver like dusting", "small dents in nails", "inflammatory nails",
    "blister", "red sore around nose", "yellow crust ooze"
]

def extract_symptoms(text: str):
    text_lower = text.lower()
    found = []
    # check multi-word symptoms first by sorting lengths
    sorted_symptoms = sorted(KNOWN_SYMPTOMS, key=len, reverse=True)
    for symptom in sorted_symptoms:
        if re.search(r'\b' + re.escape(symptom) + r'\b', text_lower):
            found.append(symptom)
            # remove the found phrase to prevent partial matching (like "chest pain" vs "pain")
            text_lower = text_lower.replace(symptom, "")
    return found

def get_reliability_metrics(text: str, max_confidence: float):
    words = text.split()
    is_vague = len(words) < 3

    warning = None
    level = "HIGH"

    if is_vague:
        warning = "Insufficient context provided. Please describe your symptoms in more detail."
        level = "LOW"
    elif max_confidence < 0.35:
        warning = "High uncertainty. The model is struggling to match your symptoms to a known condition. (AI Hallucination Risk)"
        level = "LOW"
    elif max_confidence < 0.65:
        level = "MEDIUM"

    return {
        "level": level,
        "warning": warning,
        "is_vague": is_vague
    }

def generate_explanation(detected: list, disease: str):
    if not detected:
        return f"Based on the overall text matching, the most probable condition is {disease}."
    return f"The presence of {', '.join(detected)} strongly aligns with the clinical presentation of {disease.replace('_', ' ')}."
