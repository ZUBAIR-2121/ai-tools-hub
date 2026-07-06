import React, { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  '🎬 Best free video editing AI?',
  '🖼️ How to make AI images for free?',
  '💻 Which AI helps with coding?',
  '✍️ Best AI for writing blogs?',
  '🎵 Can AI make music for free?',
  '🌐 Build a website without coding?',
  '📊 Analyse data with AI?',
  '🤖 ChatGPT vs Claude — which is better?',
  '🔊 Best AI voice generator?',
  '📱 Best AI for social media?',
];

const SYSTEM_PROMPT = `You are a helpful, friendly AI assistant embedded in "AI Tools Hub" — a website that helps people discover and learn AI tools.

You can answer ANY question the user asks — whether it's about AI tools, general knowledge, coding, writing, life advice, current events, science, math, or anything else.

Guidelines:
- Answer the user's actual question directly and completely
- Be conversational, warm, and helpful
- Use bullet points (•) for lists
- Use **bold** for important terms
- Keep answers focused but thorough
- If the question is about AI tools, recommend specific tools with their names
- If asked to compare tools, give honest pros and cons
- Respond in the same language the user uses (Hindi or English)
- Never refuse to answer — always try to help
- For coding questions, include actual code examples
- For creative questions, be creative and engaging`;

function formatMessage(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <div key={i} style={{ height: 6 }} />;
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={j}>{part.slice(2, -2)}</strong>;
      return part;
    });
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      return <div key={i} className="ai-bullet"><span className="ai-bullet-dot">•</span><span>{parts}</span></div>;
    }
    if (line.match(/^\d+\.\s/)) {
      return <div key={i} className="ai-bullet"><span className="ai-bullet-dot">{line.match(/^\d+/)[0]}.</span><span>{line.replace(/^\d+\.\s/, '')}</span></div>;
    }
    if (line.startsWith('###') || line.startsWith('##') || line.startsWith('#')) {
      return <div key={i} className="ai-heading">{line.replace(/^#+\s/, '')}</div>;
    }
    return <div key={i} className="ai-line">{parts}</div>;
  });
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: '👋 Hi! I\'m your AI assistant — ask me **anything**!\n\nI can help with AI tools, answer general questions, help with coding, writing, or whatever you need. What\'s on your mind?',
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 150); }
  }, [open]);

  useEffect(() => {
    if (open && !minimized) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, minimized]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || typing) return;
    setInput(''); setError('');
    setMessages(m => [...m, { role: 'user', text: q }]);
    setTyping(true);
    historyRef.current.push({ role: 'user', content: q });
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1024, system: SYSTEM_PROMPT, messages: historyRef.current.slice(-12) }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d?.error?.message || `API error ${res.status}`); }
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
      historyRef.current.push({ role: 'assistant', content: reply });
      setMessages(m => [...m, { role: 'assistant', text: reply }]);
      if (!open) setUnread(u => u + 1);
    } catch (err) {
      setError('⚠️ Could not connect. Check your internet and try again.');
      historyRef.current.pop();
    } finally { setTyping(false); }
  };

  const clearChat = () => {
    historyRef.current = [];
    setMessages([{ role: 'assistant', text: '🔄 Chat cleared! Ask me anything.' }]);
    setError('');
  };

  return (
    <>
      <button className={`chatbot-fab${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="AI Assistant">
        {open ? '✕' : (<><span className="fab-icon">🤖</span><span className="chatbot-fab-label">AI Assistant</span>{unread > 0 && <span className="fab-unread">{unread}</span>}</>)}
      </button>

      {open && (
        <div className={`chatbot-window${minimized ? ' minimized' : ''}`}>
          <div className="chatbot-head">
            <div className="chatbot-head-info">
              <div className="chatbot-avatar-wrap">
                <div className="chatbot-avatar">🤖</div>
                <div className="chatbot-online-dot" />
              </div>
              <div>
                <div className="chatbot-title">AI Assistant</div>
                <div className="chatbot-status"><span className="status-dot" />{typing ? 'Thinking…' : 'Ask me anything'}</div>
              </div>
            </div>
            <div className="chatbot-head-btns">
              <button className="chatbot-head-btn" onClick={clearChat} title="Clear">🗑️</button>
              <button className="chatbot-head-btn" onClick={() => setMinimized(m => !m)} title="Minimize">{minimized ? '⬆' : '⬇'}</button>
              <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="chatbot-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-msg ${msg.role}`}>
                    {msg.role === 'assistant' && <div className="chat-msg-avatar">🤖</div>}
                    <div className="chat-msg-content">
                      <div className="chat-bubble">{formatMessage(msg.text)}</div>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="chat-msg assistant">
                    <div className="chat-msg-avatar">🤖</div>
                    <div className="chat-msg-content">
                      <div className="chat-bubble"><div className="typing-indicator"><span /><span /><span /></div></div>
                    </div>
                  </div>
                )}
                {error && <div className="chat-error">{error}</div>}
                <div ref={bottomRef} />
              </div>

              {messages.length <= 1 && (
                <div className="chatbot-suggestions">
                  <div className="sug-label">💡 Try asking:</div>
                  <div className="sug-grid">
                    {SUGGESTIONS.map(s => (
                      <button key={s} className="chat-sug" onClick={() => send(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="chatbot-input-row">
                <input
                  ref={inputRef}
                  className="chatbot-input"
                  type="text"
                  placeholder="Ask me anything…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  disabled={typing}
                />
                <button className={`chatbot-send${typing ? ' disabled' : ''}`} onClick={() => send()} disabled={typing}>
                  {typing ? <span className="send-spinner" /> : '➤'}
                </button>
              </div>
              <div className="chatbot-footer">Powered by Claude AI</div>
            </>
          )}
        </div>
      )}
    </>
  );
}
