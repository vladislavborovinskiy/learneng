## Why

The learner either knows an answer or is stuck: there is no way to get a nudge, and no honest
way to say «I don't remember». On choice exercises a guess (25% chance) is graded `Good`, so
forgotten words look learned. On typing exercises the first letter is shown in the sentence but
the input is empty, which confuses. Research on retrieval practice (Vaughn & Kornell, 2019)
shows letter hints keep the learning benefit of a retrieval attempt as long as the answer stays
non-guessable, and learners practise more willingly with them.

## What Changes

- Typing: the first letter of the answer is shown inside the input as a fixed, non-editable
  prefix; the learner types the rest.
- Typing: a hint button reveals one more letter of the answer per tap, up to half of the
  answer; an answer given after a hint is graded `Hard` at best.
- Tiles: a hint button places the next correct tile (dropping any wrongly placed tiles after
  the correct beginning); an answer given after a hint is graded `Hard` at best.
- Every exercise (choice, cloze, tiles, typing) gets «Не помню»: the word is graded `Again`,
  the feedback panel shows the word with its translations and the sentence, and the word comes
  back later in the lesson like a wrong answer.
- Choice exercises get no hint (removing options makes the answer guessable).
- Due review items are ordered by how often the word was forgotten (most lapses first), then
  by how overdue they are, so troublesome words surface first.
- The summary counts «Не помню» as a mistake and a hinted answer as correct.

## Capabilities

### New Capabilities

- `session/hints`: hints in typing and tiles, the fixed first-letter prefix, «Не помню» and how
  each affects the grade and the feedback.

### Modified Capabilities

- `session/lesson-flow`: forgotten items come back in the lesson like wrong answers.
- `scheduling/lessons`: due review items are prioritized by lapses; grading map gains hinted
  (`Hard`) and forgotten (`Again`).

## Impact

- Code: `web/src/lib/exercises.ts`, `web/src/lib/scheduler.ts`, `web/src/screens/session.tsx`,
  `web/src/screens/session-summary.tsx`, `web/src/exercises/{choice,tiles,typing,feedback-panel}.tsx`.
- Stored data: none — lapses are already part of the stored card; no format change.
- Module guidelines: `.ai/guidelines/modules/session.md`, `.ai/guidelines/modules/scheduling.md`.

## Non-goals

- Per-tile checking and chunked tiles — change `sentence-builder-scaffolding`.
- Mistakes in the final round and «Повторить ошибки» — change `mistakes-review`.
- Keyboard shortcuts — change `keyboard-controls`.
- Tuning FSRS parameters or a separate leech mechanism.
