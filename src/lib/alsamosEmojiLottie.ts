import { getAlsamosEmojiAnimationAsset } from './alsamosEmojiAnimation';

export interface AlsamosLottieAsset {
  emoji: string;
  src: string;
  durationMs: number;
  loop: false;
  /** SVG is the visual authority for the idle/frame-0 state. */
  staticSrc: string;
}

/**
 * Local Lottie registry. JSON files are added only after visual QA confirms
 * frame 0 against the corresponding static Alsamos master.
 */
const LOTTIE_FILES: Record<string, string> = {
  // Pilot assets are intentionally registered one-by-one after QA.
};

export function getAlsamosLottieAsset(emoji: string): AlsamosLottieAsset | undefined {
  const base = getAlsamosEmojiAnimationAsset(emoji);
  const src = LOTTIE_FILES[emoji];
  if (!base || !src) return undefined;

  return {
    emoji,
    src,
    durationMs: base.durationMs,
    loop: false,
    staticSrc: base.staticUrl,
  };
}

export function hasAlsamosLottieAsset(emoji: string): boolean {
  return Boolean(LOTTIE_FILES[emoji]);
}
