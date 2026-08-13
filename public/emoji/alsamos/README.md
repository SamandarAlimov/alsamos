# Alsamos Emoji Asset Contract

## 1. Canonical visual identity

Every emoji master is an original Alsamos asset. The SVG is the canonical idle artwork and must remain visually complete without animation.

The static asset is never replaced by a lower-quality placeholder during playback, loading, list virtualization, or renderer fallback.

## 2. Animation contract

Animated variants must satisfy:

1. Frame 0 matches the static master.
2. Playback is finite (`loop: false`).
3. Completion returns to the canonical static/final state.
4. Animation never mutates the source SVG.
5. `prefers-reduced-motion: reduce` disables playback while preserving the static artwork.
6. Renderer selection is centralized in `src/lib/alsamosEmojiRenderer.ts`.
7. Motion timing is owned by the asset registry, not duplicated in React components.

## 3. Runtime strategy

The production-safe default renderer is the browser Web Animations API using the original static SVG. This keeps the idle state identical across every renderer and avoids shipping a second copy of the artwork solely for animation.

A verified Lottie renderer is supported by the same adapter boundary. A Lottie asset is eligible only when a local JSON file has passed frame-0 visual QA and is explicitly registered in `src/lib/alsamosEmojiLottie.ts`.

No remote/demo Lottie assets are used by the Alsamos catalog.

## 4. Production asset layout

```text
public/emoji/alsamos/<unicode>.svg
public/emoji/alsamos/lottie/<unicode>.json
```

Lottie JSON is optional per emoji. The absence of a verified Lottie file must never disable or degrade the static emoji or its production Web Animation fallback.

## 5. Long-term rules

- Do not copy Telegram, Apple, Twemoji, Noto, or other proprietary artwork.
- New emoji must be added to the static registry first.
- New animation must define a motion preset and pass the canonical-static-state tests.
- Do not add hard-coded animation keyframes to UI components.
- Do not fetch animation artwork from third-party CDNs at runtime.
- Keep renderer implementations behind the adapter so the catalog remains portable to Flutter/Lottie in the SuperApp rebuild.
