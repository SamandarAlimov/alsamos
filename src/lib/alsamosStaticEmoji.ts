/**
 * Original Alsamos static emoji artwork.
 *
 * These assets are intentionally independent from platform/vendor emoji artwork.
 * The static asset is the canonical idle appearance and is also suitable as
 * the future Lottie frame-0 source.
 */

const ALSAMOS_STATIC_EMOJI: Record<string, string> = {
  '😀': '/emoji/alsamos/1f600.svg',
  '😂': '/emoji/alsamos/1f602.svg',
  '😍': '/emoji/alsamos/1f60d.svg',
  '😇': '/emoji/alsamos/1f607.svg',
  '🎉': '/emoji/alsamos/1f389.svg',
};

export function alsamosStaticEmojiUrl(emoji: string): string | undefined {
  return ALSAMOS_STATIC_EMOJI[emoji];
}

export function hasAlsamosStaticEmoji(emoji: string): boolean {
  return emoji in ALSAMOS_STATIC_EMOJI;
}

export const ALSAMOS_STATIC_EMOJI_COUNT = Object.keys(ALSAMOS_STATIC_EMOJI).length;
