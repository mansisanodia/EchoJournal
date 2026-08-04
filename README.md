# 🎙️ EchoJournal — AI Voice-First Journaling & Mood Analytics

> *Speak your mind. Understand your emotions. Own your data.*

**EchoJournal** is a full-stack, privacy-first, AI-powered voice journaling application for your mental health. Record voice notes instead of typing, get instant Gemini AI emotion analysis, and visualize mood patterns with interactive analytics — all behind AES-256 military-grade encryption.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎤 **Voice Recording** | Browser MediaRecorder API + Web Speech API live transcription |
| 🤖 **Whisper Transcription** | OpenAI Whisper API (with Web Speech fallback) |
| 🧠 **Gemini AI Analysis** | Emotion, stress score, positivity, topics, keywords, summary, wellness advice |
| 🔒 **AES-256-CBC Encryption** | All journal text encrypted before DB storage; decrypted only in session |
| 📊 **Interactive Dashboard** | Recharts: Line, Pie, Area, Bar charts + trend insights |
| 📈 **Trend Algorithm** | Month-over-month topic percentage changes `((curr - prev) / prev × 100)` |
| 🤖 **AI Mood Prediction** | 7-day moving average stress & positivity prediction with confidence score |
| 🗓️ **Heatmap Calendar** | GitHub-style 30-day mood & activity grid |
| 🔍 **Smart Search** | Natural language NLP search powered by Gemini AI |
| 💬 **AI Chat Reflection** | Private EchoAI companion trained on your own journal history |
| 📤 **Data Export** | Download decrypted journals as Markdown or JSON |
| ⏰ **Cron Jobs** | Daily streaks, weekly trend aggregation, monthly wellness summaries |

---

## 🏗️ Architecture

```
React 18 + Vite + Tailwind CSS (client/)
         │
         │ REST API + JWT Bearer Token
         ▼
Express + Node.js (server/)
         │
  ┌──────┼──────┬─────────────┐
  ▼      ▼      ▼             ▼
Whisper Gemini AES-256   MongoDB Atlas
 API     AI    Encryption  / Local JSON
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- `npm` (included with Node)

### 1. Clone / Open project

```bash
cd C:\Users\HP\.gemini\antigravity\scratch\echojournal
```

### 2. Configure Environment Variables

Edit `server/.env` and add your API keys:

```env
# Required for Gemini AI emotion analysis
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: OpenAI Whisper for server-side audio transcription
OPENAI_API_KEY=your_openai_key_here

# Optional: MongoDB Atlas for cloud storage
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/echojournal
```

> **Note:** Without API keys, EchoJournal uses a built-in rule-based sentiment fallback and persists data to a local JSON file at `server/data/local_db.json`.

### 3. Install Dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 4. Start the Servers

```bash
# Terminal 1 — Backend API (port 5000)
cd server
npm start

# Terminal 2 — React Frontend (port 3000)
cd client
npm run dev
```

### 5. Open in Browser

Navigate to **http://localhost:3000**

---

## 📁 Project Structure

```
echojournal/
├── client/                    # React 18 + Vite frontend
│   ├── src/
│   │   ├── components/        # Navbar, Sidebar, Recorder, Charts, Cards
│   │   ├── context/           # AuthContext (JWT state)
│   │   ├── pages/             # Landing, Login, Signup, Dashboard,
│   │   │                      #   RecordJournal, JournalHistory,
│   │   │                      #   MoodAnalytics, SmartSearch,
│   │   │                      #   AIChatReflection, ProfileSettings
│   │   ├── services/          # Axios API client (auto JWT injection)
│   │   ├── App.jsx            # Route definitions
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                    # Node.js + Express backend
    ├── config/db.js           # MongoDB + local JSON fallback
    ├── controllers/           # authController, journalController,
    │                          #   aiController, dashboardController
    ├── cron/scheduledJobs.js  # node-cron daily/weekly/monthly tasks
    ├── middleware/auth.js     # JWT authentication guard
    ├── models/                # User, Journal, Analysis, Notification
    ├── routes/                # Auth, Journal, AI, Dashboard routes
    ├── services/
    │   ├── geminiService.js   # Gemini AI analysis, smart search, chat
    │   ├── trendService.js    # MoM% algorithms & mood predictions
    │   └── whisperService.js  # OpenAI Whisper transcription
    ├── utils/encryption.js    # AES-256-CBC encrypt/decrypt
    ├── data/local_db.json     # Auto-generated local persistent store
    └── server.js              # Express app entry point
```

---

## 🔐 Security

| Layer | Implementation |
|---|---|
| Password Hashing | `bcryptjs` (salt rounds: 10) |
| Authentication | JWT Bearer tokens (7-day expiry) |
| Journal Encryption | AES-256-CBC with random IV per entry |
| Transport | CORS, Helmet CSP headers |
| Rate Limiting | 200 req / 15 min per IP |
| Input Validation | express body parsing limits |

---

## 🧪 API Endpoints

```
GET  /api/health                    — Server health check

POST /api/auth/signup               — Create account
POST /api/auth/login                — Sign in (JWT issued)
GET  /api/auth/profile              — Get user profile (protected)
PUT  /api/auth/preferences          — Update preferences (protected)

POST /api/journal                   — Create encrypted journal entry
GET  /api/journal                   — List decrypted journals (filterable)
GET  /api/journal/:id               — Get single decrypted journal
DELETE /api/journal/:id             — Delete journal
POST /api/journal/voice             — Upload audio for Whisper transcription

POST /api/ai/analyze                — Analyze text with Gemini
POST /api/ai/smart-search           — NLP natural language journal search
POST /api/ai/chat-reflection        — AI chat companion (journal context)

GET  /api/dashboard                 — Full analytics + mood trends
```

---

## 🗂️ Tech Stack

**Frontend:** React 18, Vite, React Router DOM, Tailwind CSS, Recharts, Framer Motion, Lucide React, Axios

**Backend:** Node.js, Express, Mongoose, bcryptjs, jsonwebtoken, helmet, express-rate-limit, multer, node-cron, dotenv

**AI/ML:** Google Gemini AI (`@google/genai`), OpenAI Whisper API, Web Speech API

**Database:** MongoDB Atlas (with local JSON persistent store fallback)

---

## 🎯 Why EchoJournal Stands Out

1. **Full-stack depth** — MERN architecture, REST APIs, JWT, deployment
2. **AI integration** — Whisper STT, Gemini LLM, structured JSON prompting
3. **Security** — AES-256 encryption, bcrypt, rate limiting, CSP headers
4. **Data engineering** — Time-series aggregation, trend detection, analytics
5. **System design** — Service separation, cron scheduling, scalable patterns
6. **Product thinking** — Solves real friction: voice-first, private journaling
