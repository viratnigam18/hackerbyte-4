import pandas as pd
import numpy as np
import os
import joblib

from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

# =========================
# LOAD DATA
# =========================
data_path = "../data/raw_dataset.csv"
df = pd.read_csv(data_path)

# =========================
# CLEAN + PREPROCESS
# =========================

# Fill NaN with empty string
df = df.fillna("")

# Get all symptom columns (everything except Disease)
symptom_cols = [col for col in df.columns if col != "Disease"]

# Convert each row into text
def row_to_text(row):
    symptoms = []
    for col in symptom_cols:
        val = str(row[col]).strip()
        if val and val.lower() != "nan":
            symptoms.append(val.replace("_", " "))
    return " ".join(symptoms)

df["text"] = df.apply(row_to_text, axis=1)

# Labels
df["label"] = df["Disease"].str.lower().str.replace(" ", "_")

# =========================
# PREPARE DATA
# =========================
X_text = df["text"].tolist()
y = df["label"].tolist()

# Convert labels to multi-label format
le = LabelEncoder()
Y = le.fit_transform(y)

# =========================
# EMBEDDINGS
# =========================
print("Loading embedding model...")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

print("Generating embeddings...")
X = embedder.encode(X_text, show_progress_bar=True)

# =========================
# TRAIN MODEL
# =========================
print("Training model...")
model = LogisticRegression(max_iter=1000)
model.fit(X, Y)

# =========================
# SAVE EVERYTHING
# =========================
os.makedirs("../models", exist_ok=True)

joblib.dump(model, "../models/model.pkl")
joblib.dump(le, "../models/label_encoder.pkl")

print("✅ Training complete. Model saved in /models")