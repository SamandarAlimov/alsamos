import { getAlsamosEmojiAnimationAsset } from './alsamosEmojiAnimation';
import { getAlsamosLottieAsset } from './alsamosEmojiLottie';
import { getAlsamosEmojiMotion } from './alsamosEmojiMotion';

export type AlsamosEmojiRendererKind = 'static' | 'web-animation' | 'lottie';

export interface AlsamosEmojiRenderRequest {
  emoji: string;
  size: number;
  animate: boolean;
  renderer?: AlsamosEmojiRendererKind;
}

export interface AlsamosEmojiRenderResult {
  emoji: string;
  staticUrl: string;
  renderer: AlsamosEmojiRendererKind;
  durationMs: number;
  easing: string;
  keyframes: Keyframe[];
  lottieSrc?: string;
  loop: false;
}

export function resolveAlsamosEmojiRenderer(
  request: AlsamosEmojiRenderRequest,
): AlsamosEmojiRenderResult | undefined {
  const asset = getAlsamosEmojiAnimationAsset(request.emoji);
  if (!asset) return undefined;

  const lottie = getAlsamosLottieAsset(request.emoji);
  const motion = getAlsamosEmojiMotion(request.emoji);
  const renderer = !request.animate
    ? 'static'
    : request.renderer ?? (lottie ? 'lottie' : 'web-animation');

  return {
    emoji: request.emoji,
    staticUrl: asset.staticUrl,
    renderer,
    durationMs: lottie?.durationMs ?? motion?.durationMs ?? asset.durationMs,
    easing: motion?.easing ?? 'cubic-bezier(.22,.61,.36,1)',
    keyframes: motion?.keyframes ?? [
      { transform: 'scale(1)' },
      { transform: 'scale(1.08)' },
      { transform: 'scale(1)' },
    ],
    lottieSrc: lottie?.src,
    loop: false,
  };
}
