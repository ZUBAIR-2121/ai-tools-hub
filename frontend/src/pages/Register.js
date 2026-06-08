import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user, data.token);
        navigate('/');
      } else {
        const msg = data.errors ? data.errors[0].msg : data.message;
        setError(msg || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="orb orb1" /><div className="orb orb2" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-dot" />
          AI<span className="grad">Tools</span>Hub
        </div>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-sub">Free forever. No credit card required.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text" name="full_name"
              placeholder="Your name"
              value={form.full_name} onChange={handle}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Username <span style={{color:'var(--accent2)'}}>*</span></label>
            <input
              className="form-input"
              type="text" name="username"
              placeholder="cooluser123"
              value={form.username} onChange={handle} required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email <span style={{color:'var(--accent2)'}}>*</span></label>
            <input
              className="form-input"
              type="email" name="email"
              placeholder="you@example.com"
              value={form.email} onChange={handle} required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password <span style={{color:'var(--accent2)'}}>*</span></label>
            <input
              className="form-input"
              type="password" name="password"
              placeholder="Min 6 characters"
              value={form.password} onChange={handle} required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
        <Link to="/" className="auth-back">← Back to AI Tools Hub</Link>
      </div>
    </div>
  );
}
