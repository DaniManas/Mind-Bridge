# MindBridge (ThriveLine)

MindBridge is a mental wellbeing and peer-support web app designed for people navigating stressful career transitions.
It combines a supportive AI companion, anonymous community spaces, practical coping tools, and private journaling in one experience.

## What This Project Is

MindBridge is a hackathon prototype focused on:
- Reducing emotional friction during high-stress periods (rejection, uncertainty, burnout)
- Creating a safe, anonymous support experience
- Giving users immediate, actionable regulation tools (not just static advice)
- Blending emotional support with practical structure and continuity

## Core Product Areas

1. Landing + Onboarding
- Calm, low-pressure intro experience
- Character-led welcome
- Lightweight onboarding for context (struggles, search duration, pressure factors, age band)

2. Sage AI (Chat)
- Supportive AI conversation interface
- Streaming responses (SSE)
- Crisis keyword interception and safety response routing
- Journal-aware context injection for personalized responses
- Conversation history per user/session

3. Community
- Peer room model (Burnout, Rejection, Anxiety, Small Wins)
- Anonymous posting and room-based chat
- Community pulse concept
- Professionals tab with direct external therapist link(s)
- Workshops tab with curated/fetched mental-health-relevant talks
- Crisis help access from community context

4. Wellbeing
- Daily mood check-ins
- Weekly insight + trend indicators
- Micro-wins tracking
- Progress tracker and recent state summaries
- Interactive tools:
  - Box Breathing
  - 5-4-3-2-1 Grounding
  - Rejection Reframe
  - Evidence Jar
  - Only 3 Things Today
- Crisis help CTA integrated in section

5. Journal
- Private entries (text + voice dictation)
- Mood-tagged entries
- Save/edit/delete entries
- Optional “use as Sage reference” behavior
- Context bridge to improve AI continuity

## Architecture Overview

- Frontend: Vite + React app plus a production-style single-file UI prototype
- Backend: FastAPI service with chat, check-ins, resources, and history APIs
- AI: Claude client integration for response generation and pulse/affirmation generation
- Retrieval: Chroma-based knowledge retrieval (RAG context)
- Persistence: SQLite for sessions/messages/check-ins; local browser storage for some UI state

## Repository Structure

```text
MindBridge/
├── CLAUDE.md
├── PROJECT_OVERVIEW_FOR_PPT.md
├── README.md
└── thriveline/
    ├── backend/
    │   ├── main.py                 # FastAPI entrypoint + routes
    │   ├── claude_client.py        # AI calls
    │   ├── chroma_client.py        # RAG retrieval
    │   ├── seed_chroma.py          # KB seeding utility
    │   ├── database.py             # SQLite helpers
    │   ├── history.py              # Session/context utilities
    │   ├── crisis.py               # Safety keyword checks
    │   ├── sentiment.py            # Sentiment classifier
    │   ├── models.py               # Pydantic models
    │   ├── followup.py             # Peer follow-up logic
    │   ├── requirements.txt
    │   ├── .env                    # local secrets/config
    │   ├── thriveline.db
    │   └── chroma_data/
    ├── frontend/
    │   ├── public/
    │   │   └── mindbridge_final_ui.html  # Main demo UI used in evaluations
    │   ├── src/                    # React app source (modular implementation)
    │   ├── package.json
    │   ├── vite.config.js
    │   └── index.html
    ├── start.sh
    └── Gaps.docx
```

## Which UI Is the Main Demo UI?

Primary demo file:
- `thriveline/frontend/public/mindbridge_final_ui.html`

This file contains the complete integrated hackathon UI flow (landing, Sage, community, wellbeing, journal).

## How To Run

### Option A: Run the Main Demo UI (recommended for demos)

1. Open terminal:
```bash
cd "/Users/manasdani/Documents/Claude Hackathon 2/MindBridge/thriveline/frontend/public"
python3 -m http.server 5173
```

2. Open in browser:
- `http://localhost:5173/mindbridge_final_ui.html`

### Option B: Run Backend API (for AI + persistence features)

1. Open terminal:
```bash
cd "/Users/manasdani/Documents/Claude Hackathon 2/MindBridge/thriveline/backend"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

2. API health check:
- `http://localhost:8000/health`

### Option C: Run React Frontend (dev app)

```bash
cd "/Users/manasdani/Documents/Claude Hackathon 2/MindBridge/thriveline/frontend"
npm install
npm run dev
```

If you get `vite: command not found`, run `npm install` in `frontend` first.

## Backend API Surface (Current)

- `GET /health`
- `POST /api/chat`
- `POST /api/chat/stream`
- `POST /api/checkin`
- `GET /api/history/{user_id}`
- `POST /api/peer-connect`
- `GET /api/followup/{user_id}`
- `GET /api/resources`
- `GET /api/resources/affirmation`

## Safety and Trust Principles

- Anonymous community interactions
- Crisis pattern detection and direct escalation messaging
- Clear disclaimer that Sage is AI, not a licensed therapist
- Low-arousal language style (avoids toxic positivity)

## Included Docs for Team Handoff

- `PROJECT_OVERVIEW_FOR_PPT.md` — slide-ready product summary and demo narrative
- `CLAUDE.md` — implementation notes and running updates
- `thriveline/Gaps.docx` — hackathon requirement reference document

## Current Status

This repository is a demo-ready prototype with integrated UX flows and working backend endpoints.
Some areas (provider integrations, workshop relevance ranking, moderation depth, analytics) are partially mocked or prototype-level and intended for production hardening in next iterations.

## License / Usage

Hackathon prototype for educational and demonstration purposes.
