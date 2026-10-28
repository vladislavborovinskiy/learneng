## Context

`Session` builds its queue once with `buildLesson(progress)`, keeps `introduced` (new words shown
in the lesson) and `finalRoundAdded`, and in `advance()` appends the shuffled `introduced` words
when the index runs past the queue. `handleAnswer` splices a retry 4 positions later on
`isMistake(answer)` with no limit. `SessionSummary` gets `results` and offers «На главную» /
«Ещё урок»; `App` remounts `Session` by bumping `lessonKey`. See proposal.md — Why.

Module guidelines this change updates: `session.md` (Key flows 3–6, gotchas).

## Goals / Non-Goals

**Goals:**

- All logic stays inside `Session`/`App` state; the lesson builder and storage are untouched.

**Non-Goals:**

- Persisting the mistakes list across app restarts.

## Decisions

### 1. Track mistakes per word in `Session`

Two new pieces of state next to `introduced`: `comebacks: Record<wordId, number>` and
`missed: string[]` (unique, insertion order). `handleAnswer` on a mistake adds the word to
`missed` and, if `(comebacks[id] ?? 0) < MAX_COMEBACKS (2)`, splices the retry and increments.

- Alternative: derive missed words from `results` — rejected: `results` holds only outcomes, and
  adding word ids to it would change the summary cell rendering for no gain.

### 2. Final round = unique(`introduced` ∪ `missed`), shuffled

Built in `advance()` at the same point as today, once (`finalRoundAdded`). Mistakes after the
round is added still requeue (within the limit) but do not extend the round — follows from
building it once.

### 3. «Повторить ошибки» = `Session` with given items

`Session` gets an optional `items?: LessonItem[]` prop: `useState(() => items ?? buildLesson(progress))`.
`App` keeps `mistakeItems: LessonItem[] | null`; `onRepeatMistakes(wordIds)` sets it to
`wordIds.map((wordId) => ({ wordId, intro: false }))` and bumps `lessonKey`; «Ещё урок» resets it
to `null`. Exercises are built at advance time from current progress as today, so a word that
just dropped to `Relearning` gets the easier choice exercise. Completion calls `onComplete` like
any lesson.

- Alternative: a separate `MistakesSession` screen — rejected: identical flow; only the initial
  queue differs.
- Alternative: replay the original lesson queue — rejected (see proposal: memorised order,
  mostly known words).

### 4. Summary layout

Accuracy `< 70` and `missed.length > 0` → primary full-width «Повторить ошибки» on its own row
above an outline row «На главную» + outline «Ещё урок» `flex-1`; otherwise the current row
unchanged. Constant `REPEAT_MISTAKES_ACCURACY = 70` in `session-summary.tsx`. Reused: `Button`,
the existing two-button row; the two-row thumb zone mirrors the typing/tiles layout from
`hints-and-forgot` (checked to fit at 320px there).

## Risks / Trade-offs

- [Same-day repeated reviews of the same word in a mistakes lesson] → intentional short-term
  steps, as documented in `session.md`; FSRS handles small elapsed times.
- [Counting a mistakes lesson towards «Уроков сегодня»] → it is real practice; keeps completion
  logic single-path.

## Migration Plan

No stored-data change. Deploy via push to `main`; rollback = revert.
