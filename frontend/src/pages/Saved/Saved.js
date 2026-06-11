import React, { useState } from 'react';
import { useBookmarks } from '../../context/BookmarkContext';
import ToolCard from '../../components/ToolCard';
import Modal from '../../components/Modal';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import './Saved.css';

export default function Saved() {
  const { bookmarks, toggle } = useBookmarks();
  const [selectedTool, setSelectedTool] = useState(null);

  return (
    <div className="saved-page">
      <div className="orb orb1"/><div className="orb orb2"/>
      <div className="saved-container">
        <div className="saved-header">
          <h1 className="saved-title">🔖 Saved Tools</h1>
          <p className="saved-sub">{bookmarks.length} tools saved to your collection</p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-icon">📌</div>
            <h3>No saved tools yet</h3>
            <p>Click the 📌 bookmark button on any tool card to save it here</p>
            <Link to="/" className="btn-primary" style={{maxWidth:220,display:'block',margin:'20px auto',textDecoration:'none',textAlign:'center',padding:'14px 28px',borderRadius:12}}>Browse AI Tools</Link>
          </div>
        ) : (
          <>
            <div className="saved-grid">
              {bookmarks.map(tool => (
                <ToolCard key={tool.n} tool={tool} onOpenModal={setSelectedTool}/>
              ))}
            </div>
            <div style={{textAlign:'center',marginTop:32}}>
              <button className="clear-all-btn" onClick={() => { if(window.confirm('Clear all saved tools?')) bookmarks.forEach(b=>toggle(b)); }}>
                🗑️ Clear All Saved Tools
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
      {selectedTool && <Modal tool={selectedTool} onClose={() => setSelectedTool(null)}/>}
    </div>
  );
}
