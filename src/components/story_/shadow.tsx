export function ShadowCharacter({accent}:{accent:string}) {
  return (
    <div className="relative flex flex-col items-center" style={{animation:'float 2.5s ease-in-out infinite'}}>
      {/* Hood */}
      <div style={{width:80,height:64,background:'#111827',borderRadius:'9999px 9999px 0 0',zIndex:2}} />
      {/* Cloak */}
      <div style={{width:80,height:128,background:'linear-gradient(to bottom,#111827,#000)',clipPath:'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',marginTop:-40,zIndex:1}} />
      {/* Glow */}
      <div style={{position:'absolute',inset:0,background:`radial-gradient(circle,${accent}40,transparent)`,filter:'blur(30px)',animation:'pulse-glow 2.5s ease-in-out infinite'}} />
    </div>
  );
}