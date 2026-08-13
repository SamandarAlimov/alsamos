import { describe, expect, it } from 'vitest';
import {
  ALSAMOS_STATIC_EMOJI_COUNT,
  alsamosStaticEmojiUrl,
  hasAlsamosStaticEmoji,
} from '@/lib/alsamosStaticEmoji';

describe('Alsamos static emoji catalog', () => {
  it('contains the five pilot assets', () => {
    expect(ALSAMOS_STATIC_EMOJI_COUNT).toBe(5);
    expect(hasAlsamosStaticEmoji('😀')).toBe(true);
    expect(hasAlsamosStaticEmoji('😂')).toBe(true);
    expect(hasAlsamosStaticEmoji('😍')).toBe(true);
    expect(hasAlsamosStaticEmoji('😇')).toBe(true);
    expect(hasAlsamosStaticEmoji('🎉')).toBe(true);
  });

  it('resolves only registered original assets', () => {
    expect(alsamosStaticEmojiUrl('😀')).toBe('/emoji/alsamos/1f600.svg');
    expect(alsamosStaticEmojiUrl('😂')).toBe('/emoji/alsamos/1f602.svg');
    expect(alsamosStaticEmojiUrl('😍')).toBe('/emoji/alsamos/1f60d.svg');
    expect(alsamosStaticEmojiUrl('😇')).toBe('/emoji/alsamos/1f607.svg');
    expect(alsamosStaticEmojiUrl('🎉')).toBe('/emoji/alsamos/1f389.svg');
    expect(alsamosStaticEmojiUrl('🦄')).toBeUndefined();
  });
});
