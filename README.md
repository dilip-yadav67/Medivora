# Medivora AI (MERN)
MongoDB Atlas + Express + React (Vite) + Node. Built by Dilip Yadav.

## Run locally
1. `cd backend && cp .env.example .env` (fill MONGO_URI, JWT_SECRET) then `npm install && npm run dev`
2. `cd frontend && cp .env.example .env && npm install && npm run dev` -> http://localhost:5173

## Deploy (free)
**1. MongoDB Atlas**: create a free M0 cluster, add a database user, Network Access -> allow 0.0.0.0/0, copy the connection string.
**2. Render (backend)**: push this repo to GitHub -> New Web Service (or Blueprint with render.yaml). Root directory `backend`, build `npm install`, start `npm start`. Env vars: MONGO_URI, JWT_SECRET, CLIENT_URL (your Vercel URL), DOCTOR_EMAIL, DOCTOR_PASSWORD.
**3. Vercel (frontend)**: Import repo, root directory `frontend`, framework Vite. Env var `VITE_API_URL` = your Render URL (no trailing slash). Deploy, then put the Vercel URL into CLIENT_URL on Render.

Note: Render free sleeps after inactivity, so the first request can take ~30-50 seconds.
Guest mode ("Enter without email") is read-only; changes prompt Login / Sign up.
