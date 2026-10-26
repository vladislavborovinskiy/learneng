# Session Module — Business Context

## What this module is for

The Duolingo-style lesson: introduce new words, drill them and due reviews with exercises whose
difficulty follows the FSRS card, give immediate feedback, finish with a summary. Code:
`web/src/screens/session.tsx`, `web/src/screens/session-summary.tsx`, `web/src/lib/exercises.ts`,
`web/src/exercises/*`.

## Glossary

- **Queue item** — `{ wordId, intro }`; `intro: true` for new words (shows the new-word card
  first).
- **Exercise kinds** (`buildExercise`, by card state):
  - no card / not `Review` → **choice** EN→RU or RU→EN (4 options);
  - `Review` with stability < 7 days → **cloze** choice (pick the missing `form`) or **tiles**
    (assemble the English sentence from shuffled tokens + 3 extra tokens), 50/50;
  - otherwise → **typing** the missing `form`, hint = first letter + underscores.
- **Distractors** — words of the same part of speech (fallback: any) that share no `ru`
  translation with the target; cloze distractors use a random sentence `form` of the other word,
  case-matched.
- **Answer result** — `correct | typo | wrong`. Typo exists only for typing: Levenshtein ≤ 1 for
  answers ≥ 4 chars, ≤ 2 for ≥ 8 chars (after trim, lowercase, collapsed spaces).

## Key flows

1. **New word** — card with `en`, translations, `note`, first sentence, 🔊. «Дальше» → the word
   is drilled right away (choice) and remembered as introduced; «Знаю» → `markKnown` (Easy), skip.
2. **Answer** — the word is graded immediately; the feedback panel replaces the actions in the
   bottom zone («Правильно!» / «Почти! Опечатка» / «Неправильно», correct answer except for tiles,
   the full sentence with translation, 🔊, «Дальше»). Haptic success/warning/error.
3. **Wrong answer** — the word is re-inserted 4 positions later and graded again when it comes
   back.
4. **Final round** — when the queue ends, every word introduced in this session is appended once
   more in random order.
5. **Summary** — «Занятие завершено»: accuracy (typo counts as correct), answers, new words,
   streak; «На главную».
6. **Exit** — Telegram BackButton (or the cross outside Telegram) returns home; already graded
   answers are kept.

## Non-obvious invariants / gotchas

- The exercise for the next item is built at advance time from the **current** progress, so a
  requeued word may get a different (easier) exercise after an `Again`.
- Each answer, including retries and the final round, is a real FSRS review — repeated grading
  within one session is intentional (short-term learning steps).
- Tiles comparison is case-insensitive with punctuation stripped; duplicate tokens are fine.
- Audio only on 🔊 (Web Speech API, `en-US`, rate 0.9) — never autoplay.
- All buttons live in the thumb zone of `ThumbLayout`; exercise UIs receive `header`, `feedback`
  and render feedback in place of their own actions.

## Where to look next

- Grades and queue composition — `scheduling.md`; sentence/`form` invariants — `content.md`;
  BackButton and haptics — `telegram.md`.
