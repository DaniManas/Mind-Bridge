import { useState } from 'react';
import { connectPeer } from '../api';

const CATEGORY_COLORS = {
  'Emotional Support': { bg: 'var(--sage-light)', color: 'var(--sage)' },
  'Job Buddy':         { bg: 'var(--blue-light)',  color: 'var(--blue)' },
  'Interview Practice':{ bg: 'var(--purple-light)',color: 'var(--purple)' },
  'Networking':        { bg: 'var(--amber-light)', color: 'var(--amber)' },
};

export default function PeerCard({ peer, userId }) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const colors = CATEGORY_COLORS[peer.looking_for] || CATEGORY_COLORS['Emotional Support'];

  async function handleConnect() {
    if (connected || loading) return;
    setLoading(true);
    try { if (userId) await connectPeer(userId, peer.id); } catch {}
    setConnected(true);
    setLoading(false);
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: connected ? '1px solid var(--sage)' : '1px solid var(--border)',
      borderRadius: 14,
      padding: '18px 20px',
      marginBottom: 10,
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{
          padding: '4px 10px', borderRadius: 20,
          fontSize: 11, fontWeight: 500,
          background: colors.bg, color: colors.color,
          fontFamily: "'DM Mono', monospace",
        }}>
          {peer.looking_for}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 300 }}>{peer.field}</span>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, fontWeight: 300, fontStyle: 'italic', marginBottom: 10 }}>
        "{peer.mood}"
      </p>
      <p style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 300, marginBottom: 14 }}>
        {peer.duration} into their search
      </p>

      <button
        onClick={handleConnect}
        disabled={connected || loading}
        style={{
          width: '100%', padding: '10px',
          borderRadius: 10,
          background: connected ? 'var(--sage-light)' : 'transparent',
          border: `1px solid ${connected ? 'var(--sage)' : 'var(--border2)'}`,
          color: connected ? 'var(--sage)' : 'var(--text2)',
          fontSize: 13, fontWeight: 500,
          fontFamily: 'inherit', cursor: connected ? 'default' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {loading ? 'Connecting...' : connected ? '✓ Connected' : 'Connect'}
      </button>
    </div>
  );
}
