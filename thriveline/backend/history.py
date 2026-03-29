from database import (
    create_session,
    get_session_messages,
    get_user_sessions,
)


def get_or_create_session(session_id: str, user_id: str, mood: str = None):
    """Creates session if it doesn't exist."""
    create_session(session_id, user_id, mood)


def get_conversation_history(session_id: str) -> list:
    """Returns messages formatted for Claude API: [{role, content}]"""
    return get_session_messages(session_id)


def get_recent_user_context(user_id: str) -> str:
    """Build a context string from user's recent sessions for Sage."""
    sessions = get_user_sessions(user_id, limit=3)
    if not sessions:
        return ""
    context_parts = []
    for s in sessions:
        mood = s.get("mood")
        if mood:
            context_parts.append(f"Previous check-in: {mood}")
    if context_parts:
        return "USER HISTORY:\n" + "\n".join(context_parts)
    return ""
