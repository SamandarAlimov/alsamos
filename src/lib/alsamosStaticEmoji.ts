/**
 * Original Alsamos static emoji artwork.
 *
 * Static artwork is the canonical idle state. Animated variants must use the
 * same artwork as their frame 0 so an emoji never changes visual identity when
 * transitioning between idle and playback.
 */

const ALSAMOS_STATIC_EMOJI: Record<string, string> = {
  '😀': '/emoji/alsamos/1f600.svg',
  '😃': '/emoji/alsamos/1f603.svg',
  '😄': '/emoji/alsamos/1f604.svg',
  '😁': '/emoji/alsamos/1f601.svg',
  '😂': '/emoji/alsamos/1f602.svg',
  '😊': '/emoji/alsamos/1f60a.svg',
  '😇': '/emoji/alsamos/1f607.svg',
  '🥰': '/emoji/alsamos/1f970.svg',
  '😍': '/emoji/alsamos/1f60d.svg',
  '🤩': '/emoji/alsamos/1f929.svg',
  '😘': '/emoji/alsamos/1f618.svg',
  '😎': '/emoji/alsamos/1f60e.svg',
  '🤗': '/emoji/alsamos/1f917.svg',
  '🤔': '/emoji/alsamos/1f914.svg',
  '🎉': '/emoji/alsamos/1f389.svg',
};

export function alsamosStaticEmojiUrl(emoji: string): string | undefined {
  return ALSAMOS_STATIC_EMOJI[emoji];
}

export function hasAlsamosStaticEmoji(emoji: string): boolean {
  return emoji in ALSAMOS_STATIC_EMOJI;
}

export const ALSAMOS_STATIC_EMOJI_COUNT = Object.keys(ALSAMOS_STATIC_EMOJI).length;

export const ALSAMOS_STATIC_EMOJI_ENTRIES = Object.freeze(
  Object.entries(ALSAMOS_STATIC_EMOJI).map(([emoji, url]) => ({ emoji, url })),
);
