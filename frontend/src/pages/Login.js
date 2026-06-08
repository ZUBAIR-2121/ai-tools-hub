import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
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
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to your account to continue</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className="form-input"
              type="email" name="email"
              placeholder="you@example.com"
              value={form.email} onChange={handle} required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password" name="password"
              placeholder="••••••••"
              value={form.password} onChange={handle} required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
        <Link to="/" className="auth-back">← Back to AI Tools Hub</Link>
      </div>
    </div>
  );
}
