import { useState } from "react";

export function WinScreen({choices,onRestart,onNewTheme}:{choices:string[];onRestart:(e:React.MouseEvent)=>void;onNewTheme:(e:React.MouseEvent)=>void;accent:string}) {
  const [particles] = useState(() => Array.from({length:60},(_,i) => {
    const angle = Math.random()*Math.PI*2;
    const dist = 80+Math.random()*170;
    return {id:i, dx:Math.cos(angle)*dist, dy:Math.sin(angle)*dist, size:4+Math.random()*8, dur:0.6+Math.random()*0.6, hue:35+Math.random()*20};
  }));

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4" style={{background:'linear-gradient(135deg,#1a1200,#2a1f00,#0d0800)'}}>
      {/* Particles */}
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full" style={{top:'50%',left:'50%',width:p.size,height:p.size,background:`hsl(${p.hue},70%,50%)`,['--dx' as string]:`${p.dx}px`,['--dy' as string]:`${p.dy}px`,animation:`sparkle-out ${p.dur}s ease forwards`,animationDelay:`${Math.random()*0.3}s`}} />
      ))}

      {/* Crown */}
      <div className="absolute" style={{top:'18%',left:'50%',transform:'translateX(-50%)'}}>
        <div style={{width:128,height:80,background:'linear-gradient(to bottom,#d4a438,#b8860b)',clipPath:'polygon(0% 100%, 0% 50%, 20% 70%, 35% 10%, 50% 50%, 65% 10%, 80% 70%, 100% 50%, 100% 100%)',margin:'0 auto'}} />
        <div style={{position:'absolute',bottom:-10,left:'50%',transform:'translateX(-50%)',width:160,height:40,background:'#d4a438',filter:'blur(30px)',opacity:0.6,animation:'pulse-glow 2s ease-in-out infinite'}} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center mt-[30vh] md:mt-[35vh]">
        <h1 className="text-5xl md:text-8xl font-bold" style={{fontFamily:'var(--font-display)',color:'#d4a438',textShadow:'0 0 60px rgba(201,146,42,0.8)',animation:'fade-up 0.5s ease both',animationDelay:'0.2s'}}>VICTORY</h1>
        <p className="mt-4 text-xl italic" style={{fontFamily:'var(--font-body)',color:'rgba(237,224,196,0.8)',animation:'fade-up 0.5s ease both',animationDelay:'0.5s'}}>Your legend has been written.</p>

        {/* Recap */}
        <div className="mt-8 max-w-md mx-auto rounded-xl border p-6 text-left" style={{background:'rgba(60,40,10,0.6)',borderColor:'rgba(180,130,40,0.4)',animation:'fade-up 0.5s ease both',animationDelay:'0.8s'}}>
          <p className="text-xs uppercase tracking-wider mb-3" style={{fontFamily:'var(--font-display)',color:'#d4a438'}}>Your Path</p>
          {choices.map((c,i) => (
            <p key={i} className="text-sm mb-1" style={{fontFamily:'var(--font-body)',color:'rgba(237,224,196,0.7)'}}>• {c}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center" style={{animation:'fade-up 0.5s ease both',animationDelay:'1s'}}>
          <button onClick={onRestart} className="px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105" style={{fontFamily:'var(--font-display)',background:'#d4a438',color:'#0d0800',boxShadow:'0 0 20px rgba(201,146,42,0.4)'}}>Begin a New Tale</button>
          <button onClick={onNewTheme} className="px-8 py-3 rounded-full text-sm border transition-all duration-300 hover:scale-105" style={{fontFamily:'var(--font-display)',borderColor:'#b8860b',color:'#d4a438',background:'transparent'}}>Choose Another Theme</button>
        </div>
      </div>
    </div>
  );
}