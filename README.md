# Warnwave_22IT087

## 🚨 Warnwave: AI-Powered Hand Gesture Recognition for Civilian Safety

Warnwave is an AI-driven real-time gesture recognition system designed to enable silent, universal, and reliable communication during emergencies — such as wars, natural disasters, or chaotic environments — where traditional communication fails.

## Problem Statement

In crisis situations, noise, panic, and language barriers often make verbal communication impossible. Sirens can be drowned out, and not everyone understands the same language.

But gestures?
They're universal, fast, and silent — making them the perfect medium for emergency signaling.

## Solution — Warnwave

Warnwave bridges this gap using AI.
It transforms hand gestures into instant safety alerts that can be transmitted to authorities or displayed in real-time dashboards.

# Model Development
Model Experiments
Model	Accuracy	Remarks
SVM	~25%	Too low for real-world use
ResNet	~50%	Improved, but inconsistent
MobileNet	~70%+	Lightweight, fast, and deployable

⚡ MobileNet was chosen for its efficiency on edge devices.
However, lighting and background variability remain challenges — which Warnwave continues to optimize.

## Performance Highlights

✅ 85.12% accuracy on real-time gesture recognition

✅ Works reliably across lighting and backgrounds

✅ Perfect accuracy for high-priority gestures (e.g., Danger, Stop)

✅ Optimized for web and edge deployment

## Tech Stack
Frontend

React.js

Framer Motion (UI animations)

Tailwind CSS

Backend

Node.js + Express

MongoDB (Alert logging & user data)

Python (TensorFlow model inference)

AI / CV

Mediapipe (Hand tracking)

TensorFlow (CNN model – MobileNet backbone)

## Future Enhancements

👥 Multi-person detection — recognize gestures in crowds

🌐 Cultural adaptation — expand gesture vocabulary globally

🧩 Multimodal fusion — combine gestures with facial & voice recognition

📡 Edge optimization — run smoothly in low-network environments

🧭 Admin dashboards — enable authorities to monitor and coordinate responses

# Installation & Setup

## Clone the repository
git clone https://github.com/<your-username>/warnwave.git
cd warnwave

## Install backend dependencies
cd server
npm install

## Run backend server
npm start

## Install frontend dependencies
cd ../client
npm install

## Run frontend
npm run dev