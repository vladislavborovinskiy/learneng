## Why

The learner sometimes studies in Telegram Desktop, where every answer, «Дальше» and tile needs a
mouse click. Lessons are short repetitive loops, so a few predictable keys make them much faster
and keep the hands on the keyboard while typing answers.

## What Changes

- Number keys `1`–`4` pick the numbered answer options.
- `Enter` triggers the main action of the current state: «Дальше» on the new-word card and on
  the feedback panel, «Проверить» in typing, the main button of the lesson summary.
- `Shift+Enter` = «Не помню», `Tab` = hint (typing, tiles).
- Tiles: typing letters selects the first unused tile starting with them (shown highlighted),
  `Space` places it; `Backspace` edits the typed letters.
- `Esc` acts as the Telegram back button wherever the screen has one (leave the lesson, the level
  test, settings / backup view).
- On devices with a precise pointer (desktop) buttons show small key labels; touch screens stay
  unchanged.

## Capabilities

### New Capabilities

- `session/keyboard`: keyboard shortcuts in lessons, key labels on desktop, `Esc` as back.

### Modified Capabilities

- None.

## Impact

- Code: new hook in `web/src/lib/`, `web/src/lib/telegram.ts` (`useBackButton`),
  `web/src/exercises/{choice,typing,tiles,word-intro,feedback-panel}.tsx`,
  `web/src/screens/session-summary.tsx`.
- Stored data: none.
- Module guidelines: `.ai/guidelines/modules/session.md`, `.ai/guidelines/modules/telegram.md`.

## Non-goals

- Shortcuts on the home and settings screens (beyond `Esc`) and in the level test (beyond `Esc`).
- Customisable bindings.
