# Medivora AI (MERN)
MongoDB Atlas + Express + React (Vite) + Node. Built by Dilip Yadav.

## Run locally
1. `cd backend && cp .env.example .env` (fill MONGO_URI, JWT_SECRET) then `npm install && npm run dev`
2. `cd frontend && cp .env.example .env && npm install && npm run dev` -> http://localhost:5173


### Deployment Guide
1. **MongoDB Atlas:** Create a free M0 cluster, add a database user, allow network access (`0.0.0.0/0`), and copy the connection string.

2. **Render (Backend):** Push the repository to GitHub and create a Web Service with root directory `backend`, build command `npm install`, and start command `npm start`. Configure `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `DOCTOR_EMAIL`, and `DOCTOR_PASSWORD`.

3. **Vercel (Frontend):** Import the repository, set root directory to `frontend`, select Vite, and configure `VITE_API_URL` with your Render backend URL. Deploy and update `CLIENT_URL` on Render with your Vercel URL.

**Note:** Render's free service may take 30–50 seconds to wake up after inactivity. Guest mode is read-only; login or signup is required to make changes.
