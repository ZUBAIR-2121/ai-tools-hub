import React, { useState, useRef, useEffect } from 'react';
import { allToolsComplete as allTools, ALL_DATA as DATA } from '../data/toolsData';
import './AIChatbot.css';

// ── Build a compact tools context for the AI ──────────────────────────────
const TOOLS_CONTEXT = DATA.map(cat =>
  `${cat.icon} ${cat.title}:\n` +
  cat.tools.map(t =>
    `  • ${t.n} (${t.t}) — ${t.d}`
  ).join('\n')
).join('\n\n');

const SYSTEM_PROMPT = `You are an expert AI Tools Assistant for "AI Tools Hub" — a directory of 58+ AI tools across 15 categories.

You have deep knowledge of every AI tool listed below. Your job is to:
- Recommend the best tools based on user needs
- Explain what tools do in simple, clear language  
- Compare tools when asked
- Give step-by-step guidance on how to start
- Answer any question about AI tools, trends, and use cases
- Be conversational, helpful, and encouraging
- Keep responses concise but complete
- Use emojis naturally to make responses friendly

AVAILABLE TOOLS IN OUR DIRECTORY:
${TOOLS_CONTEXT}

IMPORTANT RULES:
- Always recommend tools FROM our directory when possible
- For free tools, always mention they are free
- For beginners, recommend simpler tools first
- Format lists with bullet points using •
- Keep responses under 200 words unless detail is needed
- If asked about something outside AI tools, briefly answer then redirect to AI tools
- Never say you cannot help — always give useful guidance
- Respond in the same language the user writes in (Hindi or English)`;

const SUGGESTIONS = [
  '🎬 Best free video editing AI?',
  '🖼️ How to make AI images for free?',
  '💻 Which AI helps with coding?',
  '✍️ Best AI for writing blogs?',
  '🎵 Can AI make music for free?',
  '🌐 Build a website without coding?',
  '📊 Analyse data with AI?',
  '🤖 ChatGPT vs Claude — which is better?',
];

// Format AI response text with basic markdown-like rendering
function formatMessage(text) {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <div key={i} className="ai-bullet">
          <span className="ai-bullet-dot">•</span>
          <span>{line.replace(/^[•\-] /, '')}</span>
        </div>;
      }
      if (line.match(/^\*\*(.*)\*\*$/)) {
        return <div key={i} className="ai-bold">{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.trim() === '') return <div key={i} style={{height:6}}/>;
      return <div key={i} className="ai-line">{line}</div>;
    });
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '👋 Hi! I\'m your AI Tools assistant — powered by Claude AI.\n\nAsk me anything about AI tools! I can recommend tools for your needs, compare options, or help you get started with any tool in our directory.',
      tools: []
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const conversationHistory = useRef([]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (open && !isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, isMinimized]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || typing) return;
    setInput('');

    const userMsg = { role: 'user', text: q, tools: [] };
    setMessages(m => [...m, userMsg]);
    setTyping(true);

    // Build conversation history for context
    conversationHistory.current.push({ role: 'user', content: q });

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: conversationHistory.current.slice(-10), // keep last 10 for context
        }),
      });

      const data = await response.json();
      const replyText = data.content?.[0]?.text || "I'm having trouble responding. Please try again!";

      // Find mentioned tools to show as chips
      const mentionedTools = allTools.filter(t =>
        replyText.toLowerCase().includes(t.n.toLowerCase())
      ).slice(0, 4);

      conversationHistory.current.push({ role: 'assistant', content: replyText });

      setMessages(m => [...m, {
        role: 'assistant',
        text: replyText,
        tools: mentionedTools
      }]);

      if (!open) setUnread(u => u + 1);

    } catch (err) {
      // Fallback to smart local response
      const fallback = getSmartFallback(q);
      setMessages(m => [...m, fallback]);
    } finally {
      setTyping(false);
    }
  };

  // Smart fallback when API unavailable
  function getSmartFallback(query) {
    const q = query.toLowerCase();
    const scored = allTools.map(t => {
      let score = 0;
      const words = q.split(' ').filter(w => w.length > 2);
      words.forEach(w => {
        if (t.n.toLowerCase().includes(w)) score += 5;
        if (t.d.toLowerCase().includes(w)) score += 3;
        if (t.cat.toLowerCase().includes(w)) score += 2;
        if ((t.about||'').toLowerCase().includes(w)) score += 1;
      });
      if (t.t==='free' && q.includes('free')) score += 4;
      if (q.includes('beginner') && (t.n==='ChatGPT'||t.n==='Canva AI'||t.n==='CapCut')) score += 3;
      return {...t, score};
    }).filter(t => t.score > 0).sort((a,b) => b.score-a.score).slice(0,4);

    if (scored.length > 0) {
      const names = scored.map(t => `• ${t.n} — ${t.d}`).join('\n');
      return {
        role: 'assistant',
        text: `Here are the best matches for "${query}":\n\n${names}\n\nClick any tool above to learn more!`,
        tools: scored
      };
    }
    return {
      role: 'assistant',
      text: `I found lots of great AI tools you might like! Try searching for:\n• Video editing\n• Image generation\n• Writing & content\n• Coding assistance\n• Music generation`,
      tools: []
    };
  }

  const clearChat = () => {
    conversationHistory.current = [];
    setMessages([{
      role: 'assistant',
      text: '🔄 Chat cleared! Ask me anything about AI tools.',
      tools: []
    }]);
  };

  return (
    <>
      {/* FAB Button */}
      <button
        className={`chatbot-fab${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="AI Assistant"
      >
        {open ? '✕' : (
          <>
            <span className="fab-icon">🤖</span>
            <span className="chatbot-fab-label">AI Assistant</span>
            {unread > 0 && <span className="fab-unread">{unread}</span>}
          </>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className={`chatbot-window${isMinimized ? ' minimized' : ''}`}>

          {/* Header */}
          <div className="chatbot-head">
            <div className="chatbot-head-info">
              <div className="chatbot-avatar-wrap">
                <div className="chatbot-avatar">🤖</div>
                <div className="chatbot-online-dot"/>
              </div>
              <div>
                <div className="chatbot-title">AI Tools Assistant</div>
                <div className="chatbot-status">
                  <span className="status-dot"/>
                  {typing ? 'Thinking…' : 'Powered by Claude AI'}
                </div>
              </div>
            </div>
            <div className="chatbot-head-btns">
              <button className="chatbot-head-btn" onClick={clearChat} title="Clear chat">🗑️</button>
              <button className="chatbot-head-btn" onClick={() => setIsMinimized(m=>!m)} title="Minimize">
                {isMinimized ? '⬆' : '⬇'}
              </button>
              <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="chatbot-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-msg ${msg.role}`}>
                    {msg.role === 'assistant' && (
                      <div className="chat-msg-avatar">🤖</div>
                    )}
                    <div className="chat-msg-content">
                      <div className="chat-bubble">
                        {formatMessage(msg.text)}
                      </div>
                      {msg.tools?.length > 0 && (
                        <div className="chat-tools">
                          {msg.tools.map(t => (
                            <a
                              key={t.n}
                              className="chat-tool-chip"
                              href={t.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={`https://www.google.com/s2/favicons?domain=${new URL(t.url).hostname}&sz=32`}
                                alt={t.n}
                                onError={e => e.target.style.display='none'}
                                style={{width:14,height:14,borderRadius:3,flexShrink:0}}
                              />
                              <span>{t.n}</span>
                              <span className={`badge badge-${t.t}`} style={{fontSize:8,padding:'1px 5px'}}>{t.t}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="chat-msg assistant">
                    <div className="chat-msg-avatar">🤖</div>
                    <div className="chat-msg-content">
                      <div className="chat-bubble">
                        <div className="typing-indicator">
                          <span/><span/><span/>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef}/>
              </div>

              {/* Suggestions — show only at start */}
              {messages.length <= 1 && (
                <div className="chatbot-suggestions">
                  <div className="sug-label">💡 Try asking:</div>
                  <div className="sug-grid">
                    {SUGGESTIONS.map(s => (
                      <button key={s} className="chat-sug" onClick={() => send(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="chatbot-input-row">
                <input
                  ref={inputRef}
                  className="chatbot-input"
                  type="text"
                  placeholder="Ask about any AI tool…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  disabled={typing}
                />
                <button
                  className={`chatbot-send${typing ? ' disabled' : ''}`}
                  onClick={() => send()}
                  disabled={typing}
                >
                  {typing ? <span className="send-spinner"/> : '➤'}
                </button>
              </div>

              <div className="chatbot-footer">
                Powered by Claude AI · AI Tools Hub
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
