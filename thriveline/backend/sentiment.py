import os
import anthropic
from dotenv import load_dotenv

load_dotenv()

_client = None


def get_client():
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    return _client


SENTIMENT_PROMPT = """Classify the emotional sentiment of this message from a job seeker.
Return ONLY one of these five labels, nothing else:
POSITIVE, NEUTRAL, NEGATIVE, DISTRESSED, CRISIS

CRISIS means any indication of self-harm, suicidal thoughts, or feeling like there is
no reason to continue. If you see CRISIS, do not return any other label.

Message: {message}"""

VALID_LABELS = {"POSITIVE", "NEUTRAL", "NEGATIVE", "DISTRESSED", "CRISIS"}


def classify_sentiment(message: str) -> str:
    """Classify sentiment using Haiku 4.5. Returns one of 5 labels."""
    try:
        client = get_client()
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=10,
            messages=[{
                "role": "user",
                "content": SENTIMENT_PROMPT.format(message=message)
            }]
        )
        label = response.content[0].text.strip().upper()
        return label if label in VALID_LABELS else "NEUTRAL"
    except Exception:
        return "NEUTRAL"
