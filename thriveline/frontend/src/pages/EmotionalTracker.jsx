import { useState, useEffect } from 'react';
import { submitCheckin } from '../api';

const MOOD_CHIPS = ['Anxious', 'Exhausted', 'Hopeful', 'Frustrated', 'Lonely', 'Motivated', 'Overwhelmed', 'Grateful', 'Numb', 'Determined'];

const MOOD_COLORS = {
  Anxious:     { bg: 'var(--amber-light)',  color: 'var(--amber)' },
  Exhausted:   { bg: 'var(--red-light)',    color: 'var(--red)' },
  Hopeful:     { bg: 'var(--sage-light)',   color: 'var(--sage)' },
  Frustrated:  { bg: 'var(--red-light)',    color: 'var(--red)' },
  Lonely:      { bg: 'var(--purple-light)', color: 'var(--purple)' },
  Motivated:   { bg: 'var(--sage-light)',   color: 'var(--sage)' },
  Overwhelmed: { bg: 'var(--amber-light)',  color: 'var(--amber)' },
  Grateful:    { bg: 'var(--sage-light)',   color: 'var(--sage)' },
  Numb:        { bg: 'var(--blue-light)',   color: 'var(--blue)' },
  Determined:  { bg: 'var(--blue-light)',   color: 'var(--blue)' },
};

const POSITIVE_MOODS = new Set(['Hopeful', 'Motivated', 'Grateful', 'Determined']);

// Load check-in history from localStorage
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem('thriveline_checkin_history') || '[]');
  } catch { return []; }
}

function saveHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);
  localStorage.setItem('thriveline_checkin_history', JSON.stringify(history.slice(0, 30)));
}

const today = new Date().toISOString().split('T')[0];

export default function EmotionalTracker({ userId, mood }) {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState([]);
  const [freeText, setFreeText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const h = loadHistory();
    setHistory(h);
    // If already checked in today, mark submitted
    const todayEntry = h.find(e => e.date === today);
    if (todayEntry) {
      setSubmitted(true);
      setSelected(todayEntry.moods);
    } else if (mood) {
      // Pre-fill from mood modal if done
      setSelected(mood.split(', ').filter(m => MOOD_CHIPS.includes(m)));
    }
  }, [mood]);

  function toggleChip(chip) {
    if (submitted) return;
    setSelected(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
  }

  async function handleSubmit() {
    if (selected.length === 0 || submitted) return;
    setLoading(true);
    const entry = { date: today, moods: selected, note: freeText, timestamp: new Date().toISOString() };
    saveHistory(entry);
    setHistory(loadHistory());
    try { if (userId) await submitCheckin(userId, selected, freeText || null); } catch {}
    localStorage.setItem(`thriveline_checkin_${today}`, selected.join(', '));
    setSubmitted(true);
    setLoading(false);
  }

  // Compute streak
  const streak = (() => {
    let s = 0;
    const h = loadHistory();
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const dateStr = new Date(d.getTime() - i * 86400000).toISOString().split('T')[0];
      if (h.find(e => e.date === dateStr)) s++;
      else break;
    }
    return s;
  })();

  // Weekly pattern
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const entry = history.find(e => e.date === dateStr);
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    const positive = entry ? entry.moods.some(m => POSITIVE_MOODS.has(m)) : null;
    return { dateStr, label, entry, positive };
  });

  // Top moods from last 7 days
  const moodCounts = {};
  history.slice(0, 7).forEach(e => e.moods.forEach(m => { moodCounts[m] = (moodCounts[m] || 0) + 1; }));
  const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div className="screen">
      <h1 className="page-title">Your <em>wellbeing</em></h1>
      <p className="page-sub">Track how you're feeling over time. No one else sees this.</p>

      {/* Streak + summary cards */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div className="card" style={{ flex: 1, textAlign: 'center', margin: 0, padding: '16px 12px' }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 300, color: 'var(--sage)' }}>{streak}</div>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', marginTop: 4, letterSpacing: '0.06em' }}>DAY STREAK</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', margin: 0, padding: '16px 12px' }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 300, color: 'var(--blue)' }}>{history.length}</div>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', marginTop: 4, letterSpacing: '0.06em' }}>CHECK-INS</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', margin: 0, padding: '16px 12px' }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 300, color: 'var(--amber)' }}>
            {history.length > 0
              ? Math.round((history.slice(0, 7).filter(e => e.moods.some(m => POSITIVE_MOODS.has(m))).length / Math.min(history.length, 7)) * 100)
              : 0}%
          </div>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', marginTop: 4, letterSpacing: '0.06em' }}>POSITIVE DAYS</div>
        </div>
      </div>

      {/* Weekly heatmap */}
      <div className="section-label">This Week</div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {weekDays.map(day => (
            <div key={day.dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: day.entry
                  ? day.positive ? 'var(--sage-light)' : 'var(--amber-light)'
                  : day.dateStr === today ? 'var(--border)' : 'var(--surface2)',
                border: day.dateStr === today ? '2px solid var(--sage)' : '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>
                {day.entry ? (day.positive ? '🌱' : '🌊') : day.dateStr === today ? '·' : ''}
              </div>
              <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: "'DM Mono', monospace" }}>{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top moods */}
      {topMoods.length > 0 && (
        <>
          <div className="section-label">Most frequent this week</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {topMoods.map(([mood, count]) => {
              const c = MOOD_COLORS[mood] || { bg: 'var(--surface2)', color: 'var(--text2)' };
              return (
                <span key={mood} style={{
                  padding: '5px 12px', borderRadius: 20,
                  background: c.bg, color: c.color,
                  fontSize: 12, fontWeight: 500,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {mood} <span style={{ opacity: 0.6 }}>×{count}</span>
                </span>
              );
            })}
          </div>
        </>
      )}

      {/* Today's check-in */}
      <div className="section-label">Today's Check-In</div>
      <div className="card">
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--sage)', marginBottom: 4 }}>Checked in for today</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 10 }}>
              {selected.map(m => {
                const c = MOOD_COLORS[m] || { bg: 'var(--surface2)', color: 'var(--text2)' };
                return (
                  <span key={m} style={{ padding: '4px 10px', borderRadius: 20, background: c.bg, color: c.color, fontSize: 12, fontWeight: 500 }}>{m}</span>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 14, fontWeight: 300 }}>How are you feeling right now?</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
              {MOOD_CHIPS.map(chip => {
                const isSelected = selected.includes(chip);
                const c = MOOD_COLORS[chip] || { bg: 'var(--surface2)', color: 'var(--text2)' };
                return (
                  <button key={chip} onClick={() => toggleChip(chip)} style={{
                    padding: '6px 13px', borderRadius: 20,
                    border: `1px solid ${isSelected ? c.color : 'var(--border2)'}`,
                    background: isSelected ? c.bg : 'transparent',
                    color: isSelected ? c.color : 'var(--text2)',
                    fontSize: 12, fontWeight: isSelected ? 500 : 300,
                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                  }}>
                    {chip}
                  </button>
                );
              })}
            </div>
            <textarea
              placeholder="Anything else on your mind? (optional)"
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              rows={2}
              style={{
                width: '100%', resize: 'none',
                background: 'var(--bg)', border: '1px solid var(--border2)',
                borderRadius: 10, padding: '10px 12px',
                fontSize: 13, fontWeight: 300, color: 'var(--text)',
                outline: 'none', marginBottom: 4, fontFamily: 'inherit', lineHeight: 1.5,
              }}
            />
            <button className="btn-primary" onClick={handleSubmit} disabled={selected.length === 0 || loading}>
              {loading ? 'Saving...' : 'Log check-in'}
            </button>
          </>
        )}
      </div>

      {/* Recent history */}
      {history.length > 1 && (
        <>
          <div className="section-label" style={{ marginTop: 8 }}>Recent</div>
          {history.slice(submitted ? 1 : 0, 6).map(entry => (
            <div key={entry.date} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '12px 16px', marginBottom: 8,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', marginBottom: 6 }}>
                  {new Date(entry.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {entry.moods.slice(0, 3).map(m => {
                    const c = MOOD_COLORS[m] || { bg: 'var(--surface2)', color: 'var(--text2)' };
                    return (
                      <span key={m} style={{ padding: '3px 9px', borderRadius: 20, background: c.bg, color: c.color, fontSize: 11, fontWeight: 500 }}>{m}</span>
                    );
                  })}
                  {entry.moods.length > 3 && <span style={{ fontSize: 11, color: 'var(--text3)' }}>+{entry.moods.length - 3}</span>}
                </div>
              </div>
              {entry.note && <span style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic', maxWidth: 120, textAlign: 'right' }}>"{entry.note.slice(0, 40)}{entry.note.length > 40 ? '…' : ''}"</span>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
