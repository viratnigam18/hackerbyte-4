from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import pickle

MODEL_PATH = "../models/mental_model"

# Load model + tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)

# Load label encoder
with open("../models/label_encoder.pkl", "rb") as f:
    le = pickle.load(f)

def predict(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

    outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=1)

    pred = torch.argmax(probs).item()
    label = le.inverse_transform([pred])[0]

    return label, probs.tolist()

if __name__ == "__main__":
    while True:
        text = input("\nEnter text: ")
        label, prob = predict(text)
        print(f"Prediction: {label}")