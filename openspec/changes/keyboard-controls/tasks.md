## 1. Hook & labels

- [x] 1.1 `lib/use-hotkeys.ts`: capture-phase `keydown`, `event.code` bindings with `Shift+`, ignores repeat and Ctrl/Alt/Meta, `preventDefault`, optional `onText` for Latin letters/digits — verify: `npm run typecheck`
- [x] 1.2 `components/key-label.tsx`: `KeyLabel` visible only with `pointer-fine` — verify in dev: labels visible with a mouse, hidden in device emulation with touch
- [x] 1.3 `telegram.ts`: `useBackButton` binds `Escape` — verify in dev: `Esc` leaves the lesson, the level test and settings / backup view

## 2. Lesson bindings

- [x] 2.1 `choice.tsx`: `1`–`4`, `Shift+Enter` — verify in dev with the Russian layout active: `3` picks option 3
- [x] 2.2 `typing.tsx`: `Enter` submit once, `Shift+Enter` forgot, `Tab` hint keeping focus — verify: hold `Enter` on the panel does not skip items
- [x] 2.3 `tiles.tsx`: search text, highlight, `Space` place, `Backspace`, `Tab`, `Shift+Enter` — verify: typing «fr» + `Space` taps «from the project» with the Russian layout active
- [x] 2.4 `word-intro.tsx`, `feedback-panel.tsx`, `session-summary.tsx`: `Enter` → main action; labels on buttons — verify: a full lesson can be completed from the keyboard only

## 3. Docs & verification

- [x] 3.1 Update `.ai/guidelines/modules/session.md` and `telegram.md`; CLAUDE.md (layout: hook, keyboard line)
- [x] 3.2 Run `npm run lint && npm run typecheck` in `web/` — verify: no errors
- [x] 3.3 `openspec validate keyboard-controls --strict` passes
