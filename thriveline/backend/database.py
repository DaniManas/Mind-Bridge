import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "thriveline.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            mood TEXT,
            sentiment_score TEXT
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            sentiment TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS checkins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            mood_chips TEXT,
            free_text TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS peer_connections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            follow_up_sent BOOLEAN DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()


def create_session(session_id: str, user_id: str, mood: str = None):
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "INSERT OR IGNORE INTO sessions (id, user_id, mood) VALUES (?, ?, ?)",
        (session_id, user_id, mood)
    )
    conn.commit()
    conn.close()


def save_message(session_id: str, role: str, content: str, sentiment: str = None):
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "INSERT INTO messages (session_id, role, content, sentiment) VALUES (?, ?, ?, ?)",
        (session_id, role, content, sentiment)
    )
    conn.commit()
    conn.close()


def get_session_messages(session_id: str) -> list:
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "SELECT role, content FROM messages WHERE session_id = ? ORDER BY timestamp ASC",
        (session_id,)
    )
    rows = c.fetchall()
    conn.close()
    return [{"role": row["role"], "content": row["content"]} for row in rows]


def save_checkin(user_id: str, mood_chips: list, free_text: str = None):
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "INSERT INTO checkins (user_id, mood_chips, free_text) VALUES (?, ?, ?)",
        (user_id, json.dumps(mood_chips), free_text)
    )
    conn.commit()
    conn.close()


def get_recent_checkins(limit: int = 20) -> list:
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "SELECT mood_chips, free_text, timestamp FROM checkins ORDER BY timestamp DESC LIMIT ?",
        (limit,)
    )
    rows = c.fetchall()
    conn.close()
    results = []
    for row in rows:
        chips = json.loads(row["mood_chips"]) if row["mood_chips"] else []
        text = row["free_text"] or ""
        results.append({"mood_chips": chips, "free_text": text, "timestamp": row["timestamp"]})
    return results


def save_peer_connection(user_id: str):
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "INSERT INTO peer_connections (user_id) VALUES (?)",
        (user_id,)
    )
    conn.commit()
    conn.close()


def get_recent_peer_connection(user_id: str, days: int = 3):
    conn = get_db()
    c = conn.cursor()
    c.execute(
        """SELECT * FROM peer_connections
           WHERE user_id = ?
             AND follow_up_sent = 0
             AND connected_at >= datetime('now', ?)
           ORDER BY connected_at DESC LIMIT 1""",
        (user_id, f"-{days} days")
    )
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None


def mark_followup_sent(user_id: str):
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "UPDATE peer_connections SET follow_up_sent = 1 WHERE user_id = ? AND follow_up_sent = 0",
        (user_id,)
    )
    conn.commit()
    conn.close()


def get_user_sessions(user_id: str, limit: int = 5) -> list:
    conn = get_db()
    c = conn.cursor()
    c.execute(
        "SELECT id, created_at, mood FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
        (user_id, limit)
    )
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]
