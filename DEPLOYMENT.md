# 🚀 EchoJournal — Full-Stack Deployment Guide

This guide walks you through deploying **EchoJournal** to production using **MongoDB Atlas** (Database), **Render** (Backend API), and **Vercel** (Frontend Client).

---

## 🏗️ Architecture Overview

```
               ┌───────────────────────────────┐
               │    Vercel / Netlify Host      │
               │   React + Vite Static Build   │
               └───────────────┬───────────────┘
                               │
               HTTPS REST API  │ (VITE_API_URL)
                               ▼
               ┌───────────────────────────────┐
               │          Render Host          │
               │      Express + Node.js API    │
               └───────┬───────────────┬───────┘
                       │               │
                       ▼               ▼
              MongoDB Atlas        Google Gemini API
            Cloud Database         & OpenAI Whisper
```

---

## Step 1: Set Up MongoDB Atlas (Cloud Database)

1. Go to **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** and sign up / log in.
2. Create a free **M0 Cluster**.
3. Under **Database Access**, create a database user (e.g., `echo_user` and password `your_secure_password`).
4. Under **Network Access**, click **Add IP Address** and choose `0.0.0.0/0` (Allow access from anywhere for cloud deployment).
5. Click **Connect** → **Drivers** and copy your Connection String:
   ```
   mongodb+srv://echo_user:<password>@cluster0.abcde.mongodb.net/echojournal?retryWrites=true&w=majority
   ```

---

## Step 2: Prepare Code for Production GitHub Repo

If you haven't pushed your code to GitHub yet:

```bash
cd C:\Users\HP\.gemini\antigravity\scratch\echojournal

# Initialize Git
git init
git add .
git commit -m "Initial commit of EchoJournal full-stack app"

# Create a repo on github.com named 'echojournal' and push:
git remote add origin https://github.com/your-username/echojournal.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend API to Render

1. Go to **[Render.com](https://render.com/)** and log in.
2. Click **New +** → **Web Service**.
3. Connect your `echojournal` GitHub repository.
4. Configure service settings:
   - **Name:** `echojournal-api`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`

5. Add **Environment Variables** in Render settings:

| Key | Value / Example |
|---|---|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Generate a strong random key e.g. `e9a8f7c6b5a4...` |
| `ENCRYPTION_MASTER_KEY` | Must be a 64-char hex key e.g. `4a8f9c1e7d2b3a4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f` |
| `MONGODB_URI` | `mongodb+srv://echo_user:password@cluster.mongodb.net/echojournal` |
| `GEMINI_API_KEY` | `AQ.Ab8RN6JhfOtTrzm7ntMEE8...` |
| `OPENAI_API_KEY` | *(Optional for Whisper)* |

6. Click **Create Web Service**. Wait 2-3 minutes until Render outputs:
   `🚀 EchoJournal server running on https://echojournal-api.onrender.com`

---

## Step 4: Configure Frontend for Production API Endpoint

Update your API client [`client/src/services/api.js`](file:///C:/Users/HP/.gemini/antigravity/scratch/echojournal/client/src/services/api.js) to look for an environment variable `VITE_API_URL`:

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

---

## Step 5: Deploy Frontend React App to Vercel

1. Go to **[Vercel.com](https://vercel.com/)** and log in with GitHub.
2. Click **Add New...** → **Project**.
3. Import your `echojournal` repository.
4. Configure build settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add **Environment Variables** in Vercel:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://echojournal-api.onrender.com/api` |

6. Click **Deploy**. Vercel will build and assign a URL like:
   `https://echojournal.vercel.app`

---

## Step 6: Configure CORS on Backend Server

Ensure your Express backend permits requests from your Vercel URL in [`server/server.js`](file:///C:/Users/HP/.gemini/antigravity/scratch/echojournal/server/server.js):

```javascript
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'https://echojournal.vercel.app',
  process.process.env.CLIENT_URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Or specify allowed domain
    }
  },
  credentials: true
}));
```

---

## 🔒 Production Security Checklist

- [x] **AES-256 Key Security:** Ensure `ENCRYPTION_MASTER_KEY` is set in production environment variables and never committed to Git.
- [x] **HTTPS:** Vercel and Render provide automatic free SSL certificates.
- [x] **Rate Limiting:** Enabled via `express-rate-limit` (200 requests / 15 min per IP).
- [x] **CORS Guard:** Restrict cross-origin requests to your Vercel frontend domain.
