/**
 * Alsamos Emoji visual system v1.
 *
 * These tokens define the independent Alsamos rendering language. They are
 * shared by static artwork reviews and future animation masters so frame 0
 * cannot drift away from the idle asset.
 */
export const ALSAMOS_EMOJI_VISUAL = Object.freeze({
  canvas: 256,
  face: {
    center: 128,
    radius: 108,
    shadowOffsetY: 5,
  },
  light: {
    origin: 'top-left',
    highlightOpacity: 0.38,
    highlightRotationDeg: -18,
  },
  palette: {
    faceHighlight: '#FFF8D6',
    faceLight: '#FFE978',
    faceBase: '#FFD04A',
    faceShadow: '#E6A928',
    shadow: '#D79A22',
    feature: '#3A2A1A',
    alsamosOrange: '#F26C21',
    accentRed: '#E83F51',
  },
  line: {
    facial: 9,
    expressive: 10,
    rounded: true,
  },
  animation: {
    staticFrameIsCanonical: true,
    frameZeroMustMatchStaticAsset: true,
  },
} as const);

export type AlsamosEmojiVisual = typeof ALSAMOS_EMOJI_VISUAL;
