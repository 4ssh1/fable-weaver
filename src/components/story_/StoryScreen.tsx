import { useState, useEffect } from 'react';
import { HeroCharacter } from './hero';
import { ShadowCharacter } from './shadow';
import { OrbGuide } from './orb';
import type { Theme } from '../../consts';
import type { StoryTree, StoryNode } from '../../api';

type Sparkle = { id: number; dx: number; dy: number; size: number; dur: number };

function computeFateDelta(_choiceIndex: number): number {
  return _choiceIndex === 0 ? 15 : 20;
}

const MOODS = ['Determined', 'Anxious', 'Resolute', 'Desperate', 'Triumphant'];

export default function StoryScreen({
  selectedTheme,
  accentColor,
  storyTree,
  onStoryEnd,
}: {
  selectedTheme: Theme;
  accentColor: string;
  storyTree: StoryTree;
  onStoryEnd: (res: 'win' | 'lose', choices: string[]) => void;
}) {
  const [currentNode, setCurrentNode] = useState<StoryNode>(storyTree.root_node);
  const [fateMeter, setFateMeter]     = useState(50);
  const [candlesLit, setCandlesLit]   = useState(5);
  const [moodIndex, setMoodIndex]     = useState(0);
  const [characterAnim, setCharacterAnim] = useState<'idle' | 'shake' | 'sparkle'>('idle');
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [choicesVisible, setChoicesVisible] = useState(false);
  const [sparkles, setSparkles]       = useState<Sparkle[]>([]);
  const [choiceHistory, setChoiceHistory] = useState<string[]>([]);

  const fateColor =
    fateMeter > 60 ? 'linear-gradient(90deg,#2ecc71,#f1c40f)' :
    fateMeter > 30 ? 'linear-gradient(90deg,#f39c12,#e67e22)' :
                     'linear-gradient(90deg,#e74c3c,#c0392b)';

  const moodDotColor =
    fateMeter > 60 ? '#2ecc71' :
    fateMeter > 30 ? '#f1c40f' :
                     '#e74c3c';

  useEffect(() => {
    setDisplayedWords([]);
    setChoicesVisible(false);
    const words = currentNode.content.split(' ');
    let i = 0;
    const iv = setInterval(() => {
      if (i < words.length) {
        setDisplayedWords(prev => [...prev, words[i]]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => {
          // 2. Use snake_case boolean flags
          if (currentNode.is_ending) {
            setTimeout(() => {
              onStoryEnd(currentNode.is_winning ? 'win' : 'lose', choiceHistory);
            }, 2000);
          } else {
            setChoicesVisible(true);
          }
        }, 300);
      }
    }, 60);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode.id]); // We can safely use ID here since it's flat

  useEffect(() => {
    if (characterAnim === 'sparkle') {
      const parts = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        dx: (Math.random() - 0.5) * 120,
        dy: (Math.random() - 0.5) * 120,
        size: 3 + Math.random() * 5,
        dur: 0.4 + Math.random() * 0.4,
      }));
      setSparkles(parts);
      setTimeout(() => { setSparkles([]); setCharacterAnim('idle'); }, 800);
    }
    if (characterAnim === 'shake') {
      setTimeout(() => setCharacterAnim('idle'), 500);
    }
  }, [characterAnim]);

  const handleChoice = (choiceIndex: number) => {
    if (!currentNode.options) return;
    const option = currentNode.options[choiceIndex];
    if (!option) return;

    setChoicesVisible(false);

    const delta = computeFateDelta(choiceIndex);
    const newFate = Math.max(0, Math.min(100, fateMeter + delta));
    setFateMeter(newFate);

    setCharacterAnim(delta > 0 ? 'sparkle' : 'shake');
    setMoodIndex(prev => Math.min(prev + 1, MOODS.length - 1));
    setCandlesLit(prev => Math.max(0, prev - 1));

    const updatedHistory = [...choiceHistory, option.text];
    setChoiceHistory(updatedHistory);

    // 3. Lookup the next node in the flattened dictionary using the stringified ID
    const nextNode = storyTree.all_nodes[String(option.node_id)];

    setTimeout(() => {
      if (!nextNode) {
        onStoryEnd(newFate > 50 ? 'win' : 'lose', updatedHistory);
        return;
      }
      setCurrentNode(nextNode);
    }, 600);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden" style={{ background: 'var(--obsidian)' }}>
      {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
      <div
        className="md:w-2/5 w-full flex flex-col items-center justify-end pb-8 md:pb-12 relative overflow-hidden"
        style={{ background: selectedTheme.gradient, minHeight: '40vh' }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{ width: 200, height: 60, background: accentColor, filter: 'blur(40px)', opacity: 0.4, animation: 'pulse-glow 2s ease-in-out infinite' }}
        />
        <div
          className="relative z-10"
          style={{ width: 160, height: 30, background: 'rgba(0,0,0,0.6)', clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}
        />

        <div
          className="relative z-10 mb-2"
          style={{ animation: characterAnim === 'shake' ? 'shake 0.5s ease' : undefined }}
        >
          {selectedTheme.character === 'hero'   && <HeroCharacter accent={accentColor} />}
          {selectedTheme.character === 'shadow' && <ShadowCharacter accent={accentColor} />}
          {selectedTheme.character === 'orb'    && <OrbGuide accent={accentColor} />}
          {sparkles.map(s => (
            <div
              key={s.id}
              className="absolute rounded-full"
              style={{
                width: s.size, height: s.size, background: accentColor,
                top: '50%', left: '50%',
                ['--dx' as string]: `${s.dx}px`,
                ['--dy' as string]: `${s.dy}px`,
                animation: `sparkle-out ${s.dur}s ease forwards`,
              }}
            />
          ))}
        </div>

        <div
          className="relative z-10 mt-4 inline-flex items-center gap-2 px-4 py-1 rounded-full border"
          style={{ borderColor: `${accentColor}40`, background: 'rgba(0,0,0,0.4)' }}
        >
          <div className="w-2 h-2 rounded-full transition-colors duration-500" style={{ background: moodDotColor }} />
          <span className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--parchment)' }}>
            {MOODS[moodIndex]}
          </span>
        </div>
        <span
          className="relative z-10 mt-2 text-xs uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-display)', color: 'rgba(212,164,56,0.7)', fontVariant: 'small-caps' }}
        >
          {selectedTheme.label}
        </span>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
      <div
        className="md:w-3/5 w-full flex flex-col overflow-hidden relative"
        style={{ background: 'rgba(8,8,16,0.95)' }}
      >
        <div className="flex items-center justify-between px-4 md:px-6 pt-4 md:pt-6 pb-3 gap-3 flex-wrap">
          <span
            className="px-3 py-1 rounded-full border text-xs"
            style={{ fontFamily: 'var(--font-display)', color: accentColor, borderColor: `${accentColor}30` }}
          >
            {selectedTheme.icon} {selectedTheme.label}
          </span>

          <div className="flex-1 mx-2 md:mx-6 min-w-25">
            <span className="text-xs block mb-1" style={{ fontFamily: 'var(--font-display)', color: 'rgba(212,164,56,0.6)' }}>Fate</span>
            <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full relative overflow-hidden"
                style={{ width: `${fateMeter}%`, background: fateColor, transition: 'width 1.2s ease' }}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', animation: 'shimmer 2s infinite' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="text-lg transition-all"
                style={{
                  opacity: i < candlesLit ? 1 : 0.2,
                  filter: i < candlesLit ? 'none' : 'grayscale(1)',
                  animation: i === candlesLit ? 'candle-snuff 0.6s ease forwards' : undefined,
                }}
              >🕯</span>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 pb-2">
          <p className="text-lg md:text-xl leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--parchment)' }}>
            {displayedWords.map((w, i) => (
              <span
                key={`word-${i}`}
                className="inline-block mr-1.5"
                style={{ animation: 'word-appear 0.15s ease both' }}
              >
                {w}
              </span>
            ))}
          </p>
        </div>

        <div className="px-4 md:px-6 pb-6 md:pb-8 flex flex-col gap-3 mt-auto">
          {choicesVisible && currentNode.options?.map((option, i) => (
            <button
              key={option.node_id} // 4. Using snake_case node_id here
              className="group relative overflow-hidden w-full py-4 px-6 rounded-lg border text-left transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: 'rgba(180,130,40,0.4)',
                background: 'rgba(0,0,0,0.6)',
                animation: `fade-up 0.4s ease both`,
                animationDelay: `${i * 0.2}s`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(180,130,40,0.8)';
                e.currentTarget.style.background  = 'rgba(60,40,10,0.4)';
                e.currentTarget.style.boxShadow   = '0 0 20px rgba(201,146,42,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(180,130,40,0.4)';
                e.currentTarget.style.background  = 'rgba(0,0,0,0.6)';
                e.currentTarget.style.boxShadow   = 'none';
              }}
              onClick={() => handleChoice(i)}
            >
              <span className="text-sm" style={{ fontFamily: 'var(--font-display)', color: '#d4a438' }}>
                {option.text}
              </span>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="-translate-x-full group-hover:translate-x-[200%] transition-transform duration-700"
                  style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)' }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}