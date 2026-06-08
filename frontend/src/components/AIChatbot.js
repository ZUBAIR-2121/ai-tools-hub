import React, { useState, useRef, useEffect } from 'react';
import { allTools } from '../data/toolsData';
import './AIChatbot.css';

const SUGGESTIONS = [
  'Best free tools for video editing',
  'Which AI tool for beginners?',
  'How to create AI images for free?',
  'Best coding AI tools',
  'Free music generation AI',
];

function findTools(query) {
  const q = query.toLowerCase();
  const keywords = q.split(' ').filter(w => w.length > 2);
  const scored = allTools.map(t => {
    let score = 0;
    keywords.forEach(kw => {
      if (t.n.toLowerCase().includes(kw)) score += 5;
      if (t.d.toLowerCase().includes(kw)) score += 3;
      if (t.cat.toLowerCase().includes(kw)) score += 2;
      if ((t.about||'').toLowerCase().includes(kw)) score += 1;
      if (t.t === 'free' && (kw==='free'||kw==='budget')) score += 4;
      if ((t.t==='free'||t.t==='both') && kw==='free') score += 3;
    });
    return { ...t, score };
  }).filter(t => t.score > 0).sort((a,b) => b.score - a.score).slice(0,4);
  return scored;
}

function generateReply(query) {
  const tools = findTools(query);
  if (!tools.length) {
    return { text: "I couldn't find a specific match, but you can browse all categories on the home page or try searching for: video, image, writing, coding, music, or presentation.", tools: [] };
  }
  const q = query.toLowerCase();
  let intro = `Here are the best AI tools for "${query}":`;
  if (q.includes('free')) intro = `Here are the best FREE AI tools:`;
  if (q.includes('beginner')) intro = `Best AI tools for beginners:`;
  if (q.includes('coding') || q.includes('code')) intro = `Top AI coding tools:`;
  if (q.includes('video')) intro = `Best AI video tools:`;
  if (q.includes('image') || q.includes('photo')) intro = `Best AI image tools:`;
  return { text: intro, tools };
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Hi! I am your AI Tools assistant. Ask me anything like "best free video AI" or "which tool for beginners?"', tools: [] }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = (text) => {
    const q = text || input;
    if (!q.trim()) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: q, tools: [] }]);
    setTyping(true);
    setTimeout(() => {
      const reply = generateReply(q);
      setMessages(m => [...m, { role: 'bot', ...reply }]);
      setTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating button */}
      <button className={`chatbot-fab${open?' open':''}`} onClick={() => setOpen(o=>!o)}>
        {open ? '✕' : '🤖'}
        {!open && <span className="chatbot-fab-label">AI Assistant</span>}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-head">
            <div className="chatbot-head-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <div className="chatbot-title">AI Tools Assistant</div>
                <div className="chatbot-status"><span className="status-dot"/>Online</div>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <div className="chat-bubble">{msg.text}</div>
                {msg.tools?.length > 0 && (
                  <div className="chat-tools">
                    {msg.tools.map(t => (
                      <a key={t.n} className="chat-tool-chip" href={t.url} target="_blank" rel="noopener noreferrer">
                        <img src={`https://www.google.com/s2/favicons?domain=${new URL(t.url).hostname}&sz=32`} alt={t.n} onError={e=>e.target.style.display='none'} style={{width:16,height:16,borderRadius:4}}/>
                        <span>{t.n}</span>
                        <span className={`badge badge-${t.t}`} style={{fontSize:9}}>{t.t}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="chat-msg bot">
                <div className="chat-bubble typing-indicator"><span/><span/><span/></div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="chatbot-suggestions">
              {SUGGESTIONS.map(s => (
                <button key={s} className="chat-sug" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="chatbot-input-row">
            <input
              className="chatbot-input"
              type="text"
              placeholder="Ask me anything about AI tools…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && send()}
            />
            <button className="chatbot-send" onClick={() => send()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
