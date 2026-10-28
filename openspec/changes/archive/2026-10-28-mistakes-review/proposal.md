## Why

Words the learner got wrong come back once 4 items later, but the end-of-lesson round only covers
new words, so a review word that was missed and then guessed right on retry leaves the lesson
without consolidation. A lesson with many mistakes ends with the same «Ещё урок» as a good one,
and repeating the whole lesson would mostly drill words already known and the memorised order.
And a word that keeps failing comes back every 4 items forever, so the lesson never ends while
the learner keeps answering «Не помню».

## What Changes

- The final round covers every new word introduced in the lesson **and** every word that had at
  least one mistake (wrong or «Не помню») in the lesson, each once, in random order.
- A word is put back into the lesson after a mistake at most 2 times per lesson; after that a
  mistake no longer adds it back (it still gets its single final-round item).
- When lesson accuracy is below 70% and there were mistakes, the summary offers «Повторить
  ошибки» as the main action: a short lesson made only of the words with mistakes, with exercises
  built from the current progress. It follows the same rules (final round, comeback limit,
  summary) and counts as a completed lesson.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `session/lesson-flow`: final round includes missed words; comeback limited to 2 per word;
  summary offers «Повторить ошибки».

## Impact

- Code: `web/src/screens/session.tsx`, `web/src/screens/session-summary.tsx`, `web/src/App.tsx`.
- Stored data: none.
- Module guidelines: `.ai/guidelines/modules/session.md`.

## Non-goals

- Listing the missed words on the summary.
- Changing FSRS grading of repeated answers (every answer stays a real review).
- Keyboard controls and the home-screen rework — separate changes.
