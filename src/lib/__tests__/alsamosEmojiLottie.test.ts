import { describe, expect, it } from 'vitest';
import { getAlsamosLottieAsset, hasAlsamosLottieAsset } from '@/lib/alsamosEmojiLottie';

describe('Alsamos local Lottie registry', () => {
  it('does not pretend unverified pilot assets are production Lottie assets', () => {
    expect(hasAlsamosLottieAsset('😀')).toBe(false);
    expect(getAlsamosLottieAsset('😀')).toBeUndefined();
  });

  it('rejects unknown emoji', () => {
    expect(hasAlsamosLottieAsset('🦄')).toBe(false);
    expect(getAlsamosLottieAsset('🦄')).toBeUndefined();
  });
});
