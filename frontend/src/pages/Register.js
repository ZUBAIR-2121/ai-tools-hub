import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="auth-bg">
      <div className="orb orb1" /><div className="orb orb2" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-dot" />
          AI<span className="grad">Tools</span>Hub
        </div>
        <div className="auth-coming-soon">
          <div className="acs-icon">🚀</div>
          <h2 className="auth-title">Coming Soon</h2>
          <p className="auth-sub">
            User accounts are currently being set up. All AI tools are fully accessible without an account — no sign up needed!
          </p>
          <div className="acs-features">
            <div className="acs-feature">✅ Browse 150+ AI Tools — Free</div>
            <div className="acs-feature">🔖 Save Tools — Works without login</div>
            <div className="acs-feature">🤖 AI Assistant — Available now</div>
            <div className="acs-feature">🗺️ Roadmaps &amp; News — Available now</div>
          </div>
          <Link to="/" className="acs-btn">Explore AI Tools →</Link>
        </div>
      </div>
    </div>
  );
}
