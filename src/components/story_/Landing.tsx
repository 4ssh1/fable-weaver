import React, { useState, useEffect } from 'react';
import type { Theme } from '../../consts';

type CardTilt = { rx: number; ry: number; transitioning: boolean };

export default function Landing({ THEMES, selectTheme }: {
  THEMES: Theme[];
  selectTheme: (theme: Theme, e: React.MouseEvent) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [cardTilts, setCardTilts] = useState<Record<string, CardTilt>>({});

  useEffect(() => {
    if (!searchQuery.trim()) {
      setDebouncedQuery('');
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Please enter a theme");
      return;
    }
    
    const customTheme: Theme = {
      id: `custom-${Date.now()}`,
      label: searchQuery, 
      teaser: 'A tale of your own making...',
      icon: '🔮',
      character: 'orb', 
      gradient: 'linear-gradient(135deg, rgba(20,10,30,0.9), rgba(10,20,40,0.9))',
      accent: '#928dab'
    };

    selectTheme(customTheme, e as unknown as React.MouseEvent);
  };

  const handleCardMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = -((e.clientY - cy) / (rect.height / 2)) * 15;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 15;
    setCardTilts((prev: Record<string, CardTilt>) => ({ ...prev, [id]: { rx, ry, transitioning: false } }));
  };

  const handleCardLeave = (id: string) => {
    setCardTilts((prev: Record<string, CardTilt>) => ({ ...prev, [id]: { rx: 0, ry: 0, transitioning: true } }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4" style={{background:'var(--obsidian)'}}>
      {/* Fog blobs */}
      <div className="absolute rounded-full blur-3xl opacity-20" style={{width:500,height:500,top:'-10%',left:'-10%',background:'radial-gradient(circle,rgba(201,146,42,0.4),transparent)',animation:'float 8s ease-in-out infinite'}} />
      <div className="absolute rounded-full blur-3xl opacity-20" style={{width:400,height:400,top:'40%',right:'-5%',background:'radial-gradient(circle,rgba(123,104,238,0.3),transparent)',animation:'float 11s ease-in-out infinite'}} />
      <div className="absolute rounded-full blur-3xl opacity-20" style={{width:350,height:350,bottom:'-5%',left:'30%',background:'radial-gradient(circle,rgba(32,178,170,0.3),transparent)',animation:'float 14s ease-in-out infinite'}} />

      {/* Title */}
      <div className="relative z-10 text-center">
        <h1 className="flex justify-center gap-1 md:gap-2">
          {'FABLE'.split('').map((ch,i) => (
            <span key={i} className="text-5xl md:text-8xl font-bold" style={{fontFamily:'var(--font-display)',color:'#d4a438',animation:`fade-up 0.6s ease both`,animationDelay:`${i*0.1}s`,textShadow:'0 0 40px rgba(201,146,42,0.5)'}}>{ch}</span>
          ))}
        </h1>
        <div className="mx-auto mt-4 h-px max-w-xs" style={{background:'#b8860b',animation:'draw-line 0.8s ease both',animationDelay:'0.7s'}} />
        <p className="mt-4 text-lg md:text-xl italic" style={{fontFamily:'var(--font-body)',color:'var(--parchment)',animation:'fade-up 0.6s ease both',animationDelay:'1s',opacity:0}}>Every choice writes your legend.</p>
      </div>

      {/* Search bar */}
      <div className="relative z-10 mt-12 w-full max-w-md" style={{animation:'fade-up 0.6s ease both',animationDelay:'1.1s',opacity:0}}>
        <div className="relative">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <svg className="absolute left-3.5 w-4 h-4 opacity-50 pointer-events-none" style={{color:'#d4a438'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a theme..."
              className="w-full rounded-xl border border-amber-800/50 bg-black/50 px-5 py-3 pl-11 pr-12 text-sm backdrop-blur-sm outline-none transition-all duration-300 focus:border-amber-500/80 focus:shadow-[0_0_20px_rgba(201,146,42,0.15)]"
              style={{fontFamily:'var(--font-body)',color:'var(--parchment)',caretColor:'#d4a438'}}
            />
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="absolute right-2 p-1.5 rounded-lg transition-all duration-300 hover:scale-110"
              style={{
                color: searchQuery.trim() ? '#d4a438' : 'rgba(212,164,56,0.3)',
                background: searchQuery.trim() ? 'rgba(212,164,56,0.1)' : 'transparent',
                cursor: searchQuery.trim() ? 'pointer' : 'default',
              }}
              aria-label="Summon theme"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          {error && <p className="text-red-400 mt-2 text-center text-sm">{error}</p>}
        </div>
      </div>
      {/* Theme cards */}
      <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-6">
        {isSearching ? (
          Array.from({length: 3}).map((_, i) => (
            <div key={`skel-${i}`}
              className="relative overflow-hidden rounded-xl border border-amber-900/30"
              style={{
                width:'clamp(180px,40vw,208px)', aspectRatio:'2/3',
                background:'linear-gradient(135deg, rgba(20,20,30,0.8), rgba(30,20,10,0.6))',
                animation:`fade-up 0.3s ease both`, animationDelay:`${i*0.1}s`,
              }}
            >
              <div className="flex flex-col items-center justify-center h-full px-3 py-6 gap-4">
                <div className="w-12 h-12 rounded-full" style={{background:'rgba(201,146,42,0.15)',animation:'pulse-glow 1.5s ease-in-out infinite'}} />
                <div className="w-24 h-3 rounded-full" style={{background:'rgba(201,146,42,0.12)',animation:'pulse-glow 1.5s ease-in-out infinite',animationDelay:'0.2s'}} />
                <div className="w-28 h-2 rounded-full" style={{background:'rgba(237,224,196,0.08)',animation:'pulse-glow 1.5s ease-in-out infinite',animationDelay:'0.4s'}} />
                <div className="w-20 h-2 rounded-full" style={{background:'rgba(237,224,196,0.06)',animation:'pulse-glow 1.5s ease-in-out infinite',animationDelay:'0.6s'}} />
              </div>
            </div>
          ))
        ) : (
          THEMES.filter(t => {
            if (!debouncedQuery.trim()) return true;
            const q = debouncedQuery.toLowerCase();
            return t.label.toLowerCase().includes(q) || t.teaser.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
          }).length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12" style={{animation:'fade-up 0.4s ease both'}}>
              <span className="text-3xl" style={{animation:'float 3s ease-in-out infinite'}}>🔮</span>
              <p className="text-sm italic" style={{fontFamily:'var(--font-body)',color:'rgba(237,224,196,0.5)'}}>Press enter to fetch...</p>
            </div>
          ) : (
            THEMES.filter(t => {
              if (!debouncedQuery.trim()) return true;
              const q = debouncedQuery.toLowerCase();
              return t.label.toLowerCase().includes(q) || t.teaser.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
            }).map((t,i) => {
              const tilt = cardTilts[t.id] || {rx:0,ry:0,transitioning:false};
              return (
                <div key={t.id}
                  className="relative overflow-hidden rounded-xl border border-amber-900/40 transition-all duration-300 hover:scale-105 hover:border-amber-500/60 cursor-pointer"
                  style={{
                    width:'clamp(180px,40vw,208px)', aspectRatio:'2/3', background:t.gradient,
                    transform:`perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                    transition: tilt.transitioning ? 'transform 0.4s ease' : 'transform 0.1s ease',
                    animation:`fade-up 0.5s ease both`, animationDelay:`${i*0.15}s`,
                    boxShadow: tilt.rx || tilt.ry ? '0 0 30px rgba(201,146,42,0.3)' : 'none',
                  }}
                  onMouseMove={(e) => handleCardMove(t.id, e)}
                  onMouseLeave={() => handleCardLeave(t.id)}
                  onClick={(e) => selectTheme(t, e)}
                >
                  <div className="flex flex-col items-center justify-center h-full px-3 py-6 relative z-10">
                    <span className="text-5xl" style={{animation:'pulse-glow 2s ease-in-out infinite'}}>{t.icon}</span>
                    <span className="mt-4 text-sm text-center font-bold" style={{fontFamily:'var(--font-display)',color:'#d4a438'}}>{t.label}</span>
                    <span className="mt-1 text-xs text-center italic" style={{fontFamily:'var(--font-body)',color:'rgba(237,224,196,0.7)'}}>{t.teaser}</span>
                  </div>
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div style={{position:'absolute',top:0,left:0,width:'40%',height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',transform:'skewX(-20deg)',animation:'shimmer 3s infinite',animationDelay:`${i*0.5}s`}} />
                  </div>
                </div>
              );
            })
          )
        )}
      </div>
    </div>
  );
}