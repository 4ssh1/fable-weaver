export function OrbGuide({accent}:{accent:string}) {
  return (
    <div className="relative flex items-center justify-center" style={{width:120,height:120}}>
      {/* Core */}
      <div style={{width:96,height:96,borderRadius:'50%',background:`radial-gradient(circle,#fff,${accent})`,boxShadow:`0 0 40px ${accent}`,animation:'pulse-glow 2s ease-in-out infinite',position:'absolute'}} />
      {/* Ring 1 */}
      <div style={{width:128,height:128,borderRadius:'50%',border:`2px solid ${accent}80`,position:'absolute',animation:'spin-slow 4s linear infinite',transform:'rotateX(70deg)'}} />
      {/* Ring 2 */}
      <div style={{width:160,height:160,borderRadius:'50%',border:`2px solid ${accent}50`,position:'absolute',animation:'counter-spin 6s linear infinite',transform:'rotateX(40deg) rotateY(20deg)'}} />
    </div>
  );
}
