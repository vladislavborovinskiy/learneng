# Scheduling Module — Business Context

## What this module is for

Deciding what the learner does today and showing how far they are: spaced repetition with FSRS
(`ts-fsrs`, fuzz on), the daily new-word limit, the «extra words» escape hatch, streak and
learned counters on the home screen. Code: `web/src/lib/scheduler.ts`, `web/src/screens/home.tsx`,
`web/src/App.tsx` (screen switching).

## Glossary

- **Due** — words whose card `due <= now`, oldest due first.
- **New today** — `newPerDay − days[today].learned` unseen words, taken from the new-words order
  (IT first, then NGSL by rank).
- **Extra** — after the daily work is done the home screen offers «Ещё 5 слов»: a session with
  `extraNew = 5` new words **ignoring** the daily limit (still counted into `learned` on grading).
- **Learned** — a word whose card is in FSRS `Review` state. Shown overall and per source
  (IT-словарь / Частотные слова).
- **Streak** — consecutive days with `reviewed > 0`, ending today or yesterday (today without
  activity does not break it yet).
- **Grades** — exercises map results to FSRS ratings: correct → `Good`, typo → `Hard`,
  wrong → `Again`; «Знаю» / level test → `Easy`.

## Key flows

1. **Home** — counters «повторить» (due) and «новых слов» (new today), learned progress, streak.
   Main action «Старт» when due + new > 0; otherwise «Ещё 5 слов», or disabled «Всё выучено»
   when nothing is unseen. «Тест» shows until the level test is done.
2. **Session queue** — built once at session start: due reviews first, then new words (see
   `session.md`).

## Non-obvious invariants / gotchas

- Days are local dates (`toLocaleDateString('en-CA')`), so the daily limit resets at local
  midnight of the device, not UTC.
- The queue is a snapshot; cards that become due during a session wait for the next one.
- Stats are recomputed from the whole progress on every home render — cheap at ~740 words, revisit
  if the deck grows by an order of magnitude.
- Navigation is a `useState` screen switch in `App.tsx`, no router and no URL state.

## Where to look next

- Storage of cards and day stats — `progress.md`; how a session consumes the queue —
  `session.md`.
