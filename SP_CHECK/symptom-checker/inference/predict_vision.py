import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io
import base64

# =========================
# VISION INFERENCE SETUP
# =========================
print("Loading vision model (EfficientNet-B0)...")

try:
    vision_model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
    vision_model.eval()
    
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    VISION_ENABLED = True
    print("Vision model loaded successfully!")
except Exception as e:
    print(f"Warning: Could not load vision model. {e}")
    VISION_ENABLED = False

def decode_image(base64_string: str) -> Image.Image:
    if base64_string.startswith("data:image"):
        base64_string = base64_string.split(",")[1]
    
    image_data = base64.b64decode(base64_string)
    image = Image.open(io.BytesIO(image_data)).convert('RGB')
    return image

def predict_image(image_b64: str):
    if not VISION_ENABLED or not image_b64:
        return []
        
    try:
        image = decode_image(image_b64)
        input_tensor = transform(image)
        input_batch = input_tensor.unsqueeze(0)

        with torch.no_grad():
            output = vision_model(input_batch)
            probabilities = torch.nn.functional.softmax(output[0], dim=0)

        top3_prob, top3_catid = torch.topk(probabilities, 3)
        
        # Hackathon mock logic: map image features to skin diseases
        simulated_skin_diseases = ["Acne", "Fungal infection", "Psoriasis", "Impetigo", "Drug Reaction"]
        idx = int(torch.sum(input_batch).item()) % len(simulated_skin_diseases)
        
        results = [
            {"disease": simulated_skin_diseases[idx], "confidence": float(top3_prob[0].item())},
            {"disease": simulated_skin_diseases[(idx+1)%len(simulated_skin_diseases)], "confidence": float(top3_prob[1].item())},
            {"disease": simulated_skin_diseases[(idx+2)%len(simulated_skin_diseases)], "confidence": float(top3_prob[2].item())}
        ]
        return results

    except Exception as e:
        print(f"Error in vision inference: {e}")
        return []
