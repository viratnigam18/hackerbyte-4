# 🩺 LifeLine AI — Intelligent Health & Wellness Platform

> **Your AI-powered personal health companion — from mental wellness to emergency response.**

[![Demo Video](https://img.shields.io/badge/▶_Watch_Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/i_ZBd-ZyeRM)

---

## 📽️ Demo Video

🎬 **Watch the full walkthrough:**  
👉 https://youtu.be/i_ZBd-ZyeRM

---

## 🌟 Overview

**LifeLine AI** is a full-stack, AI-powered healthcare platform built during **HackByte 4.0 (IIITDM Jabalpur)**.

It integrates:
- 🧠 Mental health intelligence  
- 💊 Smart medical assistance  
- 🚨 Emergency response system  
- 🎮 Stress-relief experiences  

All inside a **single, modern dashboard** designed for real-time usability.

---

## ✨ Key Features

### 🧠 AI Mental Health Assistant
- Real-time mental health analysis using **OpenRouter (GPT-3.5 Turbo)**
- Detects:
  - Anxiety  
  - Depression  
  - Stress  
  - Bipolar Disorder  
  - Suicidal Ideation  
  - Personality Disorders  
- Generates **empathetic, clinician-style responses**
- Provides actionable self-care suggestions
- Severity scoring with visual indicators (Low → Critical)

---

### 💊 Smart Medicine & Remedy Suggestions
- AI-based **symptom-to-medicine mapping**
- Suggests **OTC medicines** with usage guidance
- Includes **home remedies** for common conditions
- Offline fallback using keyword-based logic

---

### 📋 Prescription Scanner (OCR)
- Upload prescription images
- Extract medicines using **GPT-4o-mini Vision**
- Automatically generate:
  - Dosage schedules  
  - Reminder timings  

---

### 🚨 Emergency SOS System
One-tap emergency trigger that activates:

- 📱 WhatsApp alert via **Green API**
  - Patient details  
  - Symptoms  
  - Live GPS location  

- 📍 Real-time map location sharing  
- 📞 Automated voice call using **Vapi AI**

---

### 🏥 Nearby Hospitals Map
- Built using **Leaflet + OpenStreetMap**
- Smart radius expansion to always find nearby hospitals
- Real-time GPS-based tracking

---

### 🎮 Anti-Stress Module
Interactive mini-games for mental relaxation:

- 🌬️ Breathing Exercise (4-7-8 technique)
- 🫧 Bubble Pop
- 🌀 Zen Trace
- 🌌 Drift Space (ambient relaxation)

---

### 📊 Health Dashboard
- Smartwatch connectivity status
- AI-based health score prediction
- Medication tracking & reminders
- Interactive analytics using **Recharts**

---

### 🎨 UI/UX Highlights
- 3D DNA animation (**Three.js**)
- Glassmorphism design system
- Particle-based background effects
- Custom animated cursor
- Smooth transitions via **Framer Motion**

---

## 🛠️ Tech Stack

| Layer | Technologies |
|------|------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **3D / Visuals** | Three.js, React Three Fiber, Drei |
| **Animations** | Framer Motion |
| **Maps** | Leaflet, React-Leaflet, OpenStreetMap |
| **Charts** | Recharts |
| **State Management** | Zustand |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI/LLM** | OpenRouter (GPT-3.5 Turbo, GPT-4o-mini) |
| **Voice AI** | Vapi AI |
| **Messaging** | Green API (WhatsApp) |
| **Database** | SQLite, MongoDB |

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js ≥ 18  
- Python ≥ 3.10  
- npm / yarn  

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/viratnigam18/hackerbyte-4.git
cd hackerbyte-4
```

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🌐 Runs on: http://localhost:5173

3️⃣ Backend Setup
cd mental_model
pip install -r requirements.txt
python app.py

⚙️ Runs on: http://localhost:8001
---
⚠️ Disclaimer

This project is built for hackathon/demo purposes only and is not a substitute for professional medical advice.

👥 Team

Built with Swayam,virat,Ankit,Aditya at HackByte 4.0 — IIITDM Jabalpur

📄 License

For educational and demonstration purposes only.
