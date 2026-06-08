import React, { useState } from 'react';
import { getLogo } from '../data/toolsData';
import { useBookmarks } from '../context/BookmarkContext';
import useVoice from '../hooks/useVoice';
import './ToolCard.css';

const DIFFICULTY = {
  ChatGPT:'Beginner', 'Claude AI':'Beginner', Gemini:'Beginner', Grok:'Beginner',
  DeepSeek:'Beginner', 'Meta AI':'Beginner', Poe:'Beginner', CapCut:'Beginner',
  Canva:'Beginner', Grammarly:'Beginner', Quillbot:'Beginner', Suno:'Beginner',
  'Adobe Podcast':'Beginner', 'Perplexity AI':'Beginner', 'NotebookLM':'Beginner',
  'ElevenLabs':'Intermediate', 'Leonardo AI':'Intermediate', Gamma:'Intermediate',
  'Julius AI':'Intermediate', 'Tableau Public':'Beginner', 'Power BI':'Intermediate',
  'Invideo AI':'Beginner', 'Opus Clip':'Beginner', 'Kling AI':'Intermediate',
  Descript:'Intermediate', 'Jasper AI':'Intermediate', 'Copy.ai':'Beginner',
  'Bolt.new':'Intermediate', Framer:'Intermediate', Lovable:'Intermediate',
  'V0 by Vercel':'Intermediate', 'GitHub Copilot':'Advanced', Cursor:'Advanced',
  'Replit AI':'Intermediate', Windsurf:'Advanced', Midjourney:'Intermediate',
  'Adobe Firefly':'Intermediate', Ideogram:'Beginner', 'Canva AI':'Beginner',
  Sora:'Intermediate', 'Surfer SEO':'Intermediate', Semrush:'Intermediate',
  HeyGen:'Beginner', Synthesia:'Beginner', 'D-ID':'Beginner',
  'Murf AI':'Beginner', 'Notion AI':'Beginner', Figma:'Advanced',
  Looka:'Beginner', Uizard:'Beginner', Tome:'Beginner', 'Beautiful.ai':'Beginner',
  'Predis AI':'Beginner', 'Opus Clip':'Beginner', 'Hootsuite OwlyWriter':'Intermediate',
  'Originality AI':'Beginner', 'Undetectable AI':'Beginner', 'GPTZero':'Beginner',
  'AdCreative.ai':'Intermediate',
};

export default function ToolCard({ tool, onOpenModal, onCompare, compareList=[] }) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { toggle, isBookmarked } = useBookmarks();
  const { speaking, loading, supported, speakQuick, stop } = useVoice();
  const bookmarked = isBookmarked(tool.n);
  const difficulty = DIFFICULTY[tool.n] || 'Beginner';
  const inCompare = compareList.includes(tool.n);

  const handleShare = (e) => {
    e.stopPropagation();
    const text = `Check out ${tool.n} — ${tool.d}\n${tool.url}`;
    if (navigator.share) {
      navigator.share({ title: tool.n, text: tool.d, url: tool.url });
    } else {
      navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className={`card${expanded?' expanded':''}${inCompare?' in-compare':''}`}>
      <div className="card-glow" />

      {/* Bookmark + Compare buttons */}
      <div className="card-actions-top">
        <button className={`bm-btn${bookmarked?' bookmarked':''}`} onClick={() => toggle(tool)} title={bookmarked?'Remove bookmark':'Save tool'}>
          {bookmarked ? '🔖' : '📌'}
        </button>
        {onCompare && (
          <button className={`cmp-btn${inCompare?' active':''}`} onClick={() => onCompare(tool.n)} title="Add to compare">
            {inCompare ? '✓' : '🆚'}
          </button>
        )}
      </div>

      <div className="card-top">
        <div className="card-name-row">
          {!imgError ? (
            <img className="card-logo" src={getLogo(tool.url)} alt={tool.n} onError={() => setImgError(true)} />
          ) : (
            <span className="card-emoji">{tool.icon}</span>
          )}
          <span className="card-name">{tool.n}</span>
          <span className={`badge badge-${tool.t}`}>
            {tool.t==='free'?'✅ Free':tool.t==='paid'?'💎 Paid':'🔓 Free+'}
          </span>
        </div>
        <div className="card-badges-row">
          <span className={`badge badge-${difficulty.toLowerCase()}`}>{difficulty}</span>
          <span className="card-cat-tag">{tool.icon} {tool.cat}</span>
        </div>
        <p className="card-desc">{tool.d}</p>
      </div>

      <div className="card-body">
        {expanded && tool.about && <p className="card-detail">{tool.about}</p>}
        {expanded && tool.steps && (
          <div className="card-steps">
            {tool.steps.slice(0,3).map((s,i) => (
              <div className="step" key={i}>
                <div className="step-num">{i+1}</div>
                <span className="step-text">{s}</span>
              </div>
            ))}
          </div>
        )}
        {expanded && tool.tips && (
          <div className="card-tags">
            {tool.tips.slice(0,2).map((tip,i) => (
              <span className="tag" key={i}>💡 {tip.slice(0,44)}…</span>
            ))}
          </div>
        )}
      </div>

      <div className="card-footer">
        <a className="card-link" href={tool.url} target="_blank" rel="noopener noreferrer">Visit →</a>
        <button className="expand-btn" onClick={() => setExpanded(e=>!e)}>
          {expanded?'Collapse':'Quick View'}
        </button>
        <button className="detail-btn" onClick={() => onOpenModal(tool)}>Full Details</button>
        {supported && (
          <button
            className={`voice-btn${speaking?' voice-active':''}${loading?' voice-loading':''}`}
            onClick={() => (speaking||loading)?stop():speakQuick(tool)}
            title="Listen"
          >
            {loading?<span className="voice-spinner"/>:speaking?'⏹':'🔊'}
          </button>
        )}
        <button className="share-btn" onClick={handleShare} title="Share">📤</button>
        {tool.yt?.[0] && (
          <a className="yt-link" href={tool.yt[0].url} target="_blank" rel="noopener noreferrer">▶ Hindi</a>
        )}
      </div>
    </div>
  );
}
