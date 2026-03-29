export default function ChatMessage({ role, content, isStreaming }) {
  const isAI = role === 'assistant';
  return (
    <div style={{
      display: 'flex',
      gap: 10,
      alignItems: 'flex-end',
      flexDirection: isAI ? 'row' : 'row-reverse',
      marginBottom: 16,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: isAI ? 'var(--sage)' : 'var(--blue)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 500, color: 'white', flexShrink: 0,
      }}>
        {isAI ? 'S' : 'You'}
      </div>

      <div style={{
        maxWidth: '82%',
        padding: '13px 16px',
        borderRadius: isAI ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
        background: isAI ? 'var(--surface)' : 'var(--sage)',
        border: isAI ? '1px solid var(--border)' : 'none',
        color: isAI ? 'var(--text2)' : 'white',
        fontSize: 14,
        lineHeight: 1.75,
        fontWeight: 300,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {content}
        {isStreaming && (
          <span style={{
            display: 'inline-block', width: 2, height: 13,
            background: isAI ? 'var(--sage)' : 'white',
            marginLeft: 3, verticalAlign: 'middle',
            animation: 'blink 1s steps(1) infinite',
          }} />
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
      `}</style>
    </div>
  );
}
