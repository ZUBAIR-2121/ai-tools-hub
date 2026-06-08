import React, { useState } from 'react';
import Footer from '../../components/Footer';
import { allTools, getLogo } from '../../data/toolsData';
import './Roadmaps.css';

const ROADMAPS = [
  {
    id:'content', emoji:'🎬', title:'Become a Content Creator with AI',
    desc:'Master AI tools to create viral videos, thumbnails, music, and social media content.',
    steps:[
      { step:1, tool:'CapCut', desc:'Start with AI video editing — auto-captions, templates, background removal.' },
      { step:2, tool:'Canva AI', desc:'Design thumbnails, posts, and brand visuals with AI assistance.' },
      { step:3, tool:'Suno AI', desc:'Generate royalty-free background music for your videos instantly.' },
      { step:4, tool:'ElevenLabs', desc:'Create professional AI voiceovers in Hindi and English.' },
      { step:5, tool:'Invideo AI', desc:'Turn scripts into fully edited YouTube videos automatically.' },
      { step:6, tool:'Opus Clip', desc:'Repurpose long videos into viral Reels and Shorts automatically.' },
      { step:7, tool:'Predis AI', desc:'Generate complete social media posts with captions and hashtags.' },
    ]
  },
  {
    id:'developer', emoji:'💻', title:'Learn AI for Coding & Development',
    desc:'Use AI tools to code faster, debug smarter, and build full apps without struggling.',
    steps:[
      { step:1, tool:'ChatGPT', desc:'Learn to ask AI to explain code, fix errors, and write functions.' },
      { step:2, tool:'Replit AI', desc:'Practice coding in the browser with AI assistance — no setup needed.' },
      { step:3, tool:'GitHub Copilot', desc:'Install Copilot in VS Code for AI autocomplete while you code.' },
      { step:4, tool:'Cursor', desc:'Switch to Cursor for full codebase AI chat and multi-file edits.' },
      { step:5, tool:'Windsurf', desc:'Use agentic AI to plan and build complete features automatically.' },
      { step:6, tool:'V0 by Vercel', desc:'Generate beautiful React UI components from text descriptions.' },
      { step:7, tool:'Bolt.new', desc:'Build and deploy full-stack web apps from a single description.' },
    ]
  },
  {
    id:'designer', emoji:'🎨', title:'Master AI for Design & Visuals',
    desc:'Create stunning graphics, logos, UI mockups, and AI images like a professional designer.',
    steps:[
      { step:1, tool:'Canva AI', desc:'Start with Canva for social media graphics, presentations, and posters.' },
      { step:2, tool:'Ideogram', desc:'Generate images with accurate text — perfect for logos and posters.' },
      { step:3, tool:'Leonardo AI', desc:'Create stunning AI images with 150 free credits daily.' },
      { step:4, tool:'Looka', desc:'Design a professional AI logo and complete brand identity.' },
      { step:5, tool:'Adobe Firefly', desc:'Create commercially safe AI images inside Photoshop and Illustrator.' },
      { step:6, tool:'Midjourney', desc:'Level up to Midjourney for the highest quality AI artwork.' },
      { step:7, tool:'Figma AI', desc:'Design professional UI/UX with the industry standard design tool.' },
    ]
  },
  {
    id:'marketer', emoji:'🔍', title:'Grow with AI Digital Marketing',
    desc:'Use AI to rank on Google, create viral content, and run high-converting ad campaigns.',
    steps:[
      { step:1, tool:'Grammarly AI', desc:'Install Grammarly for error-free professional communication everywhere.' },
      { step:2, tool:'ChatGPT', desc:'Use ChatGPT to brainstorm content ideas and write first drafts fast.' },
      { step:3, tool:'Quillbot', desc:'Paraphrase and improve your content with 8 different writing modes.' },
      { step:4, tool:'Semrush', desc:'Research keywords and spy on competitors using Semrush free plan.' },
      { step:5, tool:'Surfer SEO', desc:'Optimize blog content to rank on Google page 1 with Surfer SEO.' },
      { step:6, tool:'Predis AI', desc:'Automate social media content creation across all platforms.' },
      { step:7, tool:'AdCreative.ai', desc:'Generate high-converting ad creatives with AI trained on millions of ads.' },
    ]
  },
  {
    id:'student', emoji:'📚', title:'AI Toolkit for Students',
    desc:'Study smarter, write better assignments, research faster, and learn anything with AI.',
    steps:[
      { step:1, tool:'ChatGPT', desc:'Ask ChatGPT to explain any topic in simple language with examples.' },
      { step:2, tool:'Perplexity AI', desc:'Research topics with cited sources — much better than Google for study.' },
      { step:3, tool:'NotebookLM', desc:'Upload your textbooks and notes — AI answers questions from them directly.' },
      { step:4, tool:'Quillbot', desc:'Improve your assignment writing and paraphrase complex content.' },
      { step:5, tool:'Grammarly AI', desc:'Fix grammar, improve clarity, and check tone before submitting.' },
      { step:6, tool:'Gamma', desc:'Create stunning AI presentations for college projects in 60 seconds.' },
      { step:7, tool:'Notion AI', desc:'Organize all your study notes with AI summaries and action items.' },
    ]
  },
  {
    id:'entrepreneur', emoji:'🚀', title:'Build Your Business with AI',
    desc:'Launch a startup, create content, build websites, and scale your brand using AI.',
    steps:[
      { step:1, tool:'ChatGPT', desc:'Use AI to validate your business idea, write a business plan, and research market.' },
      { step:2, tool:'Looka', desc:'Create a professional logo and brand identity in minutes.' },
      { step:3, tool:'Framer', desc:'Build a beautiful website for your business without any coding skills.' },
      { step:4, tool:'HeyGen', desc:'Create professional AI spokesperson videos for your product or service.' },
      { step:5, tool:'Jasper AI', desc:'Generate all your marketing content — ads, emails, and landing pages.' },
      { step:6, tool:'Semrush', desc:'Research SEO keywords and plan your content marketing strategy.' },
      { step:7, tool:'Notion AI', desc:'Manage your entire business operations and projects with AI assistance.' },
    ]
  },
];

export default function Roadmaps() {
  const [active, setActive] = useState(null);

  return (
    <div className="roadmaps-page">
      <div className="orb orb1"/><div className="orb orb2"/>
      <div className="roadmaps-container">
        <div className="roadmaps-hero">
          <h1 className="roadmaps-title">🗺️ AI Learning Roadmaps</h1>
          <p className="roadmaps-sub">Curated step-by-step paths to master AI tools for your specific goal. Pick your path and start today.</p>
        </div>

        <div className="roadmaps-grid">
          {ROADMAPS.map(rm => (
            <div key={rm.id} className={`roadmap-card${active===rm.id?' open':''}`}>
              <div className="roadmap-card-head" onClick={() => setActive(active===rm.id?null:rm.id)}>
                <div className="roadmap-emoji">{rm.emoji}</div>
                <div className="roadmap-info">
                  <h3 className="roadmap-card-title">{rm.title}</h3>
                  <p className="roadmap-card-desc">{rm.desc}</p>
                </div>
                <div className="roadmap-meta">
                  <span className="roadmap-steps-count">{rm.steps.length} steps</span>
                  <span className="roadmap-chevron">{active===rm.id?'▲':'▼'}</span>
                </div>
              </div>

              {active === rm.id && (
                <div className="roadmap-steps-list">
                  {rm.steps.map((s, idx) => {
                    const tool = allTools.find(t => t.n === s.tool);
                    return (
                      <div key={idx} className="roadmap-step">
                        <div className="roadmap-step-num">{s.step}</div>
                        <div className="roadmap-step-connector"/>
                        <div className="roadmap-step-content">
                          <div className="roadmap-step-tool-row">
                            {tool && (
                              <img src={getLogo(tool.url)} alt={s.tool} className="roadmap-step-logo" onError={e=>e.target.style.display='none'}/>
                            )}
                            <span className="roadmap-step-tool">{s.tool}</span>
                            {tool && <span className={`badge badge-${tool.t}`}>{tool.t==='free'?'✅ Free':tool.t==='paid'?'💎 Paid':'🔓 Free+'}</span>}
                          </div>
                          <p className="roadmap-step-desc">{s.desc}</p>
                          {tool && (
                            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="roadmap-step-link">
                              Open {s.tool} →
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer toolCount={0}/>
    </div>
  );
}
