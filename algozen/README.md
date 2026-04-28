# ⚔️ AlgoZen — Learn DSA Like a Game

> The addictive DSA learning platform for Indian college students.
> Duolingo meets LeetCode meets Pokémon.

## 🛠️ Tech Stack
- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express + MongoDB
- **Auth:** Clerk
- **Code Execution:** Judge0 (self-hosted)
- **AI Mentor:** Groq (Llama 3.3 70B)
- **Realtime:** Socket.io

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Clerk account
- Groq API key

### Setup
```bash
# Clone
git clone https://github.com/yourusername/algozen.git
cd algozen

# Backend
cd server
cp .env.example .env
# Fill .env values
npm install
npm run dev

# Frontend (new terminal)
cd client
cp .env.example .env
# Fill .env values
npm install
npm run dev
```

## ▲ Deploy on Vercel

This repo is a monorepo (`client` + `server`). For a single Vercel project, deploy from the `algozen/` directory.

### Vercel Project Settings
- **Root Directory:** `algozen`
- **Framework Preset:** Vite
- **Build Command:** `cd client && npm ci && npm run build`
- **Output Directory:** `client/dist`

### API (server) on Vercel
- API is exposed under `https://<your-domain>/api/*` via `algozen/api/index.js`.
- Set the required environment variables in Vercel (below).

### Required Environment Variables
- `MONGODB_URI`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `JUDGE0_URL`
- `JUDGE0_AUTH_TOKEN`
- `ADMIN_SECRET`

### Optional Environment Variables
- `GROQ_API_KEY` (AI hints/reviews; if missing, AI endpoints return a friendly message)
- `CLIENT_URL` (CORS allow-list; if missing, CORS is permissive)

## 📋 Phases
- [x] Phase 0: Foundation
- [ ] Phase 1: Landing Page
- [ ] Phase 2: DB + Judge0
- [ ] Phase 3: Problem Engine
- [ ] Phase 4: Gamification
- [ ] Phase 5: Battle Mode
- [ ] Phase 6: Classroom
- [ ] Phase 7: AI Mentor
- [ ] Phase 8: Polish & Launch
