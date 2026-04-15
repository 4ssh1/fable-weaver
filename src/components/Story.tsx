import { useState, useEffect, useRef, useCallback } from 'react';

import type { Theme } from '../consts';
import { THEMES, INJECTED_CSS, MOODS, STORY_BEATS } from '../consts';
import Landing from './story_/Landing';
import StoryScreen from './story_/StoryScreen';
import LoadingScreen from './story_/LoadingScreen';
import { WinScreen } from './story_/win';
import { LoseScreen } from './story_/lose';

export default function StoryGenerator() {


  const [screen, setScreen] = useState<'landing'|'story'|'loading'|'win'|'lose'>('landing');
  const [selectedTheme, setSelectedTheme] = useState<Theme|null>(null);
  const [choicesMade, setChoicesMade] = useState<string[]>([]);
  
  const [overlayState, setOverlayState] = useState<'idle'|'entering'|'exiting'>('idle');
  const [overlayOrigin, setOverlayOrigin] = useState({x:'50%',y:'50%'});

  // Cursor tracking
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({x:0,y:0});
  const cursorPos = useRef({x:0,y:0});
  const rafRef = useRef<number>(0);

  const accentColor = '#d4a438'; // Default accent color

  useEffect(() => {
    document.body.classList.add('story-active');
    const onMove = (e: MouseEvent) => { mousePos.current = {x:e.clientX,y:e.clientY}; };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.12;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 8}px, ${cursorPos.current.y - 8}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('story-active');
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const transitionTo = useCallback((target: typeof screen, e?: React.MouseEvent) => {
    const ox = e ? `${(e.clientX / window.innerWidth) * 100}%` : '50%';
    const oy = e ? `${(e.clientY / window.innerHeight) * 100}%` : '50%';
    setOverlayOrigin({x:ox,y:oy});
    setOverlayState('entering');
    setTimeout(() => {
      setScreen(target);
      setOverlayState('exiting');
      setTimeout(() => setOverlayState('idle'), 400);
    }, 500);
  }, []);

  const selectTheme = (theme: Theme, e: React.MouseEvent) => {
    setSelectedTheme(theme);
    transitionTo('loading', e);
    setTimeout(() => transitionTo('story'), 2500);
  };

  const handleStoryEnd = (result: 'win'|'lose', choices: string[]) => {
    setChoicesMade(choices);
    transitionTo(result);
  };

  const restartStory = (e?: React.MouseEvent) => {
    transitionTo('story', e);
  };

  const resetToLanding = (e?: React.MouseEvent) => {
    setSelectedTheme(null);
    setChoicesMade([]);
    transitionTo('landing', e);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: INJECTED_CSS}} />
      <div ref={cursorRef} style={{position:'fixed', top:0, left:0, width:16, height:16, borderRadius:'50%', background:'rgba(212,164,56,0.5)', pointerEvents:'none', zIndex:10000, mixBlendMode:'screen'}} />
      
      {overlayState !== 'idle' && (
        <div className={overlayState === 'entering' ? 'transition-overlay-enter' : 'transition-overlay-exit'} 
             style={{position:'fixed',inset:0,background:'var(--obsidian)',zIndex:9998,clipPath: overlayState === 'entering' ? undefined : undefined, ['--ox' as string]: overlayOrigin.x, ['--oy' as string]: overlayOrigin.y, ...(overlayState === 'entering' ? {animation:`ink-reveal 0.5s ease-in forwards`, clipPath:`circle(0% at ${overlayOrigin.x} ${overlayOrigin.y})`} : {})}} />
      )}

      {screen === 'landing' && (
        <Landing THEMES={THEMES} selectTheme={selectTheme} />
      )}

      {screen === 'loading' && (
        <LoadingScreen selectedTheme={selectedTheme} accentColor={accentColor} />
      )}

      {screen === 'story' && selectedTheme && (
        <StoryScreen 
          selectedTheme={selectedTheme} 
          accentColor={accentColor} 
          STORY_BEATS={STORY_BEATS} 
          MOODS={MOODS} 
          onStoryEnd={handleStoryEnd} 
        />
      )}

      {screen === 'win' && <WinScreen choices={choicesMade} onRestart={restartStory} onNewTheme={resetToLanding} accent={accentColor} />}
      {screen === 'lose' && <LoseScreen choices={choicesMade} onRestart={restartStory} onNewTheme={resetToLanding} />}
    </>
  );
}