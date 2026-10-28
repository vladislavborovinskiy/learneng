## Why

Home carries a lot of Cyrillic text — labels, two counters, two source bars, a forecast sentence
and a level-test paragraph. The learner wants a minimal screen focused on learning: one progress
number, one short line, the «Урок» button. The forecast also shows only day and month, so a
far-away date (e.g. 2033) reads like next week.

## What Changes

- Main block: the learned count as one large number with «из Y слов» and a thin progress bar;
  the «Выучено» label and «ещё не начато: N» are removed.
- One short line under the bar: «сегодня +N» (new words started today) and «финиш · <мес> <год>»
  (forecast month and year). The forecast is hidden when there is no pace or nothing to start.
- Removed: the «уроков сегодня» counter, the IT / «Частотные слова» bars, the level-test
  paragraph (the «Тест» button stays until the test is done).
- Paused-words hint shortened to «Новые слова на паузе — сначала повторения».

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `scheduling/home`: today's counters, backlog hint text, goal progress and forecast format.

## Impact

- Code: `web/src/screens/home.tsx`, `web/src/lib/scheduler.ts` (`getStats` drops unused fields).
- Stored data: none.
- Module guidelines: `.ai/guidelines/modules/scheduling.md`.

## Non-goals

- Changing lessons, the taper or the forecast formula (only its display).
