import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useBookmarks } from '../context/BookmarkContext';
import { allToolsComplete as allTools } from '../data/toolsData';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { bookmarks } = useBookmarks();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQ, setSearchQ] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef(null);
  const sugRef = useRef(null);

  // Scroll detection — navbar becomes glass when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Live search suggestions
  useEffect(() => {
    if (!searchQ.trim()) { setSuggestions([]); setShowSug(false); return; }
    const q = searchQ.toLowerCase();
    const results = allTools
      .filter(t => t.n.toLowerCase().includes(q) || t.d.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q))
      .slice(0, 6);
    setSuggestions(results);
    setShowSug(results.length > 0);
  }, [searchQ]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!sugRef.current?.contains(e.target) && !searchRef.current?.contains(e.target))
        setShowSug(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const goToTool = (tool) => {
    setSearchQ(''); setShowSug(false);
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('cat-' + tool.cat.replace(/\s/g, '-'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="nav-logo">
        <span className="logo-dot" />
        AI<span className="grad">Tools</span>Hub
      </Link>

      {/* Center nav links */}
      <div className="nav-links">
        <Link to="/"         className={location.pathname === '/'         ? 'active' : ''}>Explore</Link>
        <Link to="/roadmaps" className={location.pathname === '/roadmaps' ? 'active' : ''}>Roadmaps</Link>
        <Link to="/news"     className={location.pathname === '/news'     ? 'active' : ''}>AI News</Link>
        {user && (
          <Link to="/saved" className={location.pathname === '/saved' ? 'active' : ''}>
            Saved {bookmarks.length > 0 && <span className="nav-badge">{bookmarks.length}</span>}
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="nav-search-wrap" ref={searchRef}>
        <span className="nav-search-icon">🔍</span>
        <input
          className="nav-search-input"
          type="text"
          placeholder="Search any AI tool…"
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          onFocus={() => suggestions.length && setShowSug(true)}
        />
        {searchQ && (
          <button className="nav-search-clear" onClick={() => { setSearchQ(''); setShowSug(false); }}>✕</button>
        )}
        {showSug && (
          <div className="nav-suggestions" ref={sugRef}>
            {suggestions.map(t => (
              <div className="nav-sug-item" key={t.n} onClick={() => goToTool(t)}>
                <img
                  className="sug-logo"
                  src={`https://www.google.com/s2/favicons?domain=${new URL(t.url).hostname}&sz=32`}
                  alt={t.n}
                  onError={e => e.target.style.display = 'none'}
                />
                <div className="sug-info">
                  <span className="sug-name">{t.n}</span>
                  <span className="sug-cat">{t.cat}</span>
                </div>
                <span className={`badge badge-${t.t}`}>{t.t}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="nav-actions">
        <button className="theme-toggle" onClick={toggle} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {user ? (
          <div className="nav-user">
            <Link to="/profile" className="nav-avatar">
              {(user.username || 'U').slice(0, 1).toUpperCase()}
            </Link>
            <button className="nav-cta outline" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="nav-auth-btns">
            <Link to="/login"    className="nav-link-btn">Sign In</Link>
            <Link to="/register" className="nav-cta">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
