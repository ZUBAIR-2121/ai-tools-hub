import React from 'react';
import './Footer.css';

export default function Footer({ toolCount }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-dot"></div>
              AI<span className="grad">Tools</span>Hub
            </div>
            <p>Your one-stop directory to learn, explore, and master every AI tool. Free forever. Built for creators, developers, and students.</p>
          </div>
          <div>
            <div className="footer-heading">Categories</div>
            <div className="footer-cats">
              <span>📊 Data Viz</span><span>💻 Coding</span>
              <span>🎬 Video</span><span>✍️ Writing</span>
              <span>🖼️ Image AI</span><span>🌐 Websites</span>
              <span>📽️ Slides</span><span>🎨 Design</span>
              <span>🔍 SEO</span><span>🎵 Audio</span>
              <span>🤖 Chatbots</span><span>⚡ Productivity</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 AI Tools Hub · Built for learners, by learners · Always free</span>
          <div className="footer-meta">
            <span>{toolCount} AI Tools Indexed</span>
            <span className="sep-dot"></span>
            <span>13 Categories</span>
            <span className="sep-dot"></span>
            <span style={{ color: 'var(--accent3)' }}>🟢 Always Updated</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
