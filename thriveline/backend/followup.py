from database import get_recent_peer_connection, mark_followup_sent


def check_peer_followup(user_id: str) -> str | None:
    """
    Returns a follow-up message if user had a peer connection in the last 3 days
    without a follow-up being sent. Returns None otherwise.
    """
    connection = get_recent_peer_connection(user_id, days=3)
    if connection:
        mark_followup_sent(user_id)
        return "You connected with someone earlier this week — how did that conversation go? Did it help at all?"
    return None
