from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
import torch
from preprocess import load_mental_data
from sklearn.preprocessing import LabelEncoder
import pickle

MODEL_NAME = "distilbert-base-uncased"

def train():
    # Load dataset
    df = load_mental_data("../data/mental_health_unbalanced.csv")

    # Encode labels (text → numbers)
    le = LabelEncoder()
    df['label'] = le.fit_transform(df['label'])

    texts = df['text'].tolist()
    labels = df['label'].tolist()

    # Save label encoder (for prediction later)
    with open("../models/label_encoder.pkl", "wb") as f:
        pickle.dump(le, f)

    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

    # Tokenize
    encodings = tokenizer(texts, truncation=True, padding=True)

    # Dataset class
    class Dataset(torch.utils.data.Dataset):
        def __init__(self, encodings, labels):
            self.encodings = encodings
            self.labels = labels

        def __getitem__(self, idx):
            item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
            item['labels'] = torch.tensor(self.labels[idx])
            return item

        def __len__(self):
            return len(self.labels)

    train_dataset = Dataset(encodings, labels)

    # Load model
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=len(set(labels))
    )

    # Training config
    training_args = TrainingArguments(
        output_dir="../models",
        num_train_epochs=2,
        per_device_train_batch_size=8,
        logging_dir="../logs",
        logging_steps=100
    )

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset
    )

    # Train
    trainer.train()

    # Save model + tokenizer
    model.save_pretrained("../models/mental_model")
    tokenizer.save_pretrained("../models/mental_model")

    print("✅ Training complete. Model saved in models/mental_model")

if __name__ == "__main__":
    train()