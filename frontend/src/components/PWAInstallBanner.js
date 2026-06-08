import React, { useState, useEffect } from 'react';

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setPrompt(e); setShow(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!show || !prompt) return null;

  const install = async () => {
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setShow(false);
  };

  return (
    <div className="pwa-banner">
      <span style={{fontSize:28}}>📲</span>
      <div className="pwa-banner-text">
        <strong>Install AI Tools Hub</strong>
        Add to home screen for quick access — works offline!
      </div>
      <button className="pwa-install-btn" onClick={install}>Install</button>
      <button className="pwa-close-btn" onClick={() => setShow(false)}>✕</button>
    </div>
  );
}
