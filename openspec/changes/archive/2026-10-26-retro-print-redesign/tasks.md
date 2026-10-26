## 1. Foundation

- [x] 1.1 Dependencies: add `@fontsource/rubik`, `@phosphor-icons/react`; remove `pixelarticons`, `@fontsource/pixelify-sans` — verify: `npm ls` shows the new packages only
- [x] 1.2 `index.css`: new tokens, fonts, `--line`, utilities `halftone`/`hatch`/`hatch-primary`/`rays`; remove `pixel-corners`, `stripes`, `--pixel`, Pixelify faces — verify: `npm run build`
- [x] 1.3 `telegram.ts`: app color `#1a1815` — verify: header color in Telegram matches the background

## 2. Components

- [x] 2.1 `components/ui`: button (flat, round icon sizes), card, input, textarea, progress (thin track + hatched fill), sonner (Phosphor icons) — verify: dev server, home renders without pixel styles
- [x] 2.2 `screen-label` as rounded tag, `speak-button`, `progress-header` icons — verify: exercise screen

## 3. Screens

- [x] 3.1 Home: logo, streak pill, today panel with lessons band, progress, round settings button — verify: dev
- [x] 3.2 Exercises: numbered option rows in the thumb zone, word intro, tiles, typing, blank underline — verify: run a lesson through all exercise kinds
- [x] 3.3 Feedback panel: rays / hatch, labels, sentence block — verify: answer right, with a typo and wrong
- [x] 3.4 Summary «Урок пройден» with answer grid; session tracks per-answer results — verify: finish a lesson with a mistake
- [x] 3.5 Level test and settings (all buttons in the action zone) — verify: open both

## 4. Docs & verification

- [x] 4.1 Update `.ai/guidelines/modules/session.md`, `telegram.md`, CLAUDE.md design/fonts/icons
- [x] 4.2 `npm run lint && npm run typecheck` in `web/`; no `pixel`/`stripes` left in `src`
- [x] 4.3 `openspec validate retro-print-redesign --strict`
