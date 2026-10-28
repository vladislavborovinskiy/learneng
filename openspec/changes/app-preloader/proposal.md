## Why

On launch the learner sees an empty screen while the bundle loads, then a plain «Загрузка…»,
then the home screen with text flashing from the system font to Montserrat. The app should open
with a calm preloader in its own style and show the interface only when everything is ready.

## What Changes

- A preloader is part of `index.html` (inline styles), so it appears before any JavaScript: the
  graphite background and, centred, a thin rounded bar with a slow sage → sand → clay gradient
  shimmer. No text, logo or glow; static gradient with reduced motion.
- It stays until progress is loaded and Montserrat is ready, at least ~0.4 s from launch, then
  fades out. The React «Загрузка…» state is removed. On a load error the preloader is removed and
  the error is shown.
- The Telegram script moves from `<head>` to `<body>` after the preloader so it no longer blocks
  the first paint.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `ui/visual-style`: new requirement for the launch preloader.

## Impact

- Code: `web/index.html`, `web/src/App.tsx`.
- Stored data: none.
- Module guidelines: `telegram.md` (script placement); CLAUDE.md layout line for `index.html`.

## Non-goals

- Progress percentage or skeleton screens.
