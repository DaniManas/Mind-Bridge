from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class ChatRequest(BaseModel):
    user_id: str
    message: str
    session_id: str
    mood: Optional[str] = None
    user_context: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    sentiment: str
    is_crisis: bool
    session_id: str
    resources: Optional[List[Dict[str, Any]]] = None


class CheckinRequest(BaseModel):
    user_id: str
    mood_chips: List[str]
    free_text: Optional[str] = None


class CheckinResponse(BaseModel):
    pulse_text: str
    message: str


class PeerConnectRequest(BaseModel):
    user_id: str
    peer_id: str


class FollowupResponse(BaseModel):
    has_followup: bool
    message: Optional[str] = None


class ResourceResponse(BaseModel):
    resources: List[Dict[str, Any]]
