import { useState, useEffect, useRef } from 'react';
import { streamMessage } from '../api';
import ChatMessage from '../components/ChatMessage';
import CrisisCard from '../components/CrisisCard';

const WELCOME = {
  role: 'assistant',
  content: "Before we talk about anything else — how long have you been searching? I want to make sure I actually understand where you are, not just where you started.",
  id: 'welcome',
};

export default function Chat({ userId, mood }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [listening, setListening] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (mood) {
      setMessages([{
        role: 'assistant',
        content: `I saw you checked in feeling ${mood} today. I'm glad you're here. Would you like to tell me what's been on your mind?`,
        id: 'welcome-mood',
      }]);
    }
  }, [mood]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || streaming) return;
    setMessages(prev => [...prev, { role: 'user', content: text, id: Date.now() }]);
    setInput('');
    setStreaming(true);
    const streamId = Date.now() + 1;
    setMessages(prev => [...prev, { role: 'assistant', content: '', id: streamId, isStreaming: true }]);

    try {
      const reader = await streamMessage(userId, text, sessionId, mood);
      const decoder = new TextDecoder();
      let full = '';
      let isCrisis = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true }).split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.is_crisis) { isCrisis = true; full = parsed.text || ''; }
            else if (parsed.text) full += parsed.text;
          } catch {}
        }
        setMessages(prev => prev.map(m => m.id === streamId ? { ...m, content: full } : m));
      }

      setMessages(prev => prev.map(m => m.id === streamId ? { ...m, isStreaming: false } : m));
      if (isCrisis) setShowCrisis(true);
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === streamId ? { ...m, content: "I'm having trouble connecting. Please try again.", isStreaming: false } : m
      ));
    }
    setStreaming(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input requires Chrome.'); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US';
    rec.onresult = e => { setInput(p => p + (p ? ' ' : '') + e.results[0][0].transcript); setListening(false); };
    rec.onerror = rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start(); setListening(true);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 136px)' }}>
      {showCrisis && <CrisisCard onAcknowledge={() => setShowCrisis(false)} />}

      {/* Disclaimer */}
      <div style={{ padding: '12px 24px 0' }}>
        <div className="disclaimer-bar">
          <span>⚕️</span>
          <span>Peer support companion — <strong>not a therapist</strong>. Sage is not a substitute for professional care.</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px' }}>
        {mood && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 20, marginBottom: 16,
            background: 'var(--sage-light)', color: 'var(--sage)',
            fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500,
          }}>
            Today: {mood}
          </div>
        )}

        {messages.map(msg => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} isStreaming={msg.isStreaming} />
        ))}

        {/* Typing indicator */}
        {streaming && !messages[messages.length - 1]?.isStreaming && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', flexShrink: 0 }}>S</div>
            <div style={{ padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px 18px 18px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text3)', animation: `typing 1.2s ${i*0.2}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 24px 16px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex', gap: 10, alignItems: 'flex-end',
      }}>
        <button
          onClick={startVoice}
          style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: listening ? 'var(--red-light)' : 'var(--bg)',
            border: `1px solid ${listening ? 'var(--red)' : 'var(--border2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: listening ? 'var(--red)' : 'var(--text3)',
            fontSize: 17,
          }}
        >
          🎙️
        </button>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share what's on your mind..."
          rows={1}
          style={{
            flex: 1, resize: 'none',
            padding: '12px 16px',
            border: '1px solid var(--border2)',
            borderRadius: 14,
            fontSize: 14, fontWeight: 300,
            background: 'var(--bg)',
            color: 'var(--text)',
            outline: 'none',
            maxHeight: 120,
            lineHeight: 1.5,
            fontFamily: 'inherit',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--sage)'}
          onBlur={e => e.target.style.borderColor = 'var(--border2)'}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || streaming}
          style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: (!input.trim() || streaming) ? 'var(--border2)' : 'var(--sage)',
            border: 'none', color: 'white', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: (!input.trim() || streaming) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          ↑
        </button>
      </div>

      <style>{`
        @keyframes typing {
          0%,60%,100% { transform:translateY(0); opacity:0.4; }
          30% { transform:translateY(-5px); opacity:1; }
        }
      `}</style>
    </div>
  );
}
