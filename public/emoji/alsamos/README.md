# Alsamos Emoji Asset Contract

## Static artwork

Every emoji master is an original Alsamos asset. The SVG is the canonical idle artwork and must remain visually complete without animation.

## Animation contract

Animated variants must satisfy:

1. Frame 0 matches the static master.
2. Playback is finite (`loop: false`) unless a future asset explicitly declares otherwise.
3. Completion returns to the canonical final/static state.
4. Animation must never replace or mutate the static source asset.
5. Renderer selection is an implementation detail behind `alsamosEmojiRenderer.ts`.

## Production asset layout

```text
public/emoji/alsamos/<unicode>.svg
public/emoji/alsamos/lottie/<unicode>.json
```

Lottie JSON should only be added after visual QA confirms frame 0 against the SVG master.
