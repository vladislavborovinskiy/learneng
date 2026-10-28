## Why

The deck is fixed (737 words) and the goal is to learn all of it, but home is organised around
«повторить» and switches to a separate «Повторение» mode at 24 due words, where new words stop
completely. The learner wants one thing — «Урок» — that always mixes reviews and new words, and
a home screen that shows progress towards learning the whole deck.

## What Changes

- **BREAKING** (behavior): the «Повторение» mode is removed. The main action is always «Урок».
- New words per lesson taper with the due count instead of switching off at 24: fewer than 12
  due → 3, fewer than 24 → 2, fewer than 48 → 1, 48 or more → 0. With one slot the new word is
  an IT word (NGSL only when IT words run out).
- Home drops the «повторить» counter. Its main block shows «Выучено X из 737» with a progress
  bar, the number of words not started yet and a forecast «при темпе ~N слов в день — до <date>»
  from the new words of the last 14 days. Today's row shows «выучено сегодня» and lessons today;
  the IT / frequent-words bars stay.
- The hint about paused new words appears only when new words are paused (48+ due).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `scheduling/lessons`: new-words taper replaces the backlog lesson.
- `scheduling/home`: main action always «Урок», counters, goal progress and forecast, hint
  threshold.

## Impact

- Code: `web/src/lib/scheduler.ts`, `web/src/screens/home.tsx`.
- Stored data: none (forecast uses existing `meta.days[*].learned`).
- Module guidelines: `.ai/guidelines/modules/scheduling.md`.

## Non-goals

- Changing review selection or FSRS parameters.
- Daily goals or reminders based on the forecast.
