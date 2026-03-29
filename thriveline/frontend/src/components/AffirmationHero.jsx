import { useState, useEffect } from 'react';
import { getAffirmation } from '../api';

const FALLBACK_AFFIRMATIONS = [
  "You've kept going through hard days. That matters, even when it doesn't feel like it.",
  "The search is not a verdict on your worth. It is a process, and processes take time.",
  "Today doesn't have to be productive to be worthwhile. You're allowed to rest.",
  "One rejection is one door. It says nothing about all the doors that exist.",
  "The version of you six months from now will be grateful you didn't give up today.",
  "Your value is not a function of your employment status.",
  "It's okay to be tired. You're running a marathon in conditions most people can't see.",
];

const styles = {
  card: {
    background: 'linear-gradient(135deg, rgba(212,165,116,0.1), rgba(122,158,126,0.08))',
    border: '1px solid rgba(212,165,116,0.25)',
    borderRadius: 18,
    padding: '28px 24px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 24,
  },
  label: {
    fontSize: 11, color: 'var(--amber)',
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 14,
  },
  text: {
    fontSize: 17, color: 'var(--text)',
    lineHeight: 1.8, fontStyle: 'italic',
    fontWeight: 500,
    transition: 'opacity 0.4s',
  },
  refreshBtn: {
    marginTop: 18,
    background: 'none',
    border: '1px solid rgba(212,165,116,0.3)',
    borderRadius: 20,
    padding: '6px 16px',
    color: 'var(--amber)',
    fontSize: 12, fontFamily: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  },
};

export default function AffirmationHero({ mood }) {
  const [text, setText] = useState('');
  const [fading, setFading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAffirmation();
  }, []);

  async function loadAffirmation() {
    setLoading(true);
    setFading(true);
    setTimeout(async () => {
      try {
        const data = await getAffirmation(mood);
        setText(data.affirmation);
      } catch {
        setText(FALLBACK_AFFIRMATIONS[Math.floor(Math.random() * FALLBACK_AFFIRMATIONS.length)]);
      }
      setFading(false);
      setLoading(false);
    }, 300);
  }

  return (
    <div style={styles.card}>
      <div style={styles.label}>Daily Affirmation</div>
      <p style={{ ...styles.text, opacity: fading ? 0 : 1 }}>
        {text || FALLBACK_AFFIRMATIONS[0]}
      </p>
      <button style={styles.refreshBtn} onClick={loadAffirmation} disabled={loading}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        {loading ? 'Getting one...' : 'New affirmation'}
      </button>
    </div>
  );
}
