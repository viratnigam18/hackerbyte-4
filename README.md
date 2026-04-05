<![CDATA[# 🩺 LifeLine AI — Intelligent Health & Wellness Platform

> **Your AI-powered personal health companion — from mental health support to emergency SOS.**

[![Demo Video](https://img.shields.io/badge/▶_Watch_Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/i_ZBd-ZyeRM)

---

## 📽️ Demo Video

🎬 **Watch the full walkthrough:** [https://youtu.be/i_ZBd-ZyeRM](https://youtu.be/i_ZBd-ZyeRM)

---

## 🌟 What is LifeLine AI?

LifeLine AI is a comprehensive, AI-driven health platform built during **HackByte 4.0**. It combines real-time mental health diagnostics, smart medicine recommendations, emergency SOS alerts, and anti-stress gaming — all in a single, beautifully designed dashboard.

---

## ✨ Key Features

### 🧠 AI Mental Health Assistant
- Real-time mental health classification powered by **OpenRouter / GPT-3.5 Turbo**
- Detects categories: *Anxiety, Depression, Stress, Bipolar, Suicidal ideation, Personality Disorder*
- Provides empathetic, clinician-style responses with actionable self-care tips
- Severity-based color coding (low → critical)

### 💊 Smart Medicine & Remedy Suggestions
- Symptom-based OTC medicine recommendations via AI
- Home remedy suggestions with dosage and usage instructions
- Keyword-based fallback engine for offline resilience

### 📋 Prescription Scanner (OCR)
- Upload a prescription image and extract all medicines automatically
- Uses **GPT-4o-mini Vision** for handwriting recognition
- Auto-generates dosage schedules with reminder times

### 🚨 Emergency SOS System
- One-tap SOS button that triggers:
  - 📱 **WhatsApp alert** with patient details, symptoms, and live GPS location (via Green API)
  - 📍 **Native map pin** sent directly to emergency contacts
  - 📞 **Automated voice call** via **Vapi AI** with patient context

### 🏥 Nearby Hospitals Map
- Real-time hospital discovery using **Leaflet + OpenStreetMap**
- Adaptive radar search — auto-expands radius until hospitals are found
- GPS-based location tracking

### 🎮 Anti-Stress Games
- **Breathing Exercise** — Guided 4-7-8 breathing with visual feedback
- **Bubble Pop** — Satisfying stress-relief bubble popping
- **Zen Trace** — Meditative pattern tracing
- **Drift Space** — Ambient space relaxation with calming music

### 📊 Health Dashboard
- Vitals monitoring with smartwatch connectivity status
- AI-powered health score & future health predictions
- Medication tracking with reminder scheduling
- Interactive charts via **Recharts**

### 🎨 Immersive UI/UX
- 3D DNA helix animation on the landing page (Three.js)
- Glassmorphism design with particle backgrounds
- Custom animated cursor
- Smooth page transitions via **Framer Motion**

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **3D / Visuals** | Three.js, React Three Fiber, React Three Drei |
| **Animations** | Framer Motion, CSS Animations |
| **Maps** | Leaflet, React-Leaflet, OpenStreetMap |
| **Charts** | Recharts |
| **State** | Zustand |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI/LLM** | OpenRouter (GPT-3.5 Turbo, GPT-4o-mini) |
| **Voice Calls** | Vapi AI |
| **Messaging** | Green API (WhatsApp) |
| **Database** | SQLite (Anti-Stress), MongoDB (Validation) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/viratnigam18/hackerbyte-4.git
cd hackerbyte-4
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

### 3. Backend Setup

```bash
cd mental_model
pip install -r requirements.txt
python app.py
```

The API server will start at `http://localhost:8001`.

---

## 📁 Project Structure

```
hackerbyte-4/
├── frontend/                # React + Vite frontend
│   └── src/
│       └── components/      # 45+ UI components
│           ├── Dashboard.tsx
│           ├── MentalHealthChat.tsx
│           ├── MedicineRemediesPanel.tsx
│           ├── SOSButton.tsx
│           ├── AntiStressGame.tsx
│           ├── MapSection.tsx
│           ├── MedicationTracker.tsx
│           └── ...
├── mental_model/            # FastAPI backend
│   ├── app.py               # Main API server
│   ├── data/                # Training datasets
│   └── models/              # ML model artifacts
├── ANTI_STRESS/             # Anti-stress game engine
├── SP_CHECK/                # Symptom checker module
├── dataset-aidoctor-chatbot/# AI doctor chatbot dataset
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat` | AI mental health analysis & response |
| `POST` | `/suggest-medicine` | Symptom-based medicine suggestions |
| `POST` | `/parse-prescription` | Prescription image OCR |
| `POST` | `/sos` | Trigger emergency SOS (WhatsApp + Voice Call) |
| `GET`  | `/` | Health check |

---

## 👥 Team

Built with ❤️ at **HackByte 4.0** — IIITDM Jabalpur

---

## 📄 License

This project was built for a hackathon and is intended for demonstration purposes.
]]>
