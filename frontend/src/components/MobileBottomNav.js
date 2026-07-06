import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { bookmarks } = useBookmarks();
  const p = location.pathname;
  if (['/login', '/register'].includes(p)) return null;

  const items = [
    { to: '/',         icon: '🏠', label: 'Explore' },
    { to: '/roadmaps', icon: '🗺️', label: 'Roadmaps' },
    { to: '/compare',  icon: '🆚', label: 'Compare' },
    { to: '/saved',    icon: '🔖', label: bookmarks.length > 0 ? `Saved (${bookmarks.length})` : 'Saved' },
    { to: '/news',     icon: '📰', label: 'News' },
  ];

  return (
    <div className="mobile-bottom-nav">
      <div className="mbn-inner">
        {items.map(item => (
          <Link key={item.to} to={item.to} className={`mbn-btn${p === item.to ? ' active' : ''}`}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
