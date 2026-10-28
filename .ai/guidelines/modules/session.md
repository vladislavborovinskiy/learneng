# Session Module — Business Context

## What this module is for

The Duolingo-style lesson: introduce new words, drill them and review items interleaved with exercises whose
difficulty follows the FSRS card, give immediate feedback, finish with a summary. Code:
`web/src/screens/session.tsx`, `web/src/screens/session-summary.tsx`, `web/src/lib/exercises.ts`,
`web/src/exercises/*`.

## Glossary

- **Queue item** — `{ wordId, intro }`; `intro: true` for new words (shows the new-word card
  first).
- **Exercise kinds** (`buildExercise`, by card state):
  - no card / not `Review` → **choice** EN→RU or RU→EN (4 numbered option rows in the thumb zone, one tap answers);
  - `Review` with stability < 7 days → **cloze** choice (pick the missing `form`) or **tiles in
    `chunks` mode** (the sentence's 2–4 chunks, shuffled so the order always changes, no extras),
    50/50;
  - 7–21 days → **typing** or **tiles in `words` mode** (single tokens + 3 extra tokens), 50/50;
  - from 21 days → **typing** the missing `form`; the input starts with the first letter as a
    fixed prefix, the blank shows the same prefix + underscores.
- **Tiles checking** — tiles are placed one at a time; a tile that is not the next part shakes,
  stays and counts as a mistake; after 2 misses at one position the right tile is highlighted;
  placed tiles cannot be removed; the last correct tile submits (no «Проверить»). Result by
  mistakes: 0 → `correct`, 1–2 → `typo` (panel «Почти! Были ошибки»), 3+ → `wrong`.
- **Exercise type** (`exerciseType`) — `en-ru | ru-en | cloze | chunks | tiles | typing`, used for
  answer stats (see `progress.md`).
- **Distractors** — words of the same part of speech (fallback: any) that share no `ru`
  translation with the target; cloze distractors use a random sentence `form` of the other word,
  case-matched.
- **Answer result** — `correct | hinted | typo | wrong | forgot`. Typo exists only for typing:
  Levenshtein ≤ 1 for answers ≥ 4 chars, ≤ 2 for ≥ 8 chars (after trim, lowercase, collapsed
  spaces). `hinted` = correct or typo after a hint; `forgot` = «Не помню». Mistakes
  (`isMistake`) = `wrong | forgot`.
- **Hints** (💡) — typing: each tap extends the fixed prefix by one letter (a space comes with the
  next letter) up to half of the letters, clears the typed text; tiles: places the next correct
  tile (hidden when one tile is left). Choice has no hint.
- **«Не помню»** — in every exercise (not on the new-word card): `Again`, panel «Запомни» with the
  word, translations and sentence.

## Key flows

1. **New word** — card with `en`, translations, `note`, first sentence, 🔊. «Дальше» → the word
   is drilled right away (choice) and remembered as introduced; «Знаю» → `markKnown` (Easy), skip.
2. **Answer** — the word is graded immediately; the feedback panel replaces the actions in the
   bottom zone (orange rays + «Правильно!» / «Почти! Опечатка», paper hatching + inverted
   «Неправильно»; correct answer except for tiles,
   the full sentence with translation, 🔊, «Дальше»). Haptic success/warning/error.
3. **Mistake** (wrong or «Не помню») — the word is re-inserted 4 positions later and graded again
   when it comes back.
4. **Final round** — when the queue ends, every word introduced in this lesson is appended once
   more in random order.
5. **Completion** — when the index runs past the queue (after the final round), `completeLesson`
   bumps `days[today].lessons`.
6. **Summary** — «Урок пройден»: one cell per answer in order (orange = correct incl. typo,
   hatched = wrong; `Session` keeps `results: AnswerResult[]`), accuracy, answers, new words,
   streak; «На главную» and «Ещё урок» (App bumps `lessonKey`, `Session` remounts and builds a
   new lesson from current progress).
7. **Exit** — Telegram BackButton (or the cross outside Telegram) returns home; already graded
   answers are kept, the lesson is not counted.

## Non-obvious invariants / gotchas

- The exercise for the next item is built at advance time from the **current** progress, so a
  requeued word may get a different (easier) exercise after an `Again`.
- Each answer, including retries and the final round, is a real FSRS review — repeated grading
  within one session is intentional (short-term learning steps).
- Tiles comparison is case-insensitive with punctuation stripped; duplicate tokens are fine (any
  unused equal tile is accepted).
- The hint state lives in the exercise component; the session only sees the resulting
  `AnswerResult`. The checked typing answer is `prefix + typed text`.
- Audio only on 🔊 (Web Speech API, `en-US`, rate 0.9) — never autoplay.
- All buttons live in the thumb zone of `ThumbLayout`; exercise UIs receive `header`, `feedback`
  and render feedback in place of their own actions.

## Where to look next

- Grades and lesson composition — `scheduling.md`; sentence/`form` invariants — `content.md`;
  BackButton and haptics — `telegram.md`.
