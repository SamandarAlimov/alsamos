import { ALSAMOS_STATIC_EMOJI_ENTRIES } from './alsamosStaticEmoji';

export type AlsamosEmojiMotionName =
  | 'bounce'
  | 'laugh'
  | 'heartbeat'
  | 'halo'
  | 'sparkle'
  | 'kiss'
  | 'cool'
  | 'thinking'
  | 'celebrate';

export interface AlsamosEmojiMotionPreset {
  name: AlsamosEmojiMotionName;
  durationMs: number;
  easing: string;
  keyframes: Keyframe[];
}

const presets: Record<AlsamosEmojiMotionName, AlsamosEmojiMotionPreset> = {
  bounce: {
    name: 'bounce', durationMs: 820, easing: 'cubic-bezier(.22,.61,.36,1)',
    keyframes: [
      { transform: 'translateY(0) scale(1)' },
      { transform: 'translateY(-7%) scale(1.06)' },
      { transform: 'translateY(2%) scale(.98)' },
      { transform: 'translateY(-2%) scale(1.02)' },
      { transform: 'translateY(0) scale(1)' },
    ],
  },
  laugh: {
    name: 'laugh', durationMs: 980, easing: 'cubic-bezier(.22,.61,.36,1)',
    keyframes: [
      { transform: 'scale(1) rotate(0deg)' },
      { transform: 'scale(1.08) rotate(-4deg)' },
      { transform: 'scale(.96) rotate(4deg)' },
      { transform: 'scale(1.04) rotate(-2deg)' },
      { transform: 'scale(1) rotate(0deg)' },
    ],
  },
  heartbeat: {
    name: 'heartbeat', durationMs: 1050, easing: 'ease-in-out',
    keyframes: [
      { transform: 'scale(1)' },
      { transform: 'scale(1.16)' },
      { transform: 'scale(.98)' },
      { transform: 'scale(1.12)' },
      { transform: 'scale(1)' },
    ],
  },
  halo: {
    name: 'halo', durationMs: 920, easing: 'cubic-bezier(.22,.61,.36,1)',
    keyframes: [
      { transform: 'translateY(0) rotate(0deg)' },
      { transform: 'translateY(-5%) rotate(-3deg)' },
      { transform: 'translateY(1%) rotate(3deg)' },
      { transform: 'translateY(0) rotate(0deg)' },
    ],
  },
  sparkle: {
    name: 'sparkle', durationMs: 1120, easing: 'cubic-bezier(.22,.61,.36,1)',
    keyframes: [
      { transform: 'scale(1) rotate(0deg)' },
      { transform: 'scale(1.08) rotate(-5deg)' },
      { transform: 'scale(.96) rotate(5deg)' },
      { transform: 'scale(1.04) rotate(-2deg)' },
      { transform: 'scale(1) rotate(0deg)' },
    ],
  },
  kiss: {
    name: 'kiss', durationMs: 900, easing: 'cubic-bezier(.22,.61,.36,1)',
    keyframes: [
      { transform: 'translateX(0) scale(1)' },
      { transform: 'translateX(5%) scale(1.07)' },
      { transform: 'translateX(-2%) scale(.98)' },
      { transform: 'translateX(0) scale(1)' },
    ],
  },
  cool: {
    name: 'cool', durationMs: 850, easing: 'cubic-bezier(.22,.61,.36,1)',
    keyframes: [
      { transform: 'rotate(0deg) scale(1)' },
      { transform: 'rotate(-4deg) scale(1.04)' },
      { transform: 'rotate(4deg) scale(1.02)' },
      { transform: 'rotate(0deg) scale(1)' },
    ],
  },
  thinking: {
    name: 'thinking', durationMs: 1000, easing: 'ease-in-out',
    keyframes: [
      { transform: 'rotate(0deg) translateX(0)' },
      { transform: 'rotate(-4deg) translateX(-2%)' },
      { transform: 'rotate(3deg) translateX(2%)' },
      { transform: 'rotate(0deg) translateX(0)' },
    ],
  },
  celebrate: {
    name: 'celebrate', durationMs: 1200, easing: 'cubic-bezier(.22,.61,.36,1)',
    keyframes: [
      { transform: 'translateY(0) rotate(0deg) scale(1)' },
      { transform: 'translateY(-9%) rotate(-6deg) scale(1.08)' },
      { transform: 'translateY(2%) rotate(6deg) scale(.96)' },
      { transform: 'translateY(-4%) rotate(-3deg) scale(1.04)' },
      { transform: 'translateY(0) rotate(0deg) scale(1)' },
    ],
  },
};

const emojiMotion: Record<string, AlsamosEmojiMotionName> = {
  '😀': 'bounce', '😃': 'bounce', '😄': 'bounce', '😁': 'bounce',
  '😂': 'laugh', '😊': 'bounce', '😇': 'halo', '🥰': 'heartbeat',
  '😍': 'heartbeat', '🤩': 'sparkle', '😘': 'kiss', '😎': 'cool',
  '🤗': 'bounce', '🤔': 'thinking', '🎉': 'celebrate',
};

export function getAlsamosEmojiMotion(emoji: string): AlsamosEmojiMotionPreset | undefined {
  const name = emojiMotion[emoji];
  return name ? presets[name] : undefined;
}

export const ALSAMOS_ANIMATED_EMOJI_ENTRIES = Object.freeze(
  ALSAMOS_STATIC_EMOJI_ENTRIES.map(({ emoji }) => ({
    emoji,
    motion: emojiMotion[emoji] ?? 'bounce',
  })),
);
