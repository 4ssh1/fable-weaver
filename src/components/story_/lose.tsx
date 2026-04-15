import { useState } from "react";

export function LoseScreen({choices,onRestart,onNewTheme}:{choices:string[];onRestart:(e:React.MouseEvent)=>void;onNewTheme:(e:React.MouseEvent)=>void}) {
  const [ashParticles] = useState(() => Array.from({length:40},(_,i) => ({
    id:i, left:Math.random()*100, drift:(Math.random()-0.5)*60, dur:3+Math.random()*4, delay:Math.random()*3, color:['#4b5563','#374151','#450a0a'][i%3], size:2+Math.random()*3,
  })));

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4" style={{background:'linear-gradient(135deg,#0f0505,#1a0808,#050505)'}}>
      {/* Ash */}
      {ashParticles.map(p => (
        <div key={p.id} className="absolute rounded-full" style={{left:`${p.left}%`,top:-20,width:p.size,height:p.size*2,background:p.color,['--drift' as string]:`${p.drift}px`,animation:`fall ${p.dur}s linear infinite`,animationDelay:`${p.delay}s`}} />
      ))}

      {/* Shield */}
      <div className="absolute" style={{top:'20%',left:'50%',transform:'translateX(-50%)'}}>
        <div className="relative" style={{width:112,height:128,background:'linear-gradient(to bottom,#1e293b,#0f172a)',clipPath:'polygon(50% 0%, 100% 20%, 100% 70%, 50% 100%, 0% 70%, 0% 20%)',border:'2px solid rgba(155,34,34,0.4)',animation:'flicker 3s ease-in-out infinite'}}>
          <div style={{position:'absolute',top:'20%',left:'45%',width:1,height:'60%',background:'rgba(155,34,34,0.6)',transform:'rotate(15deg)'}} />
          <div style={{position:'absolute',top:'30%',left:'55%',width:1,height:'50%',background:'rgba(155,34,34,0.4)',transform:'rotate(-25deg)'}} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center mt-[30vh] md:mt-[35vh]">
        <h1 className="text-4xl md:text-6xl font-bold" style={{fontFamily:'var(--font-display)',color:'#991b1b',animation:'flicker 4s ease-in-out infinite, fade-up 0.6s ease both'}}>YOUR STORY ENDS HERE...</h1>
        <p className="mt-4 text-xl italic" style={{fontFamily:'var(--font-body)',color:'rgba(237,224,196,0.5)',animation:'fade-up 0.5s ease both',animationDelay:'0.3s'}}>Fate is unforgiving.</p>

        <div className="mt-8 max-w-md mx-auto rounded-xl border p-6 text-left" style={{background:'rgba(80,10,10,0.3)',borderColor:'rgba(155,34,34,0.3)',animation:'fade-up 0.5s ease both',animationDelay:'0.6s'}}>
          <p className="text-xs uppercase tracking-wider mb-3" style={{fontFamily:'var(--font-display)',color:'#991b1b'}}>Your Path</p>
          {choices.map((c,i) => (
            <p key={i} className="text-sm mb-1" style={{fontFamily:'var(--font-body)',color:'rgba(237,224,196,0.5)'}}>• {c}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center" style={{animation:'fade-up 0.5s ease both',animationDelay:'0.9s'}}>
          <button onClick={onRestart} className="px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 hover:bg-red-800" style={{fontFamily:'var(--font-display)',background:'#7f1d1d',color:'var(--parchment)'}}>Try Again</button>
          <button onClick={onNewTheme} className="px-8 py-3 rounded-full text-sm border transition-all duration-300 hover:scale-105" style={{fontFamily:'var(--font-display)',borderColor:'rgba(155,34,34,0.5)',color:'#991b1b',background:'transparent'}}>Choose a New Fate</button>
        </div>
      </div>
    </div>
  );
}