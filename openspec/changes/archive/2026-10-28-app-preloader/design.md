## Context

`index.html` loads the Telegram script synchronously in `<head>`, then `main.tsx` as a module.
`App.tsx` renders «Загрузка…» while `useLearning` loads progress. `initTelegram` paints Telegram's
header and background graphite. See proposal.md — Why.

Module guidelines this change updates: `telegram.md` (Init: script placement).

## Decisions

### 1. Preloader in `index.html`

`<style>` in `<head>` + `<div id="preloader">` as the first child of `<body>`: fixed, full screen,
`#0b0d12`, centred bar `64×3px`, `border-radius: 999px`, `background: linear-gradient(90deg,
#a8c5a0, #d8c18a, #d4917a, #a8c5a0) 0 0 / 300% 100%`, `animation: 2.4s linear infinite` shifting
`background-position`; `@media (prefers-reduced-motion: reduce)` stops it. Fade = `opacity`
transition 0.3 s via a `preloader-hidden` class. Colours are literals duplicated from the tokens
because CSS from the bundle is not loaded yet.

- Alternative: render the preloader in React — rejected: it appears only after the 1.1 MB bundle
  is parsed.

### 2. Telegram script after the preloader

Moved into `<body>` right after `#preloader`, still synchronous, before `main.tsx`, so `initTelegram`
behaves as before but the preloader paints first.

### 3. Hiding from `App`

`App` renders `null` while loading. A `useEffect` on `state.status !== 'loading'` waits for
`document.fonts.ready` and `max(0, 400 - performance.now())` ms, then adds `preloader-hidden`
and removes the node after the transition. The error branch uses the same effect.

## Risks / Trade-offs

- [Font promise never resolves on some WebView] → `document.fonts.ready` resolves even on
  failure; worst case the preloader waits for the bundle only.

## Migration Plan

No stored data. Deploy via push to `main`; rollback = revert.
