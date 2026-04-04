import io
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2

app = FastAPI(title="Diagnostic Image-to-Text API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load a lightweight, pre-trained model (MobileNetV3 Small)
# This serves as a secondary check for "Biological" content.
# (Weight download occurs on first run only)
model = models.mobilenet_v3_small(pretrained=True)
model.eval()

# Vision Preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def analyze_visual_features(img_np):
    """
    Analyzes the image for medical-style symptoms using Color Analysis and Texture/Edge detection.
    """
    # 1. Redness Detection (using HSV color space)
    hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)
    
    # Red has two ranges in HSV
    lower_red1 = np.array([0, 70, 50])
    upper_red1 = np.array([10, 255, 255])
    lower_red2 = np.array([170, 70, 50])
    upper_red2 = np.array([180, 255, 255])
    
    mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    red_mask = mask1 + mask2
    
    red_ratio = np.sum(red_mask > 0) / (img_np.shape[0] * img_np.shape[1])
    
    # 2. Edge/Texture Detection (Laceration/Cut analysis)
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, 100, 200)
    edge_density = np.sum(edges > 0) / (img_np.shape[0] * img_np.shape[1])
    
    # 3. Variance of Laplacian (to check for sharp vs blurry/soft patterns)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    return {
        "redness_score": float(red_ratio),
        "edge_score": float(edge_density),
        "texture_score": float(laplacian_var) / 1000.0 # Normalized roughly
    }

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    try:
        # Read and open image
        contents = await file.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        img_np = np.array(pil_image)

        # 1. Heuristic Analysis
        visual_features = analyze_visual_features(img_np)
        
        # 2. Deep Learning Pre-check (checking confidence of generic classification)
        input_tensor = preprocess(pil_image)
        input_batch = input_tensor.unsqueeze(0)
        with torch.no_grad():
            output = model(input_batch)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        dl_conf = float(torch.max(probabilities).item())

        # 3. Diagnostic Reasoning Logic
        issue = "Healthy or Non-Biological Surface"
        details = "No significant abnormalities detected in the image."
        suggestion = "Keep monitoring. If irritation persists, consult a professional."
        severity = "Low"

        # Thresholds
        red_threshold = 0.05      # 5% of pixels are red
        edge_threshold = 0.02     # 2% density for cuts
        sharpness_threshold = 0.5 # High activity texture

        if visual_features["redness_score"] > red_threshold:
            if visual_features["edge_score"] < edge_threshold:
                issue = "Potential Burn or Inflammation"
                details = "Detected a high concentration of redness with smooth texture, characteristic of a burn or area of inflammation."
                suggestion = "Apply cool water (not ice) and keep the area protected. Seek medical help for blistering."
                severity = "Medium"
            else:
                issue = "Infected Laceration / Road Rash"
                details = "Detected both redness and high edge density, suggesting a cut with surrounding inflammation or an abrasion."
                suggestion = "Clean with mild soap and water, apply antiseptic, and bandage."
                severity = "Medium to High"
        
        elif visual_features["edge_score"] > edge_threshold:
            issue = "Laceration / Cut identified"
            details = "Detected sharp, linear boundaries consistent with a physical cut or scratch."
            suggestion = "Clean properly, apply pressure if bleeding, and use a sterile dressing."
            severity = "Low to Medium"
            
        elif dl_conf < 0.01 and visual_features["redness_score"] < 0.01:
            issue = "Stain or Discoloration"
            details = "Detected a low-contrast irregular patch, likely a surface stain or non-inflammatory skin irregularity."
            suggestion = "Monitor for changes in size or color. Consult a dermatologist if it persists."
            severity = "Low"

        return {
            "status": "success",
            "problem": issue,
            "details": details,
            "suggestion": suggestion,
            "severity": severity,
            "metrics": {
                "redness": round(visual_features["redness_score"], 4),
                "texture_edges": round(visual_features["edge_score"], 4),
                "dl_confidence": round(dl_conf, 4)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def health_check():
    return {"status": "online", "mode": "Diagnostic Heuristics"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
