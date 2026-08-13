import { alsamosStaticEmojiUrl } from './alsamosStaticEmoji';
import { getAlsamosEmojiMotion } from './alsamosEmojiMotion';

/**
 * Transport-agnostic animation asset contract.
 *
 * The UI does not know whether an animation is backed by Lottie, Web
 * Animations, or another renderer. Motion timing comes from one central
 * registry so lifecycle and renderer durations cannot drift apart.
 */
export interface AlsamosEmojiAnimationAsset {
  emoji: string;
  staticUrl: string;
  lottieUrl?: string;
  durationMs: number;
  loop: false;
}

export function getAlsamosEmojiAnimationAsset(emoji: string): AlsamosEmojiAnimationAsset | undefined {
  const staticUrl = alsamosStaticEmojiUrl(emoji);
  if (!staticUrl) return undefined;

  return {
    emoji,
    staticUrl,
    durationMs: getAlsamosEmojiMotion(emoji)?.durationMs ?? 900,
    loop: false,
  };
}
