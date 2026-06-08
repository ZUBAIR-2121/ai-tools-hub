import React, { useState } from 'react';
import { allTools, getLogo } from '../../data/toolsData';
import Footer from '../../components/Footer';
import './Compare.css';

const DIFFICULTY = { ChatGPT:'Beginner','Claude AI':'Beginner',Gemini:'Beginner',Grok:'Beginner',DeepSeek:'Beginner','Meta AI':'Beginner',Poe:'Beginner',CapCut:'Beginner','Canva AI':'Beginner',Grammarly:'Beginner',Quillbot:'Beginner','Suno AI':'Beginner','Adobe Podcast':'Beginner','Perplexity AI':'Beginner','NotebookLM':'Beginner',ElevenLabs:'Intermediate','Leonardo AI':'Intermediate',Gamma:'Intermediate','Julius AI':'Intermediate','Tableau Public':'Beginner','Power BI':'Intermediate','Invideo AI':'Beginner','Opus Clip':'Beginner','Kling AI':'Intermediate',Descript:'Intermediate','Jasper AI':'Intermediate','Copy.ai':'Beginner','Bolt.new':'Intermediate',Framer:'Intermediate',Lovable:'Intermediate','V0 by Vercel':'Intermediate','GitHub Copilot':'Advanced',Cursor:'Advanced','Replit AI':'Intermediate',Windsurf:'Advanced',Midjourney:'Intermediate','Adobe Firefly':'Intermediate',Ideogram:'Beginner',Sora:'Intermediate','Surfer SEO':'Intermediate',Semrush:'Intermediate',HeyGen:'Beginner',Synthesia:'Beginner','D-ID':'Beginner','Murf AI':'Beginner','Notion AI':'Beginner','Figma AI':'Advanced',Looka:'Beginner',Uizard:'Beginner',Tome:'Beginner','Beautiful.ai':'Beginner','Predis AI':'Beginner','Hootsuite OwlyWriter':'Intermediate','Originality AI':'Beginner','Undetectable AI':'Beginner','GPTZero':'Beginner','AdCreative.ai':'Intermediate' };

export default function Compare() {
  const [selected, setSelected] = useState([null, null, null]);
  const [imgErrors, setImgErrors] = useState({});

  const setSlot = (idx, toolName) => {
    const updated = [...selected];
    updated[idx] = toolName ? allTools.find(t => t.n === toolName) : null;
    setSelected(updated);
  };

  const active = selected.filter(Boolean);

  const rows = [
    { label:'Type', fn: t => <span className={`badge badge-${t.t}`}>{t.t==='free'?'✅ Free':t.t==='paid'?'💎 Paid':'🔓 Free+Paid'}</span> },
    { label:'Difficulty', fn: t => <span className={`badge badge-${(DIFFICULTY[t.n]||'Beginner').toLowerCase()}`}>{DIFFICULTY[t.n]||'Beginner'}</span> },
    { label:'Category', fn: t => t.cat },
    { label:'Best For', fn: t => t.d.slice(0,60)+'…' },
    { label:'About', fn: t => (t.about||'').slice(0,80)+'…' },
    { label:'Steps', fn: t => `${(t.steps||[]).length} steps` },
    { label:'Hindi Tutorial', fn: t => t.yt?.[0] ? <a href={t.yt[0].url} target="_blank" rel="noopener noreferrer" style={{color:'var(--accent)',textDecoration:'none'}}>▶ Watch</a> : '—' },
    { label:'Visit', fn: t => <a href={t.url} target="_blank" rel="noopener noreferrer" style={{color:'var(--accent3)',textDecoration:'none',fontWeight:600}}>Open →</a> },
  ];

  return (
    <div className="compare-page">
      <div className="orb orb1"/><div className="orb orb2"/>
      <div className="compare-container">
        <h1 className="compare-title">🆚 Compare AI Tools</h1>
        <p className="compare-sub">Select up to 3 tools to compare side by side</p>

        {/* Selectors */}
        <div className="compare-selectors">
          {[0,1,2].map(idx => (
            <div key={idx} className="compare-slot">
              {selected[idx] ? (
                <div className="compare-slot-filled">
                  <img className="slot-logo" src={getLogo(selected[idx].url)} alt={selected[idx].n} onError={e=>e.target.style.display='none'}/>
                  <span className="slot-name">{selected[idx].n}</span>
                  <button className="slot-remove" onClick={() => setSlot(idx, null)}>✕</button>
                </div>
              ) : (
                <select className="slot-select" onChange={e => setSlot(idx, e.target.value)} value="">
                  <option value="">Select Tool {idx+1}</option>
                  {allTools.map(t => (
                    <option key={t.n} value={t.n} disabled={selected.some(s => s?.n===t.n)}>
                      {t.n} — {t.cat}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        {/* Comparison table */}
        {active.length >= 2 && (
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th className="compare-th-label">Feature</th>
                  {active.map(t => (
                    <th key={t.n} className="compare-th-tool">
                      <img src={getLogo(t.url)} alt={t.n} style={{width:28,height:28,borderRadius:6,objectFit:'contain',background:'var(--bg3)',padding:2}} onError={e=>e.target.style.display='none'}/>
                      <div style={{fontFamily:'var(--font-display)',fontSize:15,fontWeight:700}}>{t.n}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.label}>
                    <td className="compare-td-label">{row.label}</td>
                    {active.map(t => (
                      <td key={t.n} className="compare-td">{row.fn(t)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {active.length < 2 && (
          <div className="compare-empty">
            <div style={{fontSize:64,marginBottom:16}}>🆚</div>
            <h3>Select at least 2 tools to compare</h3>
            <p>Use the dropdowns above to pick the AI tools you want to compare</p>
          </div>
        )}
      </div>
      <Footer toolCount={allTools.length}/>
    </div>
  );
}
