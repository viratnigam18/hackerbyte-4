import os
import pickle
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments, EarlyStoppingCallback
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
from preprocess import load_mental_data

MODEL_NAME = "distilbert-base-uncased"

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

def compute_metrics(p):
    preds = np.argmax(p.predictions, axis=1)
    labels = p.label_ids
    accuracy = accuracy_score(labels, preds)
    f1 = f1_score(labels, preds, average='weighted')
    precision = precision_score(labels, preds, average='weighted', zero_division=0)
    recall = recall_score(labels, preds, average='weighted', zero_division=0)
    return {
        'accuracy': accuracy,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }

class CustomWeightedTrainer(Trainer):
    def __init__(self, class_weights, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.class_weights = class_weights

    def compute_loss(self, model, inputs, return_outputs=False, **kwargs):
        labels = inputs.pop("labels")
        outputs = model(**inputs)
        logits = outputs.logits
        # move class weights to same device as logits
        loss_fct = torch.nn.CrossEntropyLoss(weight=self.class_weights.to(logits.device))
        loss = loss_fct(logits.view(-1, self.model.config.num_labels), labels.view(-1))
        return (loss, outputs) if return_outputs else loss

def train():
    # Calculate absolute base directory of the mental_model folder
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    models_dir = os.path.join(base_dir, "models")
    logs_dir = os.path.join(base_dir, "logs")
    data_path = os.path.join(base_dir, "data", "mental_health_unbalanced.csv")
    
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(logs_dir, exist_ok=True)
    
    # Load dataset
    df = load_mental_data(data_path)

    # Encode labels
    le = LabelEncoder()
    df['label'] = le.fit_transform(df['label'])
    
    # Save label encoder
    encoder_path = os.path.join(models_dir, "label_encoder.pkl")
    with open(encoder_path, "wb") as f:
        pickle.dump(le, f)

    # Train / Val Split (80/20)
    texts_train, texts_val, labels_train, labels_val = train_test_split(
        df['text'].tolist(), 
        df['label'].tolist(), 
        test_size=0.2, 
        random_state=42, 
        stratify=df['label'].tolist()
    )

    # Calculate class weights for unbalanced classes
    unique_classes = np.unique(labels_train)
    weights = compute_class_weight('balanced', classes=unique_classes, y=labels_train)
    class_weights_tensor = torch.tensor(weights, dtype=torch.float)

    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

    # Tokenize
    train_encodings = tokenizer(texts_train, truncation=True, padding=True)
    val_encodings = tokenizer(texts_val, truncation=True, padding=True)

    # Create datasets
    train_dataset = Dataset(train_encodings, labels_train)
    val_dataset = Dataset(val_encodings, labels_val)

    # Load model
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=len(unique_classes)
    )

    # Optimized Training config
    training_args = TrainingArguments(
        output_dir=models_dir,
        num_train_epochs=3,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        eval_strategy="epoch",
        save_strategy="epoch",
        logging_dir=logs_dir,
        logging_steps=50,
        learning_rate=2e-5,
        weight_decay=0.01,
        fp16=torch.cuda.is_available(),
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        greater_is_better=True
    )

    # Setup Custom Trainer
    trainer = CustomWeightedTrainer(
        class_weights=class_weights_tensor,
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=1)]
    )

    # Train
    trainer.train()

    # Save best model + tokenizer
    model_save_path = os.path.join(models_dir, "mental_model")
    model.save_pretrained(model_save_path)
    tokenizer.save_pretrained(model_save_path)

    print(f"✅ Optimized Training complete. Best model saved in {model_save_path}")

if __name__ == "__main__":
    train()