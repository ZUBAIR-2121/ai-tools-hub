import React, { useState, useEffect } from 'react';

const STEPS = [
  { emoji: '🔍', title: 'Search Any AI Tool', desc: 'Type a tool name, category, or use case in the search bar to instantly find what you need.' },
  { emoji: '🔖', title: 'Save Your Favorites', desc: 'Click the 📌 bookmark button on any tool card to save it to your personal collection.' },
  { emoji: '🔊', title: 'Listen to Tool Details', desc: 'Click the 🔊 button on any card to hear a spoken summary of the tool — great for quick learning!' },
  { emoji: '🆚', title: 'Compare Tools Side by Side', desc: 'Click the 🆚 button on up to 3 tools and compare them in detail — features, pricing, and more.' },
  { emoji: '🤖', title: 'AI Assistant is Here!', desc: 'The floating button in the bottom-right is your AI assistant — ask it anything about AI tools.' },
];

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('toured')) {
      setTimeout(() => setVisible(true), 1500);
    }
  }, []);

  const finish = () => { localStorage.setItem('toured', '1'); setVisible(false); };

  if (!visible) return null;

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="tour-overlay">
      <div className="tour-card">
        <div className="tour-progress">
          {STEPS.map((_, i) => <div key={i} className={`tour-dot${i === step ? ' active' : i < step ? ' done' : ''}`} />)}
        </div>
        <div className="tour-emoji">{s.emoji}</div>
        <h3 className="tour-title">{s.title}</h3>
        <p className="tour-desc">{s.desc}</p>
        <div className="tour-actions">
          <button className="tour-skip" onClick={finish}>Skip Tour</button>
          <button className="tour-next" onClick={() => isLast ? finish() : setStep(s => s + 1)}>
            {isLast ? '🚀 Get Started' : 'Next →'}
          </button>
        </div>
        <div className="tour-step-count">{step + 1} of {STEPS.length}</div>
      </div>
    </div>
  );
}
