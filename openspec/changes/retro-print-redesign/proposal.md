## Why

The 8-bit pixel look (lime accent, pixel font, stepped corners) no longer fits the learner's
taste. They chose a print-inspired direction instead: Japanese/retro magazine graphics with soft
paper colors, thin ink lines and one orange accent, in a dark theme only. Reaching every button
with the thumb stays the core rule of the app and must hold on every screen.

## What Changes

- New palette: warm ink background, paper-colored text and lines, one orange accent, a muted
  paper tone for captions. No lime, no pixel font, no stepped corners or diagonal stripes.
- New type: one heavy rounded grotesk for headings, numbers and body (Cyrillic and Latin alike),
  a monospace face for small captions.
- Flat controls: buttons are filled or outlined, without shadows or pressed-in 3D. Panels have
  sharp corners; round shapes are used for icon buttons, numbered markers and label tags.
- Print textures as accents, at most one per screen: halftone dots, hatching, orange rays.
- Answer feedback: orange rays and «Правильно!» / «Почти! Опечатка» for correct answers, paper
  hatching and «Неправильно» for wrong ones.
- Choice options are numbered rows in the thumb zone.
- Lesson summary «Урок пройден» shows one cell per answer (filled = correct, hatched = wrong).
- Settings: all buttons move to the thumb zone like on every other screen.
- Icons: pixel icon set replaced by a bold outline set.
- **BREAKING** (visual only): the previous theme is removed entirely.

## Capabilities

### New Capabilities

- `ui/visual-style`: palette, typography, control shapes, textures, feedback and summary
  visuals, thumb-zone placement of every button.

### Modified Capabilities

- None (no main specs exist yet).

## Impact

- Code: `web/src/index.css`, `web/src/components/**`, `web/src/exercises/**`,
  `web/src/screens/**`, `web/src/lib/telegram.ts` (Telegram header/background color).
- Dependencies: add `@fontsource/rubik`, `@phosphor-icons/react`; remove `pixelarticons`,
  `@fontsource/pixelify-sans`.
- Module guidelines: `session.md` (feedback, summary), `telegram.md` (app color); CLAUDE.md
  design, fonts and icons notes.

## Non-goals

- Light theme.
- Illustrations or mascots from the reference.
- Changes to lesson logic or exercises' behavior.
