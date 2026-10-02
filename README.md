# SkinWise AI

### AI Skin Analysis & Personalized Skincare Guidance

SkinWise AI is an AI-powered skincare intelligence platform that transforms a facial photo into structured skin-analysis insights and personalized cosmetic skincare guidance.

It combines **YouCam AI Skin Analysis** with **Groq-powered AI reasoning** to help users understand their skin-analysis results and explore a simple skincare routine.

---

## ✨ Features

- 📸 Facial photo upload
- 🤖 AI-powered skin analysis using YouCam
- 📊 Multiple skin characteristics and analysis scores
- ✨ AI-generated personalized skincare guidance
- 🧴 Recommended cosmetic product categories
- 🛍️ SkinWise Shop with product exploration
- 🌅 Morning skincare routine
- 🌙 Evening skincare routine
- 🔄 Analyze another photo
- 🔐 Privacy-focused image processing experience
- 📱 Responsive modern UI for desktop and mobile

---

## 🎯 Problem

Understanding skin-analysis results can be difficult for users.

Raw analysis data may contain multiple scores and skin characteristics without providing a simple way to understand what those results mean for a daily skincare routine.

SkinWise AI aims to bridge this gap by transforming structured skin-analysis data into clear, easy-to-understand cosmetic skincare guidance.

---

## 💡 Solution

SkinWise AI follows this workflow:

```text
User Photo
     ↓
YouCam AI Skin Analysis
     ↓
Structured Skin Results
     ↓
AI Reasoning
     ↓
Personalized Skincare Guidance
     ↓
Product Categories
     ↓
Morning & Evening Routine

🧠 How It Works
1. Upload Photo
The user uploads a clear facial photo through the SkinWise AI interface.
2. AI Skin Analysis
The image is processed through the YouCam AI Skin Analysis API.
The system retrieves structured analysis results covering multiple skin characteristics.
3. AI-Powered Insights
The structured results are sent to the AI reasoning layer.
Groq-powered AI converts the analysis data into concise and understandable cosmetic skincare guidance.
4. Personalized Routine
SkinWise AI presents:
Focus areas
Cosmetic product categories
Morning routine
Evening routine
General skincare guidance

🔬 Skin Analysis
SkinWise AI can display analysis information for characteristics such as:
Acne
Moisture
Oiliness
Pores
Texture
Redness
Wrinkles
Age spots
Radiance
Firmness
The application presents the values as YouCam analysis scores and does not independently interpret a higher or lower raw score as automatically meaning better or worse skin.

✨ AI Personalized Guidance
The AI layer generates structured guidance including:
AI Skin Profile
A concise overview of the available skin-analysis information.
Focus Areas
General skincare areas such as:
Daily cleansing
Hydration support
Moisture support
Daily sun protection
Product Categories
Examples include:
Gentle cleansers
Hydrating toners
Hydrating serums
Lightweight moisturizers
Broad-spectrum SPF 30+ sunscreens
Daily Routine
The platform can generate simple:
Morning routine
Evening routine

🛍️ SkinWise Shop
SkinWise AI includes a cosmetic product exploration section.
Users can:
View recommended product categories
Open a category
Explore available products
Visit the product's external product page
Product availability, pricing and formulations may change, so users should review the external product page before purchasing.

                    ┌──────────────────┐
                    │    User Photo    │
                    └────────┬─────────┘
                             ↓
                  ┌──────────────────────┐
                  │  FastAPI Backend     │
                  └──────────┬───────────┘
                             ↓
                  ┌──────────────────────┐
                  │ YouCam Skin Analysis │
                  └──────────┬───────────┘
                             ↓
                  ┌──────────────────────┐
                  │ Structured Results   │
                  └──────────┬───────────┘
                             ↓
                  ┌──────────────────────┐
                  │ Groq AI Reasoning    │
                  └──────────┬───────────┘
                             ↓
              ┌──────────────────────────────┐
              │ Personalized Guidance        │
              │ • Focus Areas                │
              │ • Product Categories         │
              │ • Morning Routine            │
              │ • Evening Routine             │
              └──────────────┬───────────────┘
                             ↓
                  ┌──────────────────────┐
                  │ SkinWise Frontend    │
                  └──────────────────────┘

🛠️ Tech Stack
Frontend
React
Vite
JavaScript
Lucide React
CSS
Backend
Python
FastAPI
HTTPX
Uvicorn
AI & APIs
YouCam AI Skin Analysis API
Groq API
openai/gpt-oss-20b
Deployment
Vercel — Frontend
Render — Backend

🔐 Privacy & Safety
SkinWise AI is designed around a privacy-focused image-processing experience.
The application provides cosmetic and skincare guidance and does not provide medical diagnosis or medical treatment recommendations.
Users should stop using a cosmetic product if irritation occurs and consult a qualified dermatologist for persistent or concerning skin issues.

🚀 Live Demo
Frontend
https://skin-wise-ai-frontend.vercel.app/⁠�
Backend
https://skinwise-ai-backend-0aou.onrender.com⁠�

SkinWise-AI-Frontend/
│
├── public/
│   └── hero-skin.jpg
│
├── src/
│   ├── data/
│   │   └── productCatalog.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── package.json
├── vite.config.js
└── README.md

SkinWise-AI-Backend/
│
├── main.py
├── requirements.txt
└── ...


Local Frontend Setup
Clone the repository:
git clone https://github.com/santoshml-lab/SkinWise-AI-Frontend.git

Install dependencies:
npm install

Create a .env file:
VITE_API_URL=YOUR_BACKEND_URL

Start the development server:
npm run dev

⚙️ Local Backend Setup
Install dependencies:
pip install -r requirements.txt

Configure the required environment variables:
YOUCAM_API_KEY=your_youcam_api_key
YOUCAM_API_URL=https://yce-api-01.makeupar.com/s2s/v2.1/task/skin-analysis
GROQ_API_KEY=your_groq_api_key

Start the API:
uvicorn main:app --reload

📌 Important Notes
A clear facial photo is recommended for analysis.
YouCam analysis results are presented as provided by the analysis service.
AI-generated guidance is intended for cosmetic skincare use.
Product availability and pricing can change.
SkinWise AI is not a medical diagnostic system.

🏆 Hackathon Project
SkinWise AI was developed as an AI-powered skincare experience combining computer vision, structured AI analysis, personalized guidance and cosmetic product exploration.
The project demonstrates how AI analysis can be transformed into a more understandable and actionable user experience.

👨‍💻 Built With
Built with React, FastAPI, YouCam AI Skin Analysis and Groq-powered AI.
SkinWise AI — Your skin. Understood.

