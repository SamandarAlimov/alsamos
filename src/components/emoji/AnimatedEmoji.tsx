import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { animatedEmojiUrls } from '@/lib/animatedEmoji';
import { alsamosStaticEmojiUrl } from '@/lib/alsamosStaticEmoji';
import { useAlsamosEmojiPlayback } from '@/lib/alsamosEmojiPlayback';
import { resolveAlsamosEmojiRenderer } from '@/lib/alsamosEmojiRenderer';

interface AnimatedEmojiProps {
  emoji: string;
  size?: number;
  className?: string;
  playOnHover?: boolean;
  playOnClick?: boolean;
  title?: string;
}

/** Unified renderer: Alsamos artwork first, renderer implementation second. */
export function AnimatedEmoji({ emoji, size = 24, className, playOnHover = false, playOnClick = false, title }: AnimatedEmojiProps) {
  const alsamosStaticUrl = alsamosStaticEmojiUrl(emoji);
  const candidates = useMemo(() => animatedEmojiUrls(emoji), [emoji]);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const playback = useAlsamosEmojiPlayback(emoji);
  const renderer = resolveAlsamosEmojiRenderer({ emoji, size, animate: playback.state === 'playing' });
  const rendererKind = renderer?.renderer;
  const rendererDurationMs = renderer?.durationMs ?? 900;

  useEffect(() => {
    setIndex(0);
    setFailed(false);
  }, [emoji]);

  useEffect(() => {
    if (!imageRef.current) return;

    if (rendererKind !== 'web-animation' || playback.state !== 'playing') {
      imageRef.current.getAnimations().forEach((animation) => animation.cancel());
      return;
    }

    const animation = imageRef.current.animate(
      [
        { transform: 'scale(1) rotate(0deg)', offset: 0 },
        { transform: 'scale(1.12) rotate(-5deg)', offset: 0.28 },
        { transform: 'scale(0.94) rotate(4deg)', offset: 0.55 },
        { transform: 'scale(1.05) rotate(-2deg)', offset: 0.78 },
        { transform: 'scale(1) rotate(0deg)', offset: 1 },
      ],
      { duration: rendererDurationMs, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' },
    );

    return () => animation.cancel();
  }, [playback.state, rendererDurationMs, rendererKind]);

  if (alsamosStaticUrl) {
    const play = () => playback.play();
    return (
      <img
        ref={imageRef}
        src={alsamosStaticUrl}
        alt={emoji}
        title={title}
        draggable={false}
        width={size}
        height={size}
        onClick={playOnClick ? play : undefined}
        onMouseEnter={playOnHover ? play : undefined}
        className={cn('inline-block object-contain select-none', (playOnHover || playOnClick) && 'cursor-pointer', className)}
        style={{ width: size, height: size, transformOrigin: 'center center' }}
      />
    );
  }

  if (failed) {
    return <span className={cn('inline-flex items-center justify-center leading-none select-none', className)} style={{ fontSize: size * 0.92, width: size, height: size }} title={title}>{emoji}</span>;
  }

  return (
    <img
      src={candidates[index]}
      alt={emoji}
      title={title}
      loading="lazy"
      draggable={false}
      width={size}
      height={size}
      onError={() => index < candidates.length - 1 ? setIndex(index + 1) : setFailed(true)}
      className={cn('inline-block object-contain select-none', className)}
      style={{ width: size, height: size }}
    />
  );
}
