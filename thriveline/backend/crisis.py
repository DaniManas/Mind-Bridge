CRISIS_KEYWORDS = [
    "end my life",
    "kill myself",
    "want to die",
    "don't want to be here",
    "no point anymore",
    "better off without me",
    "can't go on",
    "suicidal",
    "self-harm",
    "hurt myself",
    "no reason to live",
    "end it all",
    "give up on life",
    "not worth living",
    "better off dead",
    "want to disappear forever",
    "can't take it anymore",
    "wish i was dead",
    "thinking about suicide",
    "no point in living",
]

CRISIS_RESPONSE = """I hear you, and I'm really glad you told me. What you're feeling is real and it matters.

Please reach out to the 988 Suicide & Crisis Lifeline right now — you can call or text **988**, and someone will be there. You can also text HOME to **741741**.

You don't have to face this alone, and you deserve real human support right now."""


def check_crisis_keywords(message: str) -> bool:
    """Returns True if any crisis keyword is found. Runs synchronously before any AI call."""
    message_lower = message.lower()
    return any(keyword in message_lower for keyword in CRISIS_KEYWORDS)
