export function HeroCharacter({accent}:{accent:string}) {
  return (
    <div className="relative flex flex-col items-center" style={{animation:'sway 3s ease-in-out infinite'}}>
      {/* Helmet */}
      <div style={{width:64,height:48,borderRadius:'9999px 9999px 4px 4px',background:'linear-gradient(to bottom,#94a3b8,#475569)',boxShadow:'0 4px 12px rgba(0,0,0,0.4)'}} />
      {/* Body */}
      <div className="relative" style={{width:80,height:96,background:'linear-gradient(to bottom,#64748b,#334155)',borderRadius:4,marginTop:4}}>
        {/* Shoulders */}
        <div style={{position:'absolute',top:0,left:-28,width:32,height:24,background:'#94a3b8',borderRadius:4}} />
        <div style={{position:'absolute',top:0,right:-28,width:32,height:24,background:'#94a3b8',borderRadius:4}} />
        {/* Cape */}
        <div style={{position:'absolute',top:16,left:'50%',transform:'translateX(-50%)',width:96,height:128,background:'linear-gradient(to bottom,#7f1d1d,#450a0a)',borderRadius:'0 0 12px 12px',zIndex:-1}} />
        {/* Accent glow */}
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:40,height:40,borderRadius:'50%',background:accent,filter:'blur(20px)',opacity:0.3}} />
      </div>
    </div>
  );
}