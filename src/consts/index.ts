

export type Theme = {
  id: string;
  label: string;
  teaser: string;
  icon: string;
  gradient: string;
  accent: string;
  character: 'hero' | 'shadow' | 'orb' | string;
};

export const THEMES: Theme[] = [
  { id: 'kingdom', label: 'The Lost Kingdom',  icon: '⚔️', teaser: 'A fallen realm calls for its champion.',           gradient: 'linear-gradient(135deg,#0d2b1d,#0a0a2e)', accent: '#2ecc71', character: 'hero'   },
  { id: 'neon',    label: 'Neon Abyss',         icon: '⚡', teaser: 'The city never sleeps — neither do its secrets.', gradient: 'linear-gradient(135deg,#0d0d2b,#2b0d2b)', accent: '#00f5ff', character: 'shadow' },
  { id: 'manor',   label: 'The Haunted Manor',  icon: '🕯', teaser: 'Something watches from behind the walls.',        gradient: 'linear-gradient(135deg,#1a0a0a,#2b1010)', accent: '#cc2222', character: 'shadow' },
  { id: 'starfall',label: 'Starfall',           icon: '🌌', teaser: 'The stars are dying. Only you know why.',         gradient: 'linear-gradient(135deg,#050514,#0a1428)', accent: '#7b68ee', character: 'orb'    },
  { id: 'sea',     label: 'The Forgotten Sea',  icon: '🌊', teaser: 'The ocean hides an empire beneath its waves.',    gradient: 'linear-gradient(135deg,#021b2e,#042b2b)', accent: '#20b2aa', character: 'hero'   },
];

export const LOADING_QUOTES = [
  'The threads of fate are weaving...',
  'Your choice ripples through the realm...',
  'The story bends to your will...',
  'Destiny is being written...',
  'The ancient words take form...',
  'The world shifts around your decision...',
];

export const INJECTED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');

:root {
  --font-display: 'Cinzel Decorative', serif;
  --font-body: 'Crimson Pro', serif;
  --gold: #c9922a;
  --parchment: #ede0c4;
  --obsidian: #080810;
  --ember: #9b2222;
  --ghost: #e8e8f0;
}

@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes sway { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
@keyframes pulse-glow { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
@keyframes orbit { from{transform:rotate(0deg) translateX(120px) rotate(0deg)} to{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }
@keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes counter-spin { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
@keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.6} 92%{opacity:0.8} }
@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
@keyframes sparkle-out { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0} }
@keyframes fall { 0%{transform:translateY(-20px) translateX(0);opacity:1} 100%{transform:translateY(110vh) translateX(var(--drift));opacity:0} }
@keyframes ink-reveal { 0%{clip-path:circle(0% at 50% 50%)} 100%{clip-path:circle(150% at 50% 50%)} }
@keyframes draw-line { from{width:0} to{width:100%} }
@keyframes fade-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
@keyframes candle-snuff { 0%{opacity:1;transform:scale(1)} 40%{opacity:0.3;transform:scale(1.2)} 100%{opacity:0.15;transform:scale(0.8)} }
@keyframes word-appear { from{opacity:0} to{opacity:1} }
@keyframes rune-orbit-1 { from{transform:rotate(0deg) translateX(160px) rotate(0deg)} to{transform:rotate(360deg) translateX(160px) rotate(-360deg)} }
@keyframes rune-orbit-2 { from{transform:rotate(60deg) translateX(120px) rotate(-60deg)} to{transform:rotate(420deg) translateX(120px) rotate(-420deg)} }
@keyframes rune-orbit-3 { from{transform:rotate(120deg) translateX(140px) rotate(-120deg)} to{transform:rotate(480deg) translateX(140px) rotate(-480deg)} }
@keyframes rune-orbit-4 { from{transform:rotate(180deg) translateX(150px) rotate(-180deg)} to{transform:rotate(540deg) translateX(150px) rotate(-540deg)} }
@keyframes rune-orbit-5 { from{transform:rotate(240deg) translateX(130px) rotate(-240deg)} to{transform:rotate(600deg) translateX(130px) rotate(-600deg)} }
@keyframes rune-orbit-6 { from{transform:rotate(300deg) translateX(170px) rotate(-300deg)} to{transform:rotate(660deg) translateX(170px) rotate(-660deg)} }
@keyframes bounce-dot { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes crown-spin { from{transform:translateX(-50%) rotate(0deg)} to{transform:translateX(-50%) rotate(360deg)} }

.transition-overlay-enter { animation: ink-reveal 0.5s ease-in forwards; }
.transition-overlay-exit  { animation: fade-out-overlay 0.4s ease forwards; }
@keyframes fade-out-overlay { from{opacity:1} to{opacity:0} }

body.story-active { cursor: none !important; }
body.story-active * { cursor: none !important; }
`;