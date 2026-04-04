from transformers import AutoTokenizer, AutoModelForSequenceClassification
import sys

MODEL_NAME = "prajjwal1/bert-tiny"
try:
    print(f"Attempting to load {MODEL_NAME} with use_fast=False...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=False)
    print("Tokenizer loaded successfully!")
    
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=4)
    print("Model loaded successfully!")
    
except Exception as e:
    print("\nFAILED with error:")
    print(e)
    sys.exit(1)
