import { useState, useEffect } from 'react';
import { LOADING_QUOTES } from '../../consts';
import type { Theme } from '../../consts';

export default function LoadingScreen({ selectedTheme, accentColor }: { selectedTheme: Theme|null; accentColor: string }) {
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState(0);

  useEffect(() => {
    setLoadingQuoteIndex(0);
    const iv = setInterval(() => {
      setLoadingQuoteIndex(p => (p + 1) % LOADING_QUOTES.length);
    }, 2500);
    return () => clearInterval(iv);
  }, [selectedTheme]);

  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center" style={{background: selectedTheme?.gradient || 'var(--obsidian)'}}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-full border-2" style={{width:256,height:256,borderColor:'rgba(212,164,56,0.4)',animation:'spin-slow 8s linear infinite',position:'absolute',top:-128,left:-128}} />
        <div className="rounded-full border-2" style={{width:192,height:192,borderColor:'rgba(212,164,56,0.3)',animation:'counter-spin 6s linear infinite',position:'absolute',top:-96,left:-96}} />
        <div className="rounded-full" style={{width:64,height:64,background:`radial-gradient(circle,${accentColor},transparent)`,boxShadow:`0 0 40px ${accentColor}`,animation:'pulse-glow 2s ease-in-out infinite',position:'absolute',top:-32,left:-32}} />

        {['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ'].map((r,i) => (
          <span key={i} className="absolute text-sm" style={{fontFamily:'var(--font-display)',color:'rgba(212,164,56,0.7)',top:0,left:0,animation:`rune-orbit-${i+1} ${4+i}s linear infinite`}}>{r}</span>
        ))}
      </div>

      <div className="absolute w-full text-center px-4" style={{bottom:'30%'}}>
        <p className="text-lg md:text-xl italic" style={{fontFamily:'var(--font-display)',color:'#d4a438',animation:'pulse-glow 2.5s ease-in-out infinite'}}>{LOADING_QUOTES[loadingQuoteIndex]}</p>
        <div className="flex gap-2 justify-center mt-4">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full" style={{background:'#d4a438',animation:`bounce-dot 0.8s ease-in-out infinite`,animationDelay:`${i*0.15}s`}} />
          ))}
        </div>
        <p className="mt-3 text-sm" style={{fontFamily:'var(--font-body)',color:'rgba(237,224,196,0.5)'}}>Summoning your story</p>
      </div>
    </div>
  );
}