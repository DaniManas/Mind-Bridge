import { useState } from 'react';
import { submitCheckin } from '../api';

const MOOD_CHIPS = [
  'Anxious', 'Exhausted', 'Hopeful', 'Frustrated',
  'Lonely', 'Motivated', 'Overwhelmed', 'Grateful',
  'Numb', 'Determined',
];

export default function MoodModal({ userId, onDone, onSkip }) {
  const [selected, setSelected] = useState([]);
  const [freeText, setFreeText] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleChip(chip) {
    setSelected(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  }

  async function handleSubmit() {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      if (userId) await submitCheckin(userId, selected, freeText || null);
    } catch {}
    onDone(selected.join(', '));
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(247,245,240,0.92)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderRadius: '20px 20px 0 0',
        padding: '28px 24px 40px',
        width: '100%',
        maxWidth: 680,
        margin: '0 auto',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.08)',
        animation: 'slideUp 0.3s ease-out',
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

        <div style={{ width: 36, height: 4, background: 'var(--border2)', borderRadius: 2, margin: '0 auto 24px' }} />

        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 300, marginBottom: 6 }}>
          How are you <em style={{ color: 'var(--sage)', fontStyle: 'italic' }}>really</em> doing?
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 300, marginBottom: 20 }}>
          This helps Sage understand where you're starting from today.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {MOOD_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => toggleChip(chip)}
              style={{
                padding: '7px 14px',
                borderRadius: 20,
                border: `1px solid ${selected.includes(chip) ? 'var(--sage)' : 'var(--border2)'}`,
                background: selected.includes(chip) ? 'var(--sage-light)' : 'transparent',
                color: selected.includes(chip) ? 'var(--sage)' : 'var(--text2)',
                fontSize: 13,
                fontWeight: selected.includes(chip) ? 500 : 300,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Want to share more? (optional)"
          value={freeText}
          onChange={e => setFreeText(e.target.value)}
          rows={2}
          style={{
            width: '100%', resize: 'none',
            background: 'var(--bg)',
            border: '1px solid var(--border2)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 13, fontWeight: 300,
            color: 'var(--text)',
            outline: 'none',
            marginBottom: 16,
            fontFamily: 'inherit',
            lineHeight: 1.5,
          }}
        />

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={selected.length === 0 || loading}
        >
          {loading ? 'Saving...' : 'Start my session'}
        </button>
        <button
          onClick={onSkip}
          style={{
            display: 'block', width: '100%', textAlign: 'center',
            background: 'none', border: 'none', color: 'var(--text3)',
            fontSize: 12, cursor: 'pointer', marginTop: 12,
            fontFamily: 'inherit', padding: 4,
          }}
        >
          I'd rather not right now
        </button>
      </div>
    </div>
  );
}
