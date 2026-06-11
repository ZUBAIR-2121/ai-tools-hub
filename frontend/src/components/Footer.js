import React from 'react';
import { allToolsComplete } from '../data/toolsData';
import './Footer.css';

export default function Footer() {
  const total = allToolsComplete.length;
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
              <span>🤖 Chatbots</span><span>💻 Coding</span>
              <span>🎬 Video</span><span>✍️ Writing</span>
              <span>🖼️ Image AI</span><span>🌐 Websites</span>
              <span>📽️ Slides</span><span>🎨 Design</span>
              <span>🔍 SEO</span><span>🎵 Audio</span>
              <span>📊 Data</span><span>⚡ Productivity</span>
              <span>🛒 E-Commerce</span><span>🧠 Avatars</span>
              <span>🛡️ AI Detection</span><span>📱 Social Media</span>
              <span>🎮 3D & Animation</span><span>📧 Automation</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 AI Tools Hub · Built for learners, by learners · Always free</span>
          <div className="footer-meta">
            <span>{total}+ AI Tools Indexed</span>
            <span className="sep-dot"></span>
            <span>22+ Categories</span>
            <span className="sep-dot"></span>
            <span style={{ color: 'var(--accent3)' }}>🟢 Always Updated</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
