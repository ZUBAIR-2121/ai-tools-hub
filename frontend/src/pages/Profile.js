import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useTheme } from '../context/ThemeContext';
import { getLogo } from '../data/toolsData';
import Footer from '../components/Footer';

export default function Profile() {
  const { user, token, logout, updateUser } = useAuth();
  const { bookmarks, toggle } = useBookmarks();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [tab, setTab] = useState('info');
  const [form, setForm] = useState({ full_name: user?.full_name || '', username: user?.username || '', bio: user?.bio || '' });
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  if (!user) { navigate('/login'); return null; }

  const handleFormChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePwChange = e => setPwForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const saveProfile = async e => {
    e.preventDefault(); setSaving(true); setMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { updateUser(data.user); setMsg({ type: 'success', text: '✅ Profile updated!' }); }
      else setMsg({ type: 'error', text: data.message || 'Update failed' });
    } catch { setMsg({ type: 'error', text: 'Network error' }); }
    finally { setSaving(false); }
  };

  const changePassword = async e => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm) { setMsg({ type: 'error', text: 'Passwords do not match' }); return; }
    setSaving(true); setMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/auth/change-password', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ current_password: pwForm.current_password, new_password: pwForm.new_password }) });
      const data = await res.json();
      if (data.success) { setMsg({ type: 'success', text: '✅ Password changed!' }); setPwForm({ current_password: '', new_password: '', confirm: '' }); }
      else setMsg({ type: 'error', text: data.message });
    } catch { setMsg({ type: 'error', text: 'Network error' }); }
    finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); navigate('/'); };
  const initials = (user.full_name || user.username || '?').slice(0, 2).toUpperCase();
  const memberDays = user.created_at ? Math.floor((Date.now() - new Date(user.created_at)) / 86400000) : 0;

  return (
    <div className="profile-page">
      <div className="orb orb1" /><div className="orb orb2" />
      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-avatar-ring" />
          </div>
          <div className="profile-name">{user.full_name || user.username}</div>
          <div className="profile-email">{user.email}</div>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          <div><span className={`badge badge-free`}>{user.role === 'admin' ? '👑 Admin' : '✅ Member'}</span></div>
          <div className="profile-stats">
            <div className="profile-stat"><span className="ps-num">{bookmarks.length}</span><span className="ps-label">Saved Tools</span></div>
            <div className="ps-sep" />
            <div className="profile-stat"><span className="ps-num">{memberDays || 'New'}</span><span className="ps-label">{memberDays ? 'Days Active' : 'Member'}</span></div>
            <div className="ps-sep" />
            <div className="profile-stat"><span className="ps-num">∞</span><span className="ps-label">Tools Access</span></div>
          </div>
          <nav className="profile-nav">
            <button className={tab === 'info' ? 'active' : ''} onClick={() => { setTab('info'); setMsg({ type: '', text: '' }); }}>👤 Edit Profile</button>
            <button className={tab === 'saved' ? 'active' : ''} onClick={() => { setTab('saved'); setMsg({ type: '', text: '' }); }}>
              🔖 Saved Tools {bookmarks.length > 0 && <span className="pnav-badge">{bookmarks.length}</span>}
            </button>
            <button className={tab === 'security' ? 'active' : ''} onClick={() => { setTab('security'); setMsg({ type: '', text: '' }); }}>🔐 Security</button>
            <button className={tab === 'prefs' ? 'active' : ''} onClick={() => { setTab('prefs'); setMsg({ type: '', text: '' }); }}>⚙️ Preferences</button>
          </nav>
          <button className="logout-btn" onClick={handleLogout}>🚪 Sign Out</button>
        </aside>

        <main className="profile-main">
          {msg.text && <div className={msg.type === 'success' ? 'auth-success' : 'auth-error'} style={{ marginBottom: 24 }}>{msg.text}</div>}

          {tab === 'info' && (
            <div className="profile-section">
              <h2 className="profile-section-title">Edit Profile</h2>
              <p className="profile-section-sub">Update your personal information</p>
              <form onSubmit={saveProfile} className="profile-form">
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" type="text" name="full_name" value={form.full_name} onChange={handleFormChange} placeholder="Your full name" /></div>
                  <div className="form-group"><label className="form-label">Username</label><input className="form-input" type="text" name="username" value={form.username} onChange={handleFormChange} placeholder="username" required /></div>
                </div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={user.email} disabled style={{ opacity: .5 }} /><span style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 4 }}>Email cannot be changed</span></div>
                <div className="form-group"><label className="form-label">Bio</label><textarea className="form-input" name="bio" rows={3} value={form.bio} onChange={handleFormChange} placeholder="Tell us about yourself…" style={{ resize: 'vertical' }} /></div>
                <button className="btn-primary" type="submit" disabled={saving} style={{ maxWidth: 200 }}>{saving ? <span className="spinner" /> : 'Save Changes'}</button>
              </form>
            </div>
          )}

          {tab === 'saved' && (
            <div className="profile-section">
              <h2 className="profile-section-title">🔖 Saved Tools</h2>
              <p className="profile-section-sub">{bookmarks.length} tools in your collection</p>
              {bookmarks.length === 0 ? (
                <div className="saved-empty-inline"><div style={{ fontSize: 48, marginBottom: 12 }}>📌</div><p>No saved tools yet. Click the 📌 button on any tool card to save it here.</p><Link to="/" className="browse-link">Browse AI Tools →</Link></div>
              ) : (
                <div className="profile-bookmarks-grid">
                  {bookmarks.map(t => (
                    <div key={t.n} className="profile-bookmark-card">
                      <img className="pb-logo" src={getLogo(t.url)} alt={t.n} onError={e => e.target.style.display = 'none'} />
                      <div className="pb-info"><span className="pb-name">{t.n}</span><span className="pb-cat">{t.cat}</span></div>
                      <div className="pb-actions">
                        <a href={t.url} target="_blank" rel="noopener noreferrer" className="pb-visit">Visit →</a>
                        <button className="pb-remove" onClick={() => toggle(t)} title="Remove">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'security' && (
            <div className="profile-section">
              <h2 className="profile-section-title">Security</h2>
              <p className="profile-section-sub">Change your password</p>
              <form onSubmit={changePassword} className="profile-form">
                <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" name="current_password" value={pwForm.current_password} onChange={handlePwChange} placeholder="••••••••" required /></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" name="new_password" value={pwForm.new_password} onChange={handlePwChange} placeholder="Min 6 characters" required /></div>
                  <div className="form-group"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" name="confirm" value={pwForm.confirm} onChange={handlePwChange} placeholder="Repeat password" required /></div>
                </div>
                <button className="btn-primary" type="submit" disabled={saving} style={{ maxWidth: 220 }}>{saving ? <span className="spinner" /> : '🔐 Update Password'}</button>
              </form>
            </div>
          )}

          {tab === 'prefs' && (
            <div className="profile-section">
              <h2 className="profile-section-title">⚙️ Preferences</h2>
              <p className="profile-section-sub">Customize your experience</p>
              <div className="prefs-list">
                <div className="pref-item"><div className="pref-info"><span className="pref-label">{theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span><span className="pref-desc">Switch between dark and light theme</span></div><button className="pref-toggle-btn" onClick={toggleTheme}>{theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</button></div>
                <div className="pref-item"><div className="pref-info"><span className="pref-label">🔊 AI Voice</span><span className="pref-desc">Indian female voice reads tool details aloud</span></div><span className="pref-status">Active</span></div>
                <div className="pref-item"><div className="pref-info"><span className="pref-label">🔖 Saved Tools</span><span className="pref-desc">{bookmarks.length} tools saved locally in your browser</span></div><Link to="/saved" className="pref-link">View All →</Link></div>
                <div className="pref-item"><div className="pref-info"><span className="pref-label">🗺️ Onboarding Tour</span><span className="pref-desc">Reset the welcome tour for new feature overview</span></div><button className="pref-toggle-btn" onClick={() => { localStorage.removeItem('toured'); window.location.href = '/'; }}>Replay Tour</button></div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
