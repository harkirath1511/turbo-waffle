# Startup Icebreaker

A tool that helps you write highly personalized cold outreach emails in seconds — without spending 20–30 minutes researching and tailoring each one.

Create a profile once. Enter a company name and description. Pick your goal. Get a ready-to-send email instantly.

---

## Features

- **Profile creation** — fill in your background manually or upload a PDF/TXT resume and let AI extract your profile automatically
- **AI-powered email generation** — generates a subject line, opening paragraph, why the company interests you, why you're relevant, a conversation starter, and a complete ready-to-send email
- **Custom instructions** — optionally guide the AI for each generation (tone, length, specific talking points)
- **Saved drafts** — every generated email is saved and can be revisited or deleted anytime
- **Auth** — each user has their own profile and drafts, fully isolated via Supabase Auth

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, TypeScript, Express |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (JWT) |
| AI | Groq API — `llama-3.3-70b-versatile` |

---

## Project Structure

```
turbo-waffle/
├── backend/
│   ├── src/
│   │   ├── middleware/auth.ts        # JWT verification
│   │   ├── routes/                   # profiles, drafts, generate, resume
│   │   ├── services/                 # profileService, draftService, generateService, resumeService
│   │   ├── db.ts                     # pg Pool (Supabase connection string)
│   │   ├── types.ts                  # shared TypeScript types
│   │   └── index.ts                  # Express app entry
│   ├── supabase_schema.sql           # Run this in your Supabase SQL editor
└── frontend/
    ├── src/
    │   ├── components/               # Navbar, CopyButton, ProtectedRoute
    │   ├── lib/                      # api.ts, supabase.ts, AuthContext, types
    │   ├── pages/                    # AuthPage, ProfilePage, GeneratePage, DraftsPage
    │   └── App.tsx
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd turbo-waffle
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `backend/supabase_schema.sql`
3. Go to **Authentication → Providers → Email** and disable **Confirm email** (for local dev)

### 3. Configure environment variables

**Backend** — create `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3001
```

**Frontend** — create `frontend/.env`:
```env
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

> Get your Supabase keys from **Project Settings → API**.  
> Get your Groq API key from [console.groq.com](https://console.groq.com) (free).

### 4. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 5. Run

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3001`.  
The Vite dev server proxies all `/api/*` requests to the backend automatically.

---

## API Overview

All routes require a `Authorization: Bearer <token>` header (Supabase JWT).

| Method | Route | Description |
|---|---|---|
| `GET` | `/profiles/me` | Get the current user's profile |
| `POST` | `/profiles` | Create a profile |
| `PUT` | `/profiles/:id` | Update a profile |
| `DELETE` | `/profiles/:id` | Delete a profile |
| `POST` | `/resume/parse` | Upload a PDF/TXT resume, get back a parsed profile |
| `POST` | `/generate` | Generate outreach email content |
| `GET` | `/drafts` | List all saved drafts |
| `GET` | `/drafts/:id` | Get a single draft |
| `DELETE` | `/drafts/:id` | Delete a draft |

---

## Outreach Goals

Choose one when generating:

- Internship
- Job Opportunity
- Freelance Work
- Networking
- Collaboration
- Mentorship
