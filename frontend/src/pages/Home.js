import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ALL_DATA, allToolsComplete as allTools, getLogo } from '../data/toolsData';
import ToolCard from '../components/ToolCard';
import Modal from '../components/Modal';
import SkeletonCard from '../components/SkeletonCard';
import AIChatbot from '../components/AIChatbot';
import OnboardingTour from '../components/OnboardingTour';
import Footer from '../components/Footer';
import VideoBackground from '../components/VideoBackground';
import './Home.css';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

const CATS = ['All', ...ALL_DATA.map(c => c.title)];
const DIFFICULTY_FILTERS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const TYPE_FILTERS = ['All Types', 'free', 'paid', 'both'];

export default function Home() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [activeDiff, setActiveDiff] = useState('All Levels');
  const [activeType, setActiveType] = useState('All Types');
  const [selectedTool, setSelectedTool] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showTop10, setShowTop10] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  const searchRef = useRef(null);

  // Simulate loading
  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  // Scroll to top button
  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const DIFFICULTY_MAP = {
    ChatGPT:'Beginner','Claude AI':'Beginner',Gemini:'Beginner',Grok:'Beginner',DeepSeek:'Beginner','Meta AI':'Beginner',Poe:'Beginner',CapCut:'Beginner','Canva AI':'Beginner',Grammarly:'Beginner',Quillbot:'Beginner','Suno AI':'Beginner','Adobe Podcast':'Beginner','Perplexity AI':'Beginner','NotebookLM':'Beginner',ElevenLabs:'Intermediate','Leonardo AI':'Intermediate',Gamma:'Intermediate','Julius AI':'Intermediate','Tableau Public':'Beginner','Power BI':'Intermediate','Invideo AI':'Beginner','Opus Clip':'Beginner','Kling AI':'Intermediate',Descript:'Intermediate','Jasper AI':'Intermediate','Copy.ai':'Beginner','Bolt.new':'Intermediate',Framer:'Intermediate',Lovable:'Intermediate','V0 by Vercel':'Intermediate','GitHub Copilot':'Advanced',Cursor:'Advanced','Replit AI':'Intermediate',Windsurf:'Advanced',Midjourney:'Intermediate','Adobe Firefly':'Intermediate',Ideogram:'Beginner',Sora:'Intermediate','Surfer SEO':'Intermediate',Semrush:'Intermediate',HeyGen:'Beginner',Synthesia:'Beginner','D-ID':'Beginner','Murf AI':'Beginner','Notion AI':'Beginner','Figma AI':'Advanced',Looka:'Beginner',Uizard:'Beginner',Tome:'Beginner','Beautiful.ai':'Beginner','Predis AI':'Beginner','Hootsuite OwlyWriter':'Intermediate','Originality AI':'Beginner','Undetectable AI':'Beginner','GPTZero':'Beginner','AdCreative.ai':'Intermediate',
  };

  const filterTools = (tools) => {
    return tools.filter(t => {
      const q = query.toLowerCase();
      const matchQ = !q || t.n.toLowerCase().includes(q) || t.d.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q);
      const matchD = activeDiff === 'All Levels' || (DIFFICULTY_MAP[t.n] || 'Beginner') === activeDiff;
      const matchT = activeType === 'All Types' || t.t === activeType;
      return matchQ && matchD && matchT;
    });
  };

  const handleCompare = (toolName) => {
    setCompareList(prev => {
      if (prev.includes(toolName)) return prev.filter(n => n !== toolName);
      if (prev.length >= 3) return prev;
      return [...prev, toolName];
    });
  };

  const TOP_10 = allTools.slice(0, 10);
  const filteredTotal = filterTools(allTools).length;

  const sections = activeCat === 'All'
    ? ALL_DATA.map(cat => ({ ...cat, filtered: filterTools(cat.tools.map(t => ({ ...t, cat: cat.title, icon: cat.icon }))) })).filter(s => s.filtered.length > 0)
    : ALL_DATA.filter(c => c.title === activeCat).map(cat => ({ ...cat, filtered: filterTools(cat.tools.map(t => ({ ...t, cat: cat.title, icon: cat.icon }))) }));

  return (
    <div className="home-page">
      {/* Cinematic video background */}
      <VideoBackground src={VIDEO_URL} />

      {/* Ambient orbs */}
      <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-badge"><span className="live-dot" />150+ AI Tools · Always Free</div>

        <h1 className="hero-h1">
          <span>Discover every</span>
          <span className="grad-word"> AI tool</span>
          <span> that matters.</span>
        </h1>

        <p className="hero-sub">
          The complete directory of AI tools for creators, developers and students. Learn, compare and master them all.
        </p>

        {/* Search */}
        <div className="search-wrap" ref={searchRef}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search 150+ AI tools by name or category…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && <button className="search-clear" onClick={() => setQuery('')}>✕</button>}
        </div>

        {query && (
          <div className="search-result-count">
            <strong>{filteredTotal}</strong> tools found for "{query}"
          </div>
        )}

        {/* Stats */}
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">150+</span><span className="stat-label">AI Tools</span></div>
          <div className="stat-sep" />
          <div className="stat"><span className="stat-num">22+</span><span className="stat-label">Categories</span></div>
          <div className="stat-sep" />
          <div className="stat"><span className="stat-num">100%</span><span className="stat-label">Free Access</span></div>
          <div className="stat-sep" />
          <div className="stat"><span className="stat-num">🎙️</span><span className="stat-label">Voice Narration</span></div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <div className="marquee-section">
        <div className="marquee-inner">
          {[...allTools.slice(0, 20), ...allTools.slice(0, 20)].map((t, i) => (
            <div className="marquee-item" key={i}>
              <img src={getLogo(t.url)} alt={t.n} style={{ width: 16, height: 16, borderRadius: 3 }} onError={e => e.target.style.display = 'none'} />
              <span className="m-name">{t.n}</span>
              <span className="m-type">{t.icon}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TOP 10 ─── */}
      <div className="top10-section">
        <button className="top10-toggle" onClick={() => setShowTop10(s => !s)}>
          {showTop10 ? '▲' : '▼'} &nbsp; 🏆 Top 10 Most Popular AI Tools
        </button>
        {showTop10 && (
          <div className="top10-grid">
            {TOP_10.map((t, i) => (
              <div className="top10-item" key={t.n} onClick={() => setSelectedTool(t)}>
                <span className="top10-rank">{i + 1}</span>
                <img className="top10-logo" src={getLogo(t.url)} alt={t.n} onError={e => e.target.style.display = 'none'} />
                <div className="top10-info">
                  <span className="top10-name">{t.n}</span>
                  <span className="top10-cat">{t.cat}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── FILTER BAR ─── */}
      <div className="filter-section">
        <div className="filter-inner">
          {CATS.map(c => (
            <button key={c} className={`fbtn${activeCat === c ? ' active' : ''}`} onClick={() => setActiveCat(c)}>
              {c === 'All' ? '✨ All Tools' : c}
            </button>
          ))}
          <div className="filter-sep" />
          {TYPE_FILTERS.map(f => (
            <button key={f} className={`fbtn${activeType === f ? ' active' : ''}`} onClick={() => setActiveType(f)}>
              {f === 'All Types' ? '🔓 All Types' : f === 'free' ? '✅ Free' : f === 'paid' ? '💎 Paid' : '🔓 Free+Paid'}
            </button>
          ))}
          <div className="filter-sep" />
          {DIFFICULTY_FILTERS.map(d => (
            <button
              key={d}
              className={`fbtn diff-btn${d !== 'All Levels' ? ` diff-${d.toLowerCase().slice(0, 3)}` : ''}${activeDiff === d ? ' active' : ''}`}
              onClick={() => setActiveDiff(d)}
            >
              {d}
            </button>
          ))}
          <div className="filter-sep" />
          <button
            className="fbtn surprise-btn"
            onClick={() => {
              const r = allTools[Math.floor(Math.random() * allTools.length)];
              setSelectedTool(r);
            }}
          >
            🎲 Surprise Me
          </button>
        </div>
      </div>

      {/* ─── COMPARE BAR ─── */}
      {compareList.length > 0 && (
        <div className="compare-bar">
          <span className="compare-bar-label">🆚 Comparing: {compareList.join(' vs ')}</span>
          <a className="compare-go-btn" href="/compare">Open Compare →</a>
          <button className="compare-clear-btn" onClick={() => setCompareList([])}>Clear</button>
        </div>
      )}

      {/* ─── MAIN GRID ─── */}
      <main className="main">
        {loading ? (
          <div className="grid">
            {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : sections.length === 0 ? (
          <div className="no-results">
            <h3>No tools found 😔</h3>
            <p>Try a different search term or clear the filters</p>
          </div>
        ) : (
          sections.map(sec => (
            <div className="section" key={sec.title} id={`cat-${sec.title.replace(/\s/g, '-')}`}>
              <div className="sec-header">
                <div className="sec-icon-wrap">{sec.icon}</div>
                <div className="sec-title-group">
                  <h2 className="sec-title">{sec.title}</h2>
                  <div className="sec-tool-logos">
                    {sec.filtered.slice(0, 8).map(t => (
                      <img key={t.n} className="sec-tool-logo" src={getLogo(t.url)} alt={t.n} onError={e => e.target.style.display = 'none'} />
                    ))}
                  </div>
                </div>
                <span className="sec-count">{sec.filtered.length} tools</span>
              </div>
              <div className="grid">
                {sec.filtered.map(tool => (
                  <ToolCard
                    key={tool.n}
                    tool={tool}
                    onOpenModal={setSelectedTool}
                    onCompare={handleCompare}
                    compareList={compareList}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      <Footer />

      {selectedTool && <Modal tool={selectedTool} onClose={() => setSelectedTool(null)} />}
      <AIChatbot />
      <OnboardingTour />
      {showScroll && (
        <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
      )}
    </div>
  );
}
