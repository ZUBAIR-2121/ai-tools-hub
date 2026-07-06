import React, { useState, useEffect } from 'react';
import { getLogo } from '../data/toolsData';
import useVoice from '../hooks/useVoice';

export default function Modal({ tool, onClose }) {
  const [imgError, setImgError] = useState(false);
  const { speaking, loading, supported, speakTool, stop } = useVoice();

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') { stop(); onClose(); } };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
      stop();
    };
  }, [onClose, stop]);

  if (!tool) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { stop(); onClose(); } }}>
      <div className="modal">
        <div className="modal-head">
          {!imgError ? (
            <img className="modal-logo" src={getLogo(tool.url)} alt={tool.n} onError={() => setImgError(true)} />
          ) : (
            <span className="modal-emoji">{tool.icon}</span>
          )}
          <div className="modal-info">
            <div className="modal-title">{tool.n}</div>
            <div className="modal-sub">
              {tool.cat} · <span className={`badge badge-${tool.t}`}>
                {tool.t === 'free' ? '✅ Free' : tool.t === 'paid' ? '💎 Paid' : '🔓 Free+Paid'}
              </span>
            </div>
          </div>
          <div className="modal-head-actions">
            {supported && (
              <button
                className={`modal-voice-btn${speaking ? ' active' : ''}${loading ? ' loading' : ''}`}
                onClick={() => (speaking || loading) ? stop() : speakTool(tool)}
              >
                {loading
                  ? <><span className="voice-spinner-sm" /> Loading…</>
                  : speaking
                  ? <><span className="voice-bars"><span/><span/><span/><span/></span> Stop</>
                  : <><span>🔊</span> Listen</>
                }
              </button>
            )}
            <button className="modal-close" onClick={() => { stop(); onClose(); }}>✕</button>
          </div>
        </div>

        <div className="modal-body">
          {tool.about && (
            <div className="m-section">
              <h4>About This Tool</h4>
              <p>{tool.about}</p>
            </div>
          )}
          {tool.steps?.length > 0 && (
            <div className="m-section">
              <h4>How to Get Started</h4>
              <div className="steps-grid">
                {tool.steps.map((step, i) => (
                  <div className="m-step" key={i}>
                    <div className="m-step-num">{i + 1}</div>
                    <div><p>{step}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tool.tips?.length > 0 && (
            <div className="m-section">
              <h4>Pro Tips</h4>
              <ul>{tool.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
            </div>
          )}
          {tool.yt?.length > 0 && (
            <div className="m-section">
              <h4>Hindi Video Tutorials</h4>
              <div className="yt-grid">
                {tool.yt.map((v, i) => (
                  <a className="yt-card" href={v.url} target="_blank" rel="noopener noreferrer" key={i}>
                    <div className="yt-icon">▶</div>
                    <div className="yt-info">
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{v.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink3)' }}>{v.ch}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="modal-ctas">
            <a className="modal-cta primary" href={tool.url} target="_blank" rel="noopener noreferrer">
              🚀 Open {tool.n}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
