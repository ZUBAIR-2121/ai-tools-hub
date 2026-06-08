import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { bookmarks } = useBookmarks();
  const p = location.pathname;
  if (['/login','/register'].includes(p)) return null;

  return (
    <div className="mobile-bottom-nav">
      <div className="mbn-inner">
        <Link to="/" className={`mbn-btn${p==='/'?' active':''}`}>
          <span>🏠</span><span>Explore</span>
        </Link>
        <Link to="/roadmaps" className={`mbn-btn${p==='/roadmaps'?' active':''}`}>
          <span>🗺️</span><span>Roadmaps</span>
        </Link>
        <Link to="/compare" className={`mbn-btn${p==='/compare'?' active':''}`}>
          <span>🆚</span><span>Compare</span>
        </Link>
        <Link to="/saved" className={`mbn-btn${p==='/saved'?' active':''}`}>
          <span>🔖</span>
          <span>Saved{bookmarks.length>0?` (${bookmarks.length})`:''}</span>
        </Link>
        <Link to="/news" className={`mbn-btn${p==='/news'?' active':''}`}>
          <span>📰</span><span>News</span>
        </Link>
      </div>
    </div>
  );
}
