import { describe, expect, it } from 'vitest';
import { ALSAMOS_STATIC_EMOJI_ENTRIES } from '@/lib/alsamosStaticEmoji';
import { ALSAMOS_ANIMATED_EMOJI_ENTRIES, getAlsamosEmojiMotion } from '@/lib/alsamosEmojiMotion';

const PILOT_EMOJI = ALSAMOS_STATIC_EMOJI_ENTRIES.map(({ emoji }) => emoji);

describe('Alsamos emoji motion catalog', () => {
  it('has a motion preset for every static pilot asset', () => {
    expect(ALSAMOS_ANIMATED_EMOJI_ENTRIES).toHaveLength(PILOT_EMOJI.length);

    for (const emoji of PILOT_EMOJI) {
      const motion = getAlsamosEmojiMotion(emoji);
      expect(motion, `missing motion preset for ${emoji}`).toBeDefined();
      expect(motion?.durationMs).toBeGreaterThan(0);
      expect(motion?.keyframes.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('always ends at the canonical static transform', () => {
    for (const emoji of PILOT_EMOJI) {
      const motion = getAlsamosEmojiMotion(emoji);
      const finalFrame = motion?.keyframes.at(-1) as Keyframe | undefined;
      expect(finalFrame?.transform).toMatch(/scale\(1\)/);
    }
  });
});
