import { useState, useEffect, useRef, useCallback } from 'react';

import type { Theme } from '../consts';
import { THEMES, INJECTED_CSS } from '../consts';
import { createStoryJob, pollUntilComplete, getStory } from '../api';
import type { StoryTree } from '../api';
import Landing from './story_/Landing';
import StoryScreen from './story_/StoryScreen';
import LoadingScreen from './story_/LoadingScreen';
import { WinScreen } from './story_/win';
import { LoseScreen } from './story_/lose';

export default function StoryGenerator() {
  const [screen, setScreen]             = useState<'landing'|'loading'|'story'|'win'|'lose'>('landing');
  const [selectedTheme, setSelectedTheme] = useState<Theme|null>(null);
  const [choicesMade, setChoicesMade]   = useState<string[]>([]);
  const [storyTree, setStoryTree]       = useState<StoryTree|null>(null);
  const [loadingError, setLoadingError] = useState<string|null>(null);

  const [overlayState, setOverlayState] = useState<'idle'|'entering'|'exiting'>('idle');
  const [overlayOrigin, setOverlayOrigin] = useState({ x: '50%', y: '50%' });

  // Smooth cursor
  const cursorRef  = useRef<HTMLDivElement>(null);
  const mousePos   = useRef({ x: 0, y: 0 });
  const cursorPos  = useRef({ x: 0, y: 0 });
  const rafRef     = useRef<number>(0);

  const accentColor = selectedTheme?.accent ?? '#d4a438';

  useEffect(() => {
    document.body.classList.add('story-active');
    const onMove = (e: MouseEvent) => { mousePos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.12;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${cursorPos.current.x - 8}px, ${cursorPos.current.y - 8}px)`;
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
    const ox = e ? `${(e.clientX / window.innerWidth)  * 100}%` : '50%';
    const oy = e ? `${(e.clientY / window.innerHeight) * 100}%` : '50%';
    setOverlayOrigin({ x: ox, y: oy });
    setOverlayState('entering');
    setTimeout(() => {
      setScreen(target);
      setOverlayState('exiting');
      setTimeout(() => setOverlayState('idle'), 400);
    }, 500);
  }, []);

  const selectTheme = useCallback(async (theme: Theme, e: React.MouseEvent) => {
    setSelectedTheme(theme);
    setStoryTree(null);
    setLoadingError(null);
    setChoicesMade([]);
    transitionTo('loading', e);

    try {
      // 1. Create the job
      const { job_id } = await createStoryJob(theme.label);

      // 2. Poll until complete
      const job = await pollUntilComplete(job_id);

      if (!job.story_id) throw new Error('Job completed but no story_id returned');

      // 3. Fetch the full story tree
      const tree = await getStory(job.story_id);
      setStoryTree(tree);

      // 4. Transition to story screen
      transitionTo('story');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setLoadingError(msg);
      // Stay on loading screen; LoadingScreen will show the error
    }
  }, [transitionTo]);

  const handleStoryEnd = useCallback((result: 'win' | 'lose', choices: string[]) => {
    setChoicesMade(choices);
    transitionTo(result);
  }, [transitionTo]);

  const restartStory = useCallback((e?: React.MouseEvent) => {
    if (!selectedTheme) return;
    selectTheme(selectedTheme, e as React.MouseEvent ?? { clientX: 0, clientY: 0 } as React.MouseEvent);
  }, [selectedTheme, selectTheme]);

  const resetToLanding = useCallback((e?: React.MouseEvent) => {
    setSelectedTheme(null);
    setChoicesMade([]);
    setStoryTree(null);
    transitionTo('landing', e);
  }, [transitionTo]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: INJECTED_CSS }} />
      <div
        ref={cursorRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: 16, height: 16,
          borderRadius: '50%', background: `${accentColor}80`,
          pointerEvents: 'none', zIndex: 10000, mixBlendMode: 'screen',
        }}
      />

      {overlayState !== 'idle' && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'var(--obsidian)', zIndex: 9998,
            ['--ox' as string]: overlayOrigin.x,
            ['--oy' as string]: overlayOrigin.y,
            ...(overlayState === 'entering'
              ? { animation: 'ink-reveal 0.5s ease-in forwards', clipPath: `circle(0% at ${overlayOrigin.x} ${overlayOrigin.y})` }
              : { animation: 'fade-out-overlay 0.4s ease forwards' }),
          }}
        />
      )}

      {screen === 'landing' && (
        <Landing THEMES={THEMES} selectTheme={selectTheme} />
      )}

      {screen === 'loading' && (
        <LoadingScreen
          selectedTheme={selectedTheme}
          accentColor={accentColor}
          error={loadingError}
          onRetry={selectedTheme ? () => restartStory() : undefined}
        />
      )}

      {screen === 'story' && selectedTheme && storyTree && (
        <StoryScreen
          selectedTheme={selectedTheme}
          accentColor={accentColor}
          storyTree={storyTree}
          onStoryEnd={handleStoryEnd}
        />
      )}

      {screen === 'win' && (
        <WinScreen
          choices={choicesMade}
          onRestart={(e) => restartStory(e)}
          onNewTheme={(e) => resetToLanding(e)}
          accent={accentColor}
        />
      )}
      {screen === 'lose' && (
        <LoseScreen
          choices={choicesMade}
          onRestart={(e) => restartStory(e)}
          onNewTheme={(e) => resetToLanding(e)}
        />
      )}
    </>
  );
}