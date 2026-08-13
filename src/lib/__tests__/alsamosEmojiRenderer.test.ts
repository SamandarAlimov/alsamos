import { describe, expect, it } from 'vitest';
import { resolveAlsamosEmojiRenderer } from '@/lib/alsamosEmojiRenderer';

describe('Alsamos emoji renderer adapter', () => {
  it('resolves static rendering without an animation renderer', () => {
    const result = resolveAlsamosEmojiRenderer({
      emoji: '😀',
      size: 32,
      animate: false,
    });

    expect(result).toEqual({
      emoji: '😀',
      staticUrl: '/emoji/alsamos/1f600.svg',
      renderer: 'static',
      durationMs: 900,
      loop: false,
    });
  });

  it('uses web animation until a local Lottie asset is registered', () => {
    const result = resolveAlsamosEmojiRenderer({
      emoji: '😍',
      size: 32,
      animate: true,
    });

    expect(result?.renderer).toBe('web-animation');
    expect(result?.loop).toBe(false);
  });

  it('supports an explicit renderer choice', () => {
    const result = resolveAlsamosEmojiRenderer({
      emoji: '🎉',
      size: 32,
      animate: true,
      renderer: 'lottie',
    });

    expect(result?.renderer).toBe('lottie');
  });

  it('rejects emoji without an Alsamos-owned asset', () => {
    expect(resolveAlsamosEmojiRenderer({
      emoji: '🦄',
      size: 32,
      animate: true,
    })).toBeUndefined();
  });
});
