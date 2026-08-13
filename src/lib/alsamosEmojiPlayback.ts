import { useCallback, useEffect, useRef, useState } from 'react';
import { alsamosStaticEmojiUrl } from './alsamosStaticEmoji';

export type AlsamosEmojiPlaybackState = 'idle' | 'playing' | 'completed';

export interface AlsamosEmojiPlaybackController {
  state: AlsamosEmojiPlaybackState;
  play: () => void;
  reset: () => void;
}

/**
 * Shared playback lifecycle for Alsamos animated emoji.
 *
 * Rules:
 * - idle is always represented by the original static asset;
 * - a playback request starts exactly one animation cycle;
 * - completion returns to the canonical static/final state;
 * - React remounts caused by parent list updates do not restart playback
 *   unless the caller explicitly requests play.
 */
export function useAlsamosEmojiPlayback(
  emoji: string,
  durationMs = 900,
): AlsamosEmojiPlaybackController {
  const [state, setState] = useState<AlsamosEmojiPlaybackState>('idle');
  const timerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    setState('idle');
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, [emoji]);

  const reset = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setState('idle');
  }, []);

  const play = useCallback(() => {
    if (!alsamosStaticEmojiUrl(emoji)) return;
    if (state === 'playing') return;

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setState('playing');
    timerRef.current = window.setTimeout(() => {
      if (mountedRef.current) setState('completed');
      timerRef.current = null;
    }, durationMs);
  }, [durationMs, emoji, state]);

  return { state, play, reset };
}

export function emojiPlaybackClass(state: AlsamosEmojiPlaybackState): string {
  switch (state) {
    case 'playing':
      return 'alsamos-emoji-playing';
    case 'completed':
      return 'alsamos-emoji-completed';
    default:
      return 'alsamos-emoji-idle';
  }
}
