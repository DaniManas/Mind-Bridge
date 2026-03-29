import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from database import (
    init_db, save_message, save_checkin, get_recent_checkins,
    save_peer_connection, get_user_sessions,
)
from models import (
    ChatRequest, ChatResponse,
    CheckinRequest, CheckinResponse,
    PeerConnectRequest, FollowupResponse, ResourceResponse,
)
from crisis import check_crisis_keywords, CRISIS_RESPONSE
from sentiment import classify_sentiment
from chroma_client import query_knowledge_base
from claude_client import chat_with_sage, generate_community_pulse, generate_affirmation
from history import get_or_create_session, get_conversation_history, get_recent_user_context
from followup import check_peer_followup

app = FastAPI(title="ThriveLine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    init_db()


@app.get("/health")
async def health():
    return {"status": "ok"}


# ─────────────────────────────────────────────────────────
# Non-streaming chat (for simple clients / testing)
# ─────────────────────────────────────────────────────────
@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    # Layer 3: keyword check — synchronous, before any AI call
    if check_crisis_keywords(req.message):
        save_message(req.session_id, "user", req.message, "CRISIS")
        save_message(req.session_id, "assistant", CRISIS_RESPONSE, "CRISIS")
        return ChatResponse(
            response=CRISIS_RESPONSE,
            sentiment="CRISIS",
            is_crisis=True,
            session_id=req.session_id,
        )

    # Layer 1: sentiment classification
    sentiment = classify_sentiment(req.message)
    if sentiment == "CRISIS":
        save_message(req.session_id, "user", req.message, "CRISIS")
        save_message(req.session_id, "assistant", CRISIS_RESPONSE, "CRISIS")
        return ChatResponse(
            response=CRISIS_RESPONSE,
            sentiment="CRISIS",
            is_crisis=True,
            session_id=req.session_id,
        )

    # RAG context
    rag_context = query_knowledge_base(req.message)

    # Session + history
    get_or_create_session(req.session_id, req.user_id, req.mood)
    history = get_conversation_history(req.session_id)
    user_context = get_recent_user_context(req.user_id)

    # Merge journal context from frontend
    if req.user_context:
        user_context = (user_context + "\n\n" if user_context else "") + req.user_context

    # Peer follow-up injection
    followup_msg = check_peer_followup(req.user_id)
    if followup_msg and not history:
        user_context = (user_context + "\n\n" if user_context else "") + f"PEER FOLLOW-UP TO ASK: {followup_msg}"

    # Save user message
    save_message(req.session_id, "user", req.message, sentiment)

    # Build messages for Claude
    messages = history + [{"role": "user", "content": req.message}]

    # Collect streamed response
    full_response = ""
    for chunk in chat_with_sage(messages, rag_context, req.mood, user_context):
        full_response += chunk

    save_message(req.session_id, "assistant", full_response, None)

    return ChatResponse(
        response=full_response,
        sentiment=sentiment,
        is_crisis=False,
        session_id=req.session_id,
    )


# ─────────────────────────────────────────────────────────
# Streaming chat via SSE
# ─────────────────────────────────────────────────────────
@app.post("/api/chat/stream")
async def chat_stream(req: ChatRequest):
    # Layer 3: keyword check
    if check_crisis_keywords(req.message):
        save_message(req.session_id, "user", req.message, "CRISIS")
        save_message(req.session_id, "assistant", CRISIS_RESPONSE, "CRISIS")

        async def crisis_stream():
            payload = json.dumps({"text": CRISIS_RESPONSE, "is_crisis": True, "sentiment": "CRISIS"})
            yield f"data: {payload}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(crisis_stream(), media_type="text/event-stream")

    # Layer 1: sentiment classification
    sentiment = classify_sentiment(req.message)
    if sentiment == "CRISIS":
        save_message(req.session_id, "user", req.message, "CRISIS")
        save_message(req.session_id, "assistant", CRISIS_RESPONSE, "CRISIS")

        async def crisis_stream_2():
            payload = json.dumps({"text": CRISIS_RESPONSE, "is_crisis": True, "sentiment": "CRISIS"})
            yield f"data: {payload}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(crisis_stream_2(), media_type="text/event-stream")

    rag_context = query_knowledge_base(req.message)
    get_or_create_session(req.session_id, req.user_id, req.mood)
    history = get_conversation_history(req.session_id)
    user_context = get_recent_user_context(req.user_id)

    # Merge journal context from frontend
    if req.user_context:
        user_context = (user_context + "\n\n" if user_context else "") + req.user_context

    followup_msg = check_peer_followup(req.user_id)
    if followup_msg and not history:
        user_context = (user_context + "\n\n" if user_context else "") + f"PEER FOLLOW-UP TO ASK: {followup_msg}"

    save_message(req.session_id, "user", req.message, sentiment)
    messages = history + [{"role": "user", "content": req.message}]

    async def generate():
        full_response = ""
        queue = asyncio.Queue()
        loop = asyncio.get_running_loop()  # correct in Python 3.10+

        def producer():
            try:
                for chunk in chat_with_sage(messages, rag_context, req.mood, user_context):
                    asyncio.run_coroutine_threadsafe(queue.put(("chunk", chunk)), loop)
            except Exception as e:
                asyncio.run_coroutine_threadsafe(queue.put(("error", str(e))), loop)
            finally:
                asyncio.run_coroutine_threadsafe(queue.put(("done", None)), loop)

        loop.run_in_executor(None, producer)

        try:
            while True:
                kind, value = await queue.get()
                if kind == "done":
                    break
                if kind == "error":
                    yield f"data: {json.dumps({'error': value})}\n\n"
                    break
                full_response += value
                payload = json.dumps({"text": value, "is_crisis": False, "sentiment": sentiment})
                yield f"data: {payload}\n\n"

            save_message(req.session_id, "assistant", full_response, None)
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


# ─────────────────────────────────────────────────────────
# Check-in + community pulse
# ─────────────────────────────────────────────────────────
@app.post("/api/checkin", response_model=CheckinResponse)
async def checkin(req: CheckinRequest):
    save_checkin(req.user_id, req.mood_chips, req.free_text)
    recent = get_recent_checkins(limit=20)

    checkins_text = "\n".join([
        f"- Mood: {', '.join(c['mood_chips'])}. {c['free_text'] or ''}"
        for c in recent
    ])

    pulse = generate_community_pulse(checkins_text or "Several members checked in this week feeling a mix of exhaustion and quiet determination.")
    return CheckinResponse(pulse_text=pulse, message="Check-in saved")


# ─────────────────────────────────────────────────────────
# History
# ─────────────────────────────────────────────────────────
@app.get("/api/history/{user_id}")
async def get_history(user_id: str):
    from database import get_session_messages
    sessions = get_user_sessions(user_id, limit=20)
    for s in sessions:
        s["messages"] = get_session_messages(s["id"])
    return {"sessions": sessions}


# ─────────────────────────────────────────────────────────
# Peer connection
# ─────────────────────────────────────────────────────────
@app.post("/api/peer-connect")
async def peer_connect(req: PeerConnectRequest):
    save_peer_connection(req.user_id)
    return {"message": "Connection logged"}


@app.get("/api/followup/{user_id}", response_model=FollowupResponse)
async def get_followup(user_id: str):
    msg = check_peer_followup(user_id)
    return FollowupResponse(has_followup=bool(msg), message=msg)


# ─────────────────────────────────────────────────────────
# Resources
# ─────────────────────────────────────────────────────────
STATIC_RESOURCES = [
    {
        "id": "rejection-fatigue",
        "title": "Understanding Rejection Fatigue",
        "description": "Why 50+ rejections hits differently — and what your brain is doing about it.",
        "category": "psychoeducation",
        "tags": ["rejection", "exhaustion", "emotional"],
    },
    {
        "id": "imposter-syndrome",
        "title": "Imposter Syndrome: It Has a Name",
        "description": "Coined in 1978 by psychologists Clance and Imes. You're not alone, and it's not evidence of anything.",
        "category": "psychoeducation",
        "tags": ["confidence", "self-doubt", "identity"],
    },
    {
        "id": "job-search-burnout",
        "title": "Job Search Burnout: Signs and Recovery",
        "description": "Burnout is a real physiological state, not a motivation problem. Recognising the stages is the first step.",
        "category": "psychoeducation",
        "tags": ["burnout", "exhaustion", "recovery"],
    },
    {
        "id": "grounding-techniques",
        "title": "Grounding for Interview Anxiety",
        "description": "The 5-4-3-2-1 technique and box breathing — clinically supported tools for acute anxiety.",
        "category": "coping",
        "tags": ["anxiety", "interview", "grounding"],
    },
    {
        "id": "routine-without-structure",
        "title": "Building Routine Without Structure",
        "description": "How to create anchors in an unstructured day. Small rituals carry more weight than you think.",
        "category": "practical",
        "tags": ["routine", "motivation", "structure"],
    },
    {
        "id": "success-stories",
        "title": "Stories from People Who Made It",
        "description": "Anonymous accounts from ThriveLine members who came out the other side.",
        "category": "hope",
        "tags": ["hope", "success", "community"],
    },
    {
        "id": "visa-timeline",
        "title": "Searching on a Visa Timeline",
        "description": "The OPT/H-1B search is categorically different. Here's what others on the same path have found helpful.",
        "category": "practical",
        "tags": ["visa", "OPT", "international", "timeline"],
    },
    {
        "id": "mid-career-layoff",
        "title": "Identity After a Long-Tenure Layoff",
        "description": "When you've been somewhere 10+ years, leaving isn't just a job change. It's a grief process.",
        "category": "psychoeducation",
        "tags": ["layoff", "identity", "senior", "mid-career"],
    },
]


@app.get("/api/resources", response_model=ResourceResponse)
async def get_resources(sentiment: str = None, category: str = None):
    resources = STATIC_RESOURCES
    if category:
        resources = [r for r in resources if r["category"] == category]
    return ResourceResponse(resources=resources)


@app.get("/api/resources/affirmation")
async def get_affirmation(mood: str = None):
    text = generate_affirmation(mood)
    return {"affirmation": text}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
