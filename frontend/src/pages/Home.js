import React, { useState, useEffect, useRef } from 'react';
import { ALL_DATA as DATA, allToolsComplete as allTools } from '../data/toolsData';
import ToolCard from '../components/ToolCard';
import SkeletonCard from '../components/SkeletonCard';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot';
import OnboardingTour from '../components/OnboardingTour';
import './Home.css';

const MARQUEE_ITEMS = allTools.slice(0, 16);
const FILTERS = [
  { label: 'All Tools', type: 'all' },
  { label: '✅ Free Only', type: 'free' },
  { label: '💎 Paid Only', type: 'paid' },
  { label: '🔓 Free+Paid', type: 'both' },
];
const DIFF_FILTERS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const TOP10 = ['ChatGPT','Canva AI','CapCut','Claude AI','Midjourney','Suno AI','ElevenLabs','Krea AI','Leonardo AI','Cursor'];

const DIFFICULTY_MAP = {
  ChatGPT:'Beginner','Claude AI':'Beginner',Gemini:'Beginner',Grok:'Beginner',
  DeepSeek:'Beginner','Meta AI':'Beginner',Poe:'Beginner',CapCut:'Beginner',
  'Canva AI':'Beginner',Grammarly:'Beginner',Quillbot:'Beginner','Suno AI':'Beginner',
  'Adobe Podcast':'Beginner','Perplexity AI':'Beginner','NotebookLM':'Beginner',
  ElevenLabs:'Intermediate','Leonardo AI':'Intermediate',Gamma:'Intermediate',
  'Julius AI':'Intermediate','Tableau Public':'Beginner','Power BI':'Intermediate',
  'Invideo AI':'Beginner','Opus Clip':'Beginner','Kling AI':'Intermediate',
  Descript:'Intermediate','Jasper AI':'Intermediate','Copy.ai':'Beginner',
  'Bolt.new':'Intermediate',Framer:'Intermediate',Lovable:'Intermediate',
  'V0 by Vercel':'Intermediate','GitHub Copilot':'Advanced',Cursor:'Advanced',
  'Replit AI':'Intermediate',Windsurf:'Advanced',Midjourney:'Intermediate',
  'Adobe Firefly':'Intermediate',Ideogram:'Beginner',Sora:'Intermediate',
  'Surfer SEO':'Intermediate',Semrush:'Intermediate',HeyGen:'Beginner',
  Synthesia:'Beginner','D-ID':'Beginner','Murf AI':'Beginner','Notion AI':'Beginner',
  'Figma AI':'Advanced',Looka:'Beginner',Uizard:'Beginner',Tome:'Beginner',
  'Beautiful.ai':'Beginner','Predis AI':'Beginner','Hootsuite OwlyWriter':'Intermediate',
  'Originality AI':'Beginner','Undetectable AI':'Beginner','GPTZero':'Beginner',
  'AdCreative.ai':'Intermediate',
  // New tools
  'Dora AI':'Intermediate','Webflow AI':'Advanced','Softr':'Beginner',
  'Glide':'Beginner','Plasmic':'Advanced','Krea AI':'Beginner',
  'Magnific AI':'Intermediate','Clipdrop':'Beginner','Photoroom':'Beginner',
  'Pebblely':'Beginner','Rask AI':'Intermediate','Fliki':'Beginner',
  'Wondershare Filmora AI':'Beginner','Kaiber':'Intermediate',
  'Lalal.ai':'Beginner','Cleanvoice AI':'Beginner','Krisp':'Beginner',
  'Soundraw':'Beginner','Voicemod':'Beginner',
  'Pieces for Developers':'Intermediate','Phind':'Beginner',
  'Blackbox AI':'Beginner','Zed Editor':'Intermediate',
  'Rows':'Intermediate','Browse AI':'Beginner','Bardeen':'Beginner','Tango':'Beginner',
  'Neuronwriter':'Intermediate','Taplio':'Beginner','Postwise':'Beginner',
  'Reflect':'Intermediate','Taskade':'Beginner','Magical':'Beginner',
  'Octane AI':'Intermediate','Describely':'Beginner',
};

export default function Home() {
  const [searchQ, setSearchQ] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [activeDiff, setActiveDiff] = useState('All Levels');
  const [selectedTool, setSelectedTool] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState([]);
  const [showTop10, setShowTop10] = useState(false);
  const searchRef = useRef(null);

  // Simulate skeleton loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);



  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Filter tools — search across name, description, about, tips, category
  const filtered = DATA.map(cat => ({
    ...cat,
    tools: cat.tools
      .filter(t => activeType === 'all' || t.t === activeType)
      .filter(t => {
        if (activeDiff === 'All Levels') return true;
        return (DIFFICULTY_MAP[t.n] || 'Beginner') === activeDiff;
      })
      .filter(t => {
        if (!searchQ.trim()) return true;
        const q = searchQ.toLowerCase();
        return (
          t.n.toLowerCase().includes(q) ||
          t.d.toLowerCase().includes(q) ||
          (t.about||'').toLowerCase().includes(q) ||
          (t.tips||[]).some(tip => tip.toLowerCase().includes(q)) ||
          cat.title.toLowerCase().includes(q)
        );
      })
      .map(t => ({ ...t, icon: cat.icon, cat: cat.title })),
  })).filter(cat => cat.tools.length > 0);

  const toggleCompare = (toolName) => {
    setCompareList(prev =>
      prev.includes(toolName)
        ? prev.filter(n => n !== toolName)
        : prev.length < 3 ? [...prev, toolName] : prev
    );
  };

  const surpriseMe = () => {
    const t = allTools[Math.floor(Math.random() * allTools.length)];
    setSelectedTool({ ...t });
  };

  const top10Tools = allTools.filter(t => TOP10.includes(t.n));

  return (
    <>
      <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>

      <OnboardingTour />

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge"><span className="live-dot"/>✨ {allTools.length}+ AI Tools · 22+ Categories · Always Updated</div>
        <h1 className="hero-h1">
          <span className="line1">Learn, Master &</span>
          <span className="grad-text"> Explore Every AI Tool</span>
        </h1>
        <p className="hero-sub">The ultimate free directory of AI tools with step-by-step guides, Hindi tutorials, and pro tips.</p>
        <div className="search-wrap" id="hero-search">
          <span className="search-icon">🔍</span>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search ChatGPT, Midjourney, Sora, ElevenLabs…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
          {searchQ && <button className="search-clear" onClick={() => setSearchQ('')}>✕</button>}
        </div>
        {searchQ && (
          <div className="search-result-count">
            {filtered.reduce((a,c)=>a+c.tools.length,0)} tools found for "<strong>{searchQ}</strong>"
          </div>
        )}
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">{allTools.length}+</span><span className="stat-label">AI Tools</span></div>
          <div className="stat-sep"/>
          <div className="stat"><span className="stat-num">{DATA.length}</span><span className="stat-label">Categories</span></div>
          <div className="stat-sep"/>
          <div className="stat"><span className="stat-num">100%</span><span className="stat-label">Free Access</span></div>
          <div className="stat-sep"/>
          <div className="stat"><span className="stat-num">Hindi</span><span className="stat-label">Tutorials</span></div>
        </div>      </section>

      {/* MARQUEE */}
      <section className="marquee-section">
        <div className="marquee-inner">
          {[...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((t,i) => (
            <div className="marquee-item" key={i}>
              <span style={{fontSize:16}}>{t.icon}</span>
              <span className="m-name">{t.n}</span>
              <span className={`badge badge-${t.t} m-type`}>{t.t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WEEKLY TOP 10 */}
      <div className="top10-section">
        <button className="top10-toggle" onClick={() => setShowTop10(s=>!s)}>
          🏆 Weekly Top 10 AI Tools {showTop10?'▲':'▼'}
        </button>
        {showTop10 && (
          <div className="top10-grid">
            {top10Tools.map((t,i) => (
              <div className="top10-item" key={t.n} onClick={() => setSelectedTool(t)}>
                <span className="top10-rank">#{i+1}</span>
                <img className="top10-logo" src={`https://www.google.com/s2/favicons?domain=${new URL(t.url).hostname}&sz=32`} alt={t.n} onError={e=>e.target.style.display='none'}/>
                <div className="top10-info">
                  <span className="top10-name">{t.n}</span>
                  <span className="top10-cat">{t.cat}</span>
                </div>
                <span className={`badge badge-${t.t}`}>{t.t}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="filter-section" id="categories">
        <div className="filter-inner">
          {FILTERS.map(f => (
            <button key={f.type} className={`fbtn${activeType===f.type?' active':''}`} onClick={() => setActiveType(f.type)}>{f.label}</button>
          ))}
          <div className="filter-sep"/>
          {DIFF_FILTERS.map(d => (
            <button key={d} className={`fbtn diff-btn${activeDiff===d?' active':''}${d==='Beginner'?' diff-beg':d==='Intermediate'?' diff-int':d==='Advanced'?' diff-adv':''}`} onClick={() => setActiveDiff(d)}>{d}</button>
          ))}
          <div className="filter-sep"/>
          <button className="fbtn surprise-btn" onClick={surpriseMe}>🎲 Surprise Me</button>
          {DATA.map(cat => (
            <button key={cat.title} className="fbtn cat-chip" onClick={() => {
              const el = document.getElementById('cat-'+cat.title.replace(/\s/g,'-'));
              if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
            }}>{cat.icon} {cat.title.split(' ')[0]}</button>
          ))}
        </div>
      </div>

      {/* Compare bar */}
      {compareList.length > 0 && (
        <div className="compare-bar">
          <span className="compare-bar-label">🆚 Comparing: {compareList.join(' vs ')}</span>
          <a href="/compare" className="compare-go-btn">Compare Now →</a>
          <button className="compare-clear-btn" onClick={() => setCompareList([])}>Clear</button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="main">
        {loading ? (
          Array.from({length:3}).map((_,ci) => (
            <section className="section" key={ci}>
              <div className="sec-header">
                <div className="sec-icon-wrap skeleton" style={{width:44,height:44,borderRadius:12}}/>
                <div className="skeleton" style={{width:200,height:20,borderRadius:8}}/>
              </div>
              <div className="grid">
                {Array.from({length:4}).map((_,i) => <SkeletonCard key={i}/>)}
              </div>
            </section>
          ))
        ) : filtered.length === 0 ? (
          <div className="no-results">
            <h3>🔍 No tools found for "{searchQ}"</h3>
            <p>Try searching: ChatGPT, video, free, beginner…</p>
            <button className="btn-primary" style={{maxWidth:200,marginTop:16}} onClick={() => { setSearchQ(''); setActiveType('all'); setActiveDiff('All Levels'); }}>Clear Filters</button>
          </div>
        ) : (
          filtered.map(cat => (
            <section key={cat.title} className="section" id={'cat-'+cat.title.replace(/\s/g,'-')}>
              <div className="sec-header">
                <div className="sec-icon-wrap" style={{background:cat.color}}><span>{cat.icon}</span></div>
                <div className="sec-title-group">
                  <span className="sec-title">{cat.title}</span>
                  <span className="sec-tool-logos">
                    {cat.tools.slice(0,5).map(t => {
                      try {
                        const domain = new URL(t.url).hostname;
                        return <img key={t.n} className="sec-tool-logo" src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt={t.n} title={t.n} onError={e=>{e.target.style.display='none'}}/>;
                      } catch { return null; }
                    })}
                  </span>
                </div>
                <span className="sec-count">{cat.tools.length} tools</span>
              </div>
              <div className="grid">
                {cat.tools.map(tool => (
                  <ToolCard key={tool.n} tool={tool} onOpenModal={setSelectedTool} onCompare={toggleCompare} compareList={compareList}/>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <Footer />

      {showScroll && (
        <button className="scroll-top" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>↑</button>
      )}

      {selectedTool && <Modal tool={selectedTool} onClose={() => setSelectedTool(null)}/>}
      <AIChatbot/>
    </>
  );
}
