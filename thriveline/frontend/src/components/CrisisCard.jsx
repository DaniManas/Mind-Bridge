export default function CrisisCard({ onAcknowledge }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(247,245,240,0.95)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid rgba(192,57,43,0.2)',
        borderRadius: 20,
        padding: '32px 28px',
        maxWidth: 420,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🌿</div>
        <h2 style={{
          fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 300,
          marginBottom: 10, color: 'var(--text)',
        }}>
          You're not alone in this
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 24, fontWeight: 300 }}>
          What you're feeling is real and it matters. Please reach out to someone who can be there with you right now.
        </p>

        {[
          { label: '988 Suicide & Crisis Lifeline', value: 'Call or text 988', detail: '24/7 · Free · Confidential' },
          { label: 'Crisis Text Line', value: 'Text HOME to 741741', detail: 'When calling feels hard' },
          { label: 'SAMHSA Helpline', value: '1-800-662-4357', detail: 'Mental health referrals · 24/7' },
        ].map(item => (
          <div key={item.label} style={{
            background: 'var(--red-light)',
            border: '1px solid rgba(192,57,43,0.15)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 10,
            textAlign: 'left',
          }}>
            <div style={{ fontSize: 11, color: 'var(--red)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.06em', marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)' }}>{item.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2, fontWeight: 300 }}>{item.detail}</div>
          </div>
        ))}

        <button
          onClick={onAcknowledge}
          style={{
            marginTop: 8, width: '100%', padding: 14,
            background: 'transparent',
            border: '1px solid rgba(192,57,43,0.3)',
            borderRadius: 12,
            color: 'var(--red)', fontSize: 14,
            fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          I understand — I'll reach out
        </button>
      </div>
    </div>
  );
}
