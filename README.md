# MindBridge

A calm mental-health companion for people navigating stressful job search phases.

MindBridge combines:
- `Sage AI` for supportive conversation
- `Anonymous Community` for peer solidarity
- `Wellbeing Tools` for immediate regulation
- `Private Journal` for personal reflection and context-aware support

## Demo Focus

The main hackathon UI lives in:
- `thriveline/frontend/public/mindbridge_final_ui.html`

This is the integrated experience used for demos.

## Key Features

### 1) Landing + Onboarding
- Low-pressure entry experience
- Character-led greeting
- Lightweight context capture (struggle type, duration, pressure factors)

### 2) Sage AI Chat
- Streaming AI responses (SSE)
- Journal-aware personalization
- Crisis keyword detection + direct safety response
- Voice input support

### 3) Community
- Peer rooms (burnout, rejection, anxiety, small wins)
- Anonymous posting
- Professionals section with direct therapist link
- Workshops section with mental-health-relevant content

### 4) Wellbeing
- Daily check-ins and trend visualization
- Micro-wins tracking
- Interactive tools:
  - Box Breathing
  - 5-4-3-2-1 Grounding
  - Rejection Reframe
  - Evidence Jar
  - Only 3 Things Today
- Crisis help button

### 5) Journal
- Text + voice journaling
- Mood tagging
- Past entry history
- Optional “use as Sage reference” context bridge

## Tech Stack

- Frontend: `HTML/CSS/JS` demo UI + `React (Vite)` app structure
- Backend: `FastAPI`
- AI: `Anthropic Claude` integration
- Retrieval: `ChromaDB` (RAG context)
- Data: `SQLite` + browser local storage

## Project Structure (Only Active Project Files)

```text
MindBridge/
└── thriveline/
    ├── frontend/
    │   ├── public/
    │   │   └── mindbridge_final_ui.html   # Main demo UI
    │   ├── src/                            # React implementation modules
    │   ├── package.json
    │   └── vite.config.js
    ├── backend/
    │   ├── main.py                         # FastAPI routes
    │   ├── claude_client.py                # AI response generation
    │   ├── chroma_client.py                # RAG retrieval
    │   ├── database.py                     # SQLite operations
    │   ├── history.py                      # session + context handling
    │   ├── crisis.py                       # safety checks
    │   ├── sentiment.py                    # sentiment routing
    │   ├── followup.py                     # follow-up logic
    │   ├── models.py                       # request/response schemas
    │   ├── seed_chroma.py                  # knowledge seeding utility
    │   └── requirements.txt
    └── start.sh
```

## Quick Start

### Run the main UI demo

```bash
cd "/Users/manasdani/Documents/Claude Hackathon 2/MindBridge/thriveline/frontend/public"
python3 -m http.server 5173
```

Open:
- `http://localhost:5173/mindbridge_final_ui.html`

### Run backend API

```bash
cd "/Users/manasdani/Documents/Claude Hackathon 2/MindBridge/thriveline/backend"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Health check:
- `http://localhost:8000/health`

### Run React frontend (optional dev mode)

```bash
cd "/Users/manasdani/Documents/Claude Hackathon 2/MindBridge/thriveline/frontend"
npm install
npm run dev
```

## API Endpoints

- `GET /health`
- `POST /api/chat`
- `POST /api/chat/stream`
- `POST /api/checkin`
- `GET /api/history/{user_id}`
- `POST /api/peer-connect`
- `GET /api/followup/{user_id}`
- `GET /api/resources`
- `GET /api/resources/affirmation`

## Safety Note

MindBridge is supportive AI + peer support, not a replacement for licensed clinical care.
If crisis/self-harm language is detected, the app routes to immediate safety messaging and helpline guidance.
