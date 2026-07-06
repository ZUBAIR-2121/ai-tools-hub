import React, { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bookmarks') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggle = (tool) => {
    setBookmarks(prev =>
      prev.find(b => b.n === tool.n) ? prev.filter(b => b.n !== tool.n) : [...prev, tool]
    );
  };

  const isBookmarked = (toolName) => bookmarks.some(b => b.n === toolName);

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggle, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);
