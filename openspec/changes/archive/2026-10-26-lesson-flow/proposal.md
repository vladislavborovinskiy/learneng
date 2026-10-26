## Why

The daily model — a fixed number of new words per day plus an «Ещё 5 слов» button — caps
learning when the learner is in the mood and separates new words from reviews into two blocks.
The learner wants Duolingo-style short lessons, as many as they like, where already learned
words keep coming back between new ones and due reviews are surfaced by the app itself.

## What Changes

- Learning happens in **lessons**: up to 3 new words (2 IT + 1 frequent NGSL word, so general
  vocabulary arrives from the start instead of after all IT words) and up to 8 review items,
  ~12 answers. The
  learner may start any number of lessons per day; there is no daily new-word limit.
- Review items are due words first (most overdue first); when fewer than 8 are due, the lesson
  is topped up with learned words the learner is most likely to be forgetting.
- New words are interleaved with reviews: a short review warm-up, then each new word (intro +
  exercise) followed by reviews, then the existing final round over the lesson's new words.
- When 24 or more words are due, a lesson contains no new words and is labelled «Повторение»
  until the backlog shrinks.
- Home shows one main action «Урок» (or «Повторение»), the due count, and today's learned words
  and completed lessons. **BREAKING**: the «Ещё 5 слов» button and the «Новых слов в день»
  setting are removed.
- The lesson summary offers «Ещё урок» next to «На главную».
- Completed lessons are counted per day in stored stats.

## Capabilities

### New Capabilities

- `scheduling/lessons`: how a lesson is composed (new words, due reviews, top-up, backlog rule)
  and that lessons are unlimited.
- `scheduling/home`: home screen counters and the main action.
- `session/lesson-flow`: order of items inside a lesson, final round, completion and summary
  actions.
- `progress/settings`: what the settings screen offers after the daily limit is removed.

### Modified Capabilities

- None (no main specs exist yet).

## Impact

- Code: `web/src/lib/scheduler.ts`, `web/src/lib/storage.ts` (Meta: drop `newPerDay`, add
  per-day lesson count), `web/src/lib/use-learning.ts`, `web/src/App.tsx`,
  `web/src/screens/home.tsx`, `web/src/screens/session.tsx`,
  `web/src/screens/session-summary.tsx`, `web/src/screens/settings.tsx`.
- Stored data: backward compatible — an old `newPerDay` in `meta` is ignored, days without a
  lesson count read as 0; backups keep their format.
- Module guidelines: `.ai/guidelines/modules/scheduling.md`, `session.md`, `progress.md`;
  CLAUDE.md layout notes.

## Non-goals

- Changing exercise types for mature cards (recall EN→RU with self-grading) — separate change.
- Bot reminders that know the due count (impossible without a backend).
- Streak rules (freeze, minimal day) — separate change.
