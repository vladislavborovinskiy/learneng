## 1. Foundation

- [x] 1.1 `package.json`: add `@fontsource/montserrat`, remove `@fontsource/rubik`; `index.css`: Montserrat 300/400/500 latin + cyrillic, JetBrains Mono 400 — verify: `npm run build`, Network tab loads only Montserrat / JetBrains Mono woff2
- [x] 1.2 `index.css`: new token values, `glass` / `glass-strong` / `tint-success` / `tint-destructive` utilities, grain, graphite body background; delete `halftone`, `hatch`, `hatch-primary`, `rays`, `--line` — verify: `npm run typecheck && npm run build`
- [x] 1.3 `telegram.ts`: bars painted `#0b0d12` — verify: grep shows no `#1a1815`

## 2. Components

- [x] 2.1 `components/ui/button.tsx`, `card.tsx`, `progress.tsx`, `input.tsx`, `textarea.tsx`, `sonner.tsx` restyled (no outlines/shadows, glass, rounded, Montserrat weights) — verify in dev at 360px against the prototype
- [x] 2.2 `screen-label.tsx`, `progress-header.tsx`, `speak-button.tsx`, `key-label.tsx` restyled — verify in dev
- [x] 2.3 `components/word-title.tsx` adaptive word; used in `word-intro.tsx` and `choice.tsx` (en→ru) — verify: «multiprocessing» and «object-oriented programming» fit at 360px

## 3. Screens & exercises

- [x] 3.1 `home.tsx`: goal panel, today cells, source bars, streak chip with number only — verify in dev at 360px
- [x] 3.2 `exercises/*`: choice, typing, tiles, word-intro, feedback-panel (tints, no icons, highlighted word) — verify: correct / typo / wrong / forgot panels at 360px
- [x] 3.3 `session-summary.tsx` (sage / clay cells), `settings.tsx`, `level-test.tsx` — verify in dev at 360px
- [x] 3.4 Grep: no `font-black`, `border-(length:--line)`, `hatch`, `halftone`, `rays`, `#ee6a2e`, `#ede1c7` left in `web/src` — verify: empty grep

## 4. Docs & verification

- [x] 4.1 Update `.ai/guidelines/modules/telegram.md`, `session.md`; CLAUDE.md «Дизайн» and «Шрифты»
- [x] 4.2 Run `npm run lint && npm run typecheck && npm run build` in `web/` — verify: no errors
- [x] 4.3 `openspec validate glass-redesign --strict` passes
