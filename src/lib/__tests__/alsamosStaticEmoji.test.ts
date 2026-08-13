import { describe, expect, it } from 'vitest';
import {
  ALSAMOS_STATIC_EMOJI_COUNT,
  ALSAMOS_STATIC_EMOJI_ENTRIES,
  alsamosStaticEmojiUrl,
  hasAlsamosStaticEmoji,
} from '@/lib/alsamosStaticEmoji';

describe('Alsamos static emoji catalog', () => {
  it('contains the complete 15-emoji pilot set', () => {
    expect(ALSAMOS_STATIC_EMOJI_COUNT).toBe(15);
    for (const emoji of ['😀', '😃', '😄', '😁', '😂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😎', '🤗', '🤔', '🎉']) {
      expect(hasAlsamosStaticEmoji(emoji)).toBe(true);
      expect(alsamosStaticEmojiUrl(emoji)).toMatch(/^\/emoji\/alsamos\/[^/]+\.svg$/);
    }
  });

  it('exposes immutable registry entries for renderers and QA tooling', () => {
    expect(ALSAMOS_STATIC_EMOJI_ENTRIES).toHaveLength(15);
    expect(Object.isFrozen(ALSAMOS_STATIC_EMOJI_ENTRIES)).toBe(true);
  });

  it('does not claim an unregistered emoji as an Alsamos asset', () => {
    expect(hasAlsamosStaticEmoji('🦄')).toBe(false);
    expect(alsamosStaticEmojiUrl('🦄')).toBeUndefined();
  });
});
