const BASE = 'http://localhost:8000';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Non-streaming chat (fallback)
export async function sendMessage(userId, message, sessionId, mood) {
  return post('/api/chat', { user_id: userId, message, session_id: sessionId, mood });
}

// Streaming chat — returns a ReadableStream reader
export async function streamMessage(userId, message, sessionId, mood) {
  const res = await fetch(`${BASE}/api/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, message, session_id: sessionId, mood }),
  });
  if (!res.ok) throw new Error(`Stream error: ${res.status}`);
  return res.body.getReader();
}

export async function submitCheckin(userId, moodChips, freeText) {
  return post('/api/checkin', { user_id: userId, mood_chips: moodChips, free_text: freeText });
}

export async function getHistory(userId) {
  return get(`/api/history/${userId}`);
}

export async function connectPeer(userId, peerId) {
  return post('/api/peer-connect', { user_id: userId, peer_id: peerId });
}

export async function checkFollowup(userId) {
  return get(`/api/followup/${userId}`);
}

export async function getResources(sentiment, category) {
  const params = new URLSearchParams();
  if (sentiment) params.set('sentiment', sentiment);
  if (category) params.set('category', category);
  return get(`/api/resources${params.toString() ? '?' + params.toString() : ''}`);
}

export async function getAffirmation(mood) {
  const params = mood ? `?mood=${encodeURIComponent(mood)}` : '';
  return get(`/api/resources/affirmation${params}`);
}
