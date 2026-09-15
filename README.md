# 命 Life Goes On

A quiet daily letter of motivational words — browse quotes by mood, or subscribe
to receive one in your inbox every morning. Bilingual (English/Spanish).

**Live at [dailyinochi.com](https://www.dailyinochi.com)**

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

---

## 🧵 Stack

- **Frontend** — React + Vite + TypeScript, Tailwind CSS, react-i18next, framer-motion
- **Backend** — Express + TypeScript, MongoDB (Mongoose), Zod validation
- **Auth** — short-lived JWT access token (in-memory) + opaque refresh token
  (httpOnly cookie, rotated on every use, with reuse detection)
- **Email** — [Resend](https://resend.com) (HTTPS API, not SMTP)
- **Scheduling** — the daily send is triggered externally by
  [cron-job.org](https://cron-job.org) hitting a secret-authenticated endpoint,
  not an in-process scheduler

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │   React Web      │
                    │   (Vercel)       │
                    └────────┬─────────┘
                             │ HTTPS
                             ▼
                    ┌──────────────────┐
                    │  Express API     │
                    │   (Railway)      │
                    └───┬──────────┬───┘
                        │          │
                        ▼          ▼
              ┌──────────────┐  ┌──────────────┐
              │ MongoDB Atlas│  │    Resend    │
              └──────────────┘  └──────────────┘
                        ▲
                        │ POST + X-Cron-Secret
                        │
              ┌──────────────────┐
              │   cron-job.org    │
              │ (daily, external) │
              └──────────────────┘
```

The daily email send isn't an in-process scheduler — it's triggered by an
external cron service hitting a secret-authenticated endpoint. This means a
Railway restart or redeploy can't silently cause a missed day, and the job is
idempotent (safe to trigger more than once for the same day).

## 🧱 Structure

This is an npm workspaces monorepo:

```
src/
├── apps/
│   ├── api/      Express backend
│   └── web/      React frontend
└── packages/
    └── shared/   Type-only package shared between api and web
                   (DTOs, API envelope types)
```

## ✨ Features

- 🔎 Browse quotes filtered by mood, in either language
- 📬 Daily motivational email subscription, with unsubscribe
- 🛠️ Admin panel: CRUD for quotes and moods, read-only subscriber list,
  daily delivery summary
- 🔐 Single-admin auth with a self-service "forgot password" flow

## 🔐 Security

- Short-lived JWT access token, kept in memory on the frontend — never in a
  cookie or localStorage
- Opaque refresh token in an httpOnly, secure (in production), SameSite
  cookie — rotated on every use
- Refresh-token reuse detection: presenting an already-rotated token revokes
  the entire token family, not just that one request
- Every request body validated with Zod
- `helmet` security headers, CORS restricted to the configured frontend
  origin, rate limiting on auth/subscribe/cron endpoints
- Passwords hashed with bcrypt; the cron trigger is authenticated with a
  timing-safe secret comparison, not a plain string check
- All secrets (JWT, cookie, DB, email, cron) come from environment
  variables — none are committed

```text
Login
  │
  ├── Access token  → returned in the response body, held in memory
  │
  └── Refresh token → httpOnly cookie
                          │
                          ▼
                    Rotated on every /refresh call
                          │
                          ▼
              Reuse of an old token → whole family revoked
```

## 🚀 Getting started

```bash
git clone <repo-url>
cd lifeGoesOnApp
npm install

# copy the env templates and fill in real values
cp src/apps/api/.env.example src/apps/api/.env
cp src/apps/web/.env.example src/apps/web/.env

npm run dev:all
```

API runs on `http://localhost:3001`, web on `http://localhost:5173`.

### Environment variables

See `src/apps/api/.env.example` for the full list with setup notes. Groups:

- **Database** — `MONGODB_URI`
- **Auth secrets** — `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`
  (random strings, 32+ chars)
- **Email** — `RESEND_API_KEY`, `FROM_EMAIL` (domain must be verified in Resend)
- **Admin bootstrap** — `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (generate the hash
  with `npm run hash-password -w life-goes-on-api -- "your-password"`)
- **Cron** — `CRON_SECRET`, used to authenticate the external daily-send trigger

The web app only needs `VITE_API_URL` (see `src/apps/web/.env.example`).

## 🛠️ Scripts

Run from the repo root unless noted.

| Command                                             | Does                           |
| --------------------------------------------------- | ------------------------------ |
| `npm run dev:all`                                   | API + web together             |
| `npm run dev:api` / `npm run dev`                   | API or web only                |
| `npm run build`                                     | Production build, both apps    |
| `npm run typecheck`                                 | Both apps                      |
| `npm run lint`                                      | Both apps                      |
| `npm run hash-password -w life-goes-on-api -- "pw"` | Generate `ADMIN_PASSWORD_HASH` |
| `npm run seed -w life-goes-on-api`                  | Seed the quote/mood catalog    |

## ☁️ Deployment

- **API** — Railway. Root directory `/` (needed for npm workspaces to resolve
  the shared package), build command `npm run build -w life-goes-on-api`,
  start command `npm run start -w life-goes-on-api`.
- **Web** — Vercel. Root directory `src/apps/web`.
- **Database** — MongoDB Atlas.
- **Email** — Resend, with a verified sending domain.
- **Daily send** — cron-job.org, `POST /api/v1/internal/jobs/send-daily-emails`
  with header `X-Cron-Secret`.
- **Health check** — `GET /health` returns process uptime, memory, and
  MongoDB connection state; Railway uses it to detect and restart a
  degraded instance.

## 🧑‍💻 Development notes

- The API and web app share types through `src/packages/shared` — it's
  type-only (no build step), so changes there are picked up immediately by
  both apps in dev.
- The daily email job (`src/apps/api/src/jobs/email.job.ts`) is intentionally
  triggered externally rather than scheduled in-process — see Architecture
  above for why.
- Quotes and moods are bilingual pairs linked by `pairId`; the catalog is
  closed (no new quotes are added going forward), so
  `src/apps/api/src/scripts/migrateBilingual.ts` is a one-time migration
  script, not something that runs again.
- Refresh tokens are hashed at rest (SHA-256) — the raw token only ever
  exists in the httpOnly cookie, never in the database.

## 👨‍💻 Author

**Randy Madrigal**
