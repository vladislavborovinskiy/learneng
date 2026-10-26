## Context

Today the session queue is built once in `session.tsx` from `getDueWordIds` (all due words) and
`getNewWordIds` (daily limit `meta.newPerDay` minus `days[today].learned`, or `extraNew` from the
«Ещё 5 слов» button). New words come after all reviews. `App.tsx` switches screens with
`useState`; `useLearning` owns progress/meta and writes them to CloudStorage. Card states and
scheduling come from `ts-fsrs` 5.4, which exposes `get_retrievability(card, now, false)`.

Module guidelines this change updates: `scheduling.md` (Glossary: new today / extra → lesson,
backlog; Key flows: home, queue), `session.md` (Key flows 1–6: lesson order, completion,
summary), `progress.md` (Glossary: Meta fields; flow 4: settings).

## Goals / Non-Goals

**Goals:**

- A pure, deterministic-except-for-shuffle lesson builder that the session consumes as is.
- Stored data stays backward compatible; no migration step.

**Non-Goals:**

- Changing exercise selection by card state (`buildExercise` stays as is).
- Tuning FSRS parameters.

## Decisions

### 1. Lesson is built by a pure `buildLesson(progress, now)` in `scheduler.ts`

Returns the ordered `LessonItem[]` (`{ wordId, intro }`); the backlog check is a separate
`isBacklog(dueCount)` shared with home stats. Constants live next to it: `NEW_PER_LESSON = 3`, `REVIEWS_PER_LESSON = 8`,
`BACKLOG_THRESHOLD = 24`, `WARMUP_REVIEWS = 2`. `getNewWordIds` and the daily-limit logic are
removed; `getDueWordIds` stays and feeds both the lesson and home counters.

- Alternative: compose the lesson inside `Session` — rejected: mixes scheduling policy with UI
  state and duplicates the backlog rule that home also needs for its label.

### 2. Top-up = learned non-due `Review` cards, lowest retrievability first

Candidates are cards in `State.Review` with `due > now`, sorted by
`scheduler.get_retrievability(card, now, false)` ascending. They are graded like any review;
FSRS accounts for the short elapsed time, so an early correct answer grows stability only a
little and does not distort the schedule.

- Alternative: random learned words — rejected: wastes slots on words recalled with ~100%
  probability.
- Alternative: show top-up words without grading — rejected: answers would be lost and a
  forgotten word would not be rescheduled.
- `Learning`/`Relearning` cards are excluded from top-up: they have minute-scale due dates and
  enter lessons as due words shortly anyway.

### 3. Interleaving

`warmup = reviews[0..2)` only when the lesson has new words; the rest of the reviews are split
into `newCount` near-equal chunks, chunk `i` placed after new word `i`. The existing final round
over introduced words and the wrong-answer requeue (+4) in `session.tsx` stay untouched.

### 4. Completed-lesson count in `DayStats.lessons`

`DayStats` gets an optional `lessons` (missing = 0). `useLearning` gets
`completeLesson()` that bumps `days[today].lessons` through the same ref + commit + `saveMeta`
path as `grade`. `Session` calls it from `advance()` at the moment the next index runs past the
queue (after the final round is appended), never from render.

- Alternative: reuse `updateMeta` from `Session` — rejected: it takes a patch of top-level
  fields and the caller would rebuild nested `days`, racing with `grade` writes.

### 5. «Ещё урок» remounts the session

`App` keeps a `lessonKey` counter passed as `key` to `Session`; «Ещё урок» increments it, so
the new lesson is built by the existing `useState` initializer from current progress.

- Alternative: a reset function inside `Session` — rejected: seven pieces of state to reset by
  hand.

### 6. Removing `newPerDay`

Dropped from `Meta`, `defaultMeta` and settings. `loadAll` strips an old `newPerDay` from the
parsed meta so it disappears on the next save; `importBackup` keeps validating only key names,
so old backups restore unchanged. `getStats` drops `newToday` and adds `learnedToday`,
`lessonsToday`, `isBacklog`.

## Risks / Trade-offs

- [Unlimited new words can create a review avalanche in following days] → the backlog rule
  pauses new words at 24 due and home explains why.
- [Top-up words are graded early, so their intervals grow a bit slower] → acceptable; this is the
  extra practice the learner asked for.
- [Retrievability over ~740 cards per lesson] → negligible cost.

## Migration Plan

No data migration. Deploy as usual; rollback = revert the commit (an added `lessons` field is
ignored by the old code, a stripped `newPerDay` falls back to the default 10).
