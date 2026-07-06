import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../../context/BookmarkContext';
import ToolCard from '../../components/ToolCard';
import Modal from '../../components/Modal';
import Footer from '../../components/Footer';

export default function Saved() {
  const { bookmarks, toggle } = useBookmarks();
  const [selectedTool, setSelectedTool] = useState(null);

  return (
    <div className="saved-page">
      <div className="orb orb1" /><div className="orb orb2" />
      <div className="saved-container">
        <div className="saved-header">
          <h1 className="saved-title">🔖 Saved Tools</h1>
          <p className="saved-sub">{bookmarks.length} tools saved to your collection</p>
        </div>
        {bookmarks.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-icon">📌</div>
            <h3>No saved tools yet</h3>
            <p>Click the 📌 button on any tool card to save it here</p>
            <Link to="/" className="saved-browse-btn">Browse AI Tools →</Link>
          </div>
        ) : (
          <>
            <div className="saved-grid">
              {bookmarks.map(tool => (
                <ToolCard key={tool.n} tool={tool} onOpenModal={setSelectedTool} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <button className="clear-all-btn"
                onClick={() => { if (window.confirm('Clear all saved tools?')) bookmarks.forEach(b => toggle(b)); }}>
                🗑️ Clear All
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
      {selectedTool && <Modal tool={selectedTool} onClose={() => setSelectedTool(null)} />}
    </div>
  );
}
