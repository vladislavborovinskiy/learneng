# Scheduling Module — Business Context

## What this module is for

Deciding what the learner does today and showing how far they are: spaced repetition with FSRS
(`ts-fsrs`, fuzz on), composing lessons (unlimited per day), streak and learned counters on the
home screen. Code: `web/src/lib/scheduler.ts`, `web/src/screens/home.tsx`,
`web/src/App.tsx` (screen switching).

## Glossary

- **Due** — words whose card `due <= now`, oldest due first.
- **Lesson** (`buildLesson`) — up to 3 new words: next 2 unseen IT words (file order) + the most
  frequent unseen NGSL word; when one source runs out the other fills the slots + up to 8 review items. Reviews are due words, most overdue first; free
  slots are topped up with non-due `Review` cards with the lowest retrievability
  (`get_retrievability`). Order: 2 reviews as warm-up, then each new word followed by an even
  share of the remaining reviews. No daily limit — lessons can be repeated any number of times.
- **Backlog** — `due >= BACKLOG_THRESHOLD` (24): lessons contain no new words, the home button
  reads «Повторение» and a hint explains why.
- **Today** — `days[today].learned` (first-time graded words) and `days[today].lessons`
  (completed lessons).
- **Learned** — a word whose card is in FSRS `Review` state. Shown overall and per source
  (IT-словарь / Частотные слова).
- **Streak** — consecutive days with `reviewed > 0`, ending today or yesterday (today without
  activity does not break it yet).
- **Grades** — exercises map results to FSRS ratings: correct → `Good`, typo → `Hard`,
  wrong → `Again`; «Знаю» / level test → `Easy`.

## Key flows

1. **Home** — counters «повторить» (due) and «выучено сегодня», «Уроков сегодня: N», learned
   progress, streak, backlog hint. Main action «Урок» / «Повторение», always enabled. «Тест»
   shows until the level test is done.
2. **Lesson queue** — built once when a lesson starts from current progress (see `session.md`).

## Non-obvious invariants / gotchas

- Days are local dates (`toLocaleDateString('en-CA')`), so «выучено сегодня» and the lesson count reset at local
  midnight of the device, not UTC.
- The queue is a snapshot; cards that become due during a lesson wait for the next one. Words
  learned in a lesson are `Learning` cards due within minutes, so they come back as due words in
  the following lessons.
- Top-up reviews are graded like any review; FSRS handles the early review, intervals just grow
  less.
- Stats are recomputed from the whole progress on every home render — cheap at ~740 words, revisit
  if the deck grows by an order of magnitude.
- Navigation is a `useState` screen switch in `App.tsx`, no router and no URL state.

## Where to look next

- Storage of cards and day stats — `progress.md`; how a session consumes the queue —
  `session.md`.
