# Scheduling Module — Business Context

## What this module is for

Deciding what the learner does today and showing how far they are: spaced repetition with FSRS
(`ts-fsrs`, fuzz on), composing lessons (unlimited per day), streak and learned counters on the
home screen. Code: `web/src/lib/scheduler.ts`, `web/src/screens/home.tsx`,
`web/src/App.tsx` (screen switching).

## Glossary

- **Due** — words whose card `due <= now`, oldest due first.
- **Lesson** (`buildLesson`) — up to `newWordsLimit(due)` new words (taper: due < 12 → 3,
  < 24 → 2, < 48 → 1, otherwise 0); 3 slots = 2 IT (file order) + 1 NGSL (by rank), 2 slots =
  1 IT + 1 NGSL, 1 slot = IT; when one source runs out the other fills the slots + up to 8
  review items. Reviews are due words, most lapses first, then most overdue; free
  slots are topped up with non-due `Review` cards with the lowest retrievability
  (`get_retrievability`). Order: 2 reviews as warm-up, then each new word followed by an even
  share of the remaining reviews. No daily limit — lessons can be repeated any number of times.
- **Paused new words** — `due >= PAUSE_NEW_WORDS_AT` (48): lessons have no new words and home
  shows a hint. There is no separate «Повторение» mode; the button is always «Урок».
- **Forecast** — `getStats`: `unstarted` (words without a card), `pace` (sum of `days[d].learned`
  over the 14 local days ending today ÷ 14, idle days included), `finishDate` = today +
  ⌈unstarted / pace⌉ days, `null` at pace 0. It predicts when every word is started, not
  learned; «Знаю» / level-test words reduce `unstarted` but do not add to the pace.
- **Today** — `days[today].learned` (first-time graded words) and `days[today].lessons`
  (completed lessons).
- **Learned** — a word whose card is in FSRS `Review` state. Shown overall and per source
  (IT-словарь / Частотные слова).
- **Streak** — consecutive days with `reviewed > 0`, ending today or yesterday (today without
  activity does not break it yet).
- **Grades** — exercises map results to FSRS ratings: correct → `Good`, typo / hinted → `Hard`,
  wrong / «Не помню» → `Again`; «Знаю» / level test → `Easy`.

## Key flows

1. **Home** — main block «Выучено X из Y» + bar, «ещё не начато: N», forecast «при темпе ~P в
   день — до D» (or «начни урок, чтобы увидеть прогноз»); cells «выучено сегодня» / «уроков
   сегодня»; paused-words hint at 48+ due; IT / «Частотные слова» bars; streak. No due counter.
   Main action always «Урок». «Тест» shows until the level test is done.
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
