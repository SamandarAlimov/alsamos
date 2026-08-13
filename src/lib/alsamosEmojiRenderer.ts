import { getAlsamosEmojiAnimationAsset } from './alsamosEmojiAnimation';

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
  loop: false;
}

/**
 * Renderer adapter boundary. UI components consume this contract instead of
 * depending directly on an animation implementation.
 */
export function resolveAlsamosEmojiRenderer(
  request: AlsamosEmojiRenderRequest,
): AlsamosEmojiRenderResult | undefined {
  const asset = getAlsamosEmojiAnimationAsset(request.emoji);
  if (!asset) return undefined;

  const renderer = request.animate
    ? (request.renderer ?? (asset.lottieUrl ? 'lottie' : 'web-animation'))
    : 'static';

  return {
    emoji: request.emoji,
    staticUrl: asset.staticUrl,
    renderer,
    durationMs: asset.durationMs,
    loop: false,
  };
}
