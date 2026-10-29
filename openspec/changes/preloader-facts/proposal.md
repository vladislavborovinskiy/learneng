## Why

The launch preloader is a thin bar on an empty graphite screen — it says nothing and feels like
waiting. Those seconds can teach something: a short fact about English, its history or its links
with Russian, on a living background in the app's colours.

## What Changes

- The preloader becomes a full-screen background whose sage → sand → clay gradient (dimmed over
  graphite) slowly flows; the bar is removed. Static gradient with reduced motion.
- On it, centred, one short fact: the English sentence and its Russian translation under it.
  Facts come from `content/facts.json` (~150, each ≤ 12 English / ≤ 14 Russian words) and are
  inlined into `index.html` at build, so the fact shows on the first paint.
- Facts go in a shuffled order kept in `localStorage`; a fact repeats only after all were shown.
- The preloader stays at least 2.5 s (was 0.4 s) so the fact can be read; a tap closes it early
  once progress is loaded. The text fades in when Montserrat is ready.
- This is the one explicit exception to «no gradients» in the visual style.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `ui/visual-style`: the launch preloader requirement changes.

## Impact

- Code: `web/index.html`, `web/vite.config.ts` (inline facts), `web/src/App.tsx`.
- Content: new `content/facts.json`; `scripts/check-content.mjs` checks its lengths and duplicates.
- Stored data: one `localStorage` key `preloader-facts` (not synced, not in the backup).
- Docs: `telegram.md`, `content.md`, CLAUDE.md.

## Non-goals

- Fact categories, links to sources, or a separate facts screen.
