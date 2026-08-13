import { alsamosStaticEmojiUrl } from './alsamosStaticEmoji';

/**
 * Transport-agnostic animation contract.
 *
 * The UI must not know whether an animation is backed by Lottie, Web Animations
 * or another renderer. Production Lottie assets can be registered here later
 * without changing AnimatedEmoji's asset-selection contract.
 */
export interface AlsamosEmojiAnimationAsset {
  emoji: string;
  staticUrl: string;
  lottieUrl?: string;
  durationMs: number;
  loop: false;
}

const DURATIONS: Record<string, number> = {
  '😀': 900,
  '😂': 1000,
  '😍': 1000,
  '😇': 950,
  '🎉': 1200,
};

export function getAlsamosEmojiAnimationAsset(
  emoji: string,
): AlsamosEmojiAnimationAsset | undefined {
  const staticUrl = alsamosStaticEmojiUrl(emoji);
  if (!staticUrl) return undefined;

  return {
    emoji,
    staticUrl,
    durationMs: DURATIONS[emoji] ?? 900,
    loop: false,
  };
}
