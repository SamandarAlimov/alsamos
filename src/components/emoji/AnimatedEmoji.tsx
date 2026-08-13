import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { animatedEmojiUrls } from '@/lib/animatedEmoji';
import { alsamosStaticEmojiUrl } from '@/lib/alsamosStaticEmoji';

interface AnimatedEmojiProps {
  emoji: string;
  /** Rendered pixel size. */
  size?: number;
  className?: string;
  /** Only animate on hover (grid performance). */
  playOnHover?: boolean;
  title?: string;
}

/**
 * Renders an emoji using the Alsamos original static artwork when one exists.
 *
 * The static artwork is the canonical idle state. Non-pilot emoji retain the
 * existing animated asset fallback until their original Alsamos artwork is
 * produced. This keeps the rollout incremental without replacing the whole
 * catalog with platform-native glyphs.
 */
export function AnimatedEmoji({
  emoji,
  size = 24,
  className,
  playOnHover = false,
  title,
}: AnimatedEmojiProps) {
  const alsamosStaticUrl = alsamosStaticEmojiUrl(emoji);
  const candidates = useMemo(() => animatedEmojiUrls(emoji), [emoji]);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIndex(0);
    setFailed(false);
  }, [emoji]);

  if (alsamosStaticUrl) {
    return (
      <img
        src={alsamosStaticUrl}
        alt={emoji}
        title={title}
        draggable={false}
        width={size}
        height={size}
        className={cn(
          'inline-block object-contain select-none',
          playOnHover && 'transition-transform duration-150 hover:scale-110',
          className,
        )}
        style={{ width: size, height: size }}
      />
    );
  }

  if (failed) {
    return (
      <span
        className={cn('inline-flex items-center justify-center leading-none select-none', className)}
        style={{ fontSize: size * 0.92, width: size, height: size }}
        title={title}
      >
        {emoji}
      </span>
    );
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
      onError={() => {
        if (index < candidates.length - 1) setIndex(index + 1);
        else setFailed(true);
      }}
      className={cn(
        'inline-block object-contain select-none',
        playOnHover && 'transition-transform duration-150 hover:scale-110',
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
