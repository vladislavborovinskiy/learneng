## Context

Exercises (`choice.tsx`, `tiles.tsx`, `typing.tsx`) report `AnswerResult` (`correct | typo |
wrong`) through `onAnswer`; `session.tsx` grades via `gradeByResult`, records the result for the
summary and requeues `wrong` items 4 positions later. `FeedbackPanel` replaces the exercise
actions after an answer. Typing shows the first letter only inside `SentenceWithBlank`; the
input is empty. `getDueWordIds` sorts due cards by `due` ascending; cards already carry
`lapses` (stored in the compact card), so no data change is needed. See proposal.md — Why.

Module guidelines this change updates: `session.md` (Glossary: exercise kinds, answer result;
Key flows 2–3; gotchas), `scheduling.md` (Glossary: lesson review order, grades).

## Goals / Non-Goals

**Goals:**

- Hints and «Не помню» are owned by the exercise UIs and surface to the session only as an
  `AnswerResult`; the session's grading/requeue logic stays one map and one condition.

**Non-Goals:**

- Per-tile checking (next change builds on the tile hint helper introduced here).

## Decisions

### 1. Extend `AnswerResult` with `hinted` and `forgot`

`AnswerResult = 'correct' | 'hinted' | 'typo' | 'wrong' | 'forgot'`; `gradeByResult` maps
`hinted → Hard`, `forgot → Again`. Exercises keep a local `hintsUsed` flag and convert
`correct`/`typo` into `hinted` before calling `onAnswer`. `session.tsx` requeues on
`wrong | forgot`; the summary counts `wrong | forgot` as mistakes. Haptics: `hinted → success`,
`forgot → warning`.

- Alternative: pass `{ result, hinted }` and let the session combine them — rejected: every
  consumer (grade, summary cells, feedback title) would need the pair; one enum value keeps the
  existing `Record<AnswerResult, …>` maps exhaustive and type-checked.

### 2. Typing prefix as a separate span inside an input-looking wrapper

The wrapper gets the `Input` border styles; inside it a non-interactive `span` with the
revealed prefix, then the existing `Input` without its own border holding only the learner's
part. Checked value = `prefix + value`. Reveal count is in letters; a space after the revealed
part is added together with the next letter; limit `max(1, floor(letters / 2))`.
`SentenceWithBlank` hint shows the same revealed prefix followed by underscores.

- Alternative: one controlled input whose value starts with the prefix, rejecting edits that
  touch it — rejected: caret and selection can still land inside the prefix, mobile
  autocorrect/IME edits arrive as whole-value replacements and fight the guard.

### 3. Tile hint = longest correct beginning + next correct tile

`hintTiles(tiles, selected, answer)` in `exercises.ts`: count leading selected tokens equal to
`answer` (case-insensitive, as `checkTiles`), truncate `selected` to that length, append the
first unused tile index whose token equals the next answer token. Duplicate tokens work because
any unused equal tile is fine.

- Alternative: highlight the next tile without placing it — rejected for now: needs extra visual
  state that the per-tile checking change will redesign anyway.

### 4. «Не помню» feedback reuses `FeedbackPanel`

New variant `forgot`: title «Запомни», hatched panel like `wrong`, body shows
`word.en — word.ru.join(', ')` then the sentence. `hinted` variant: title «Верно, с подсказкой»,
rays panel, shows «Ответ:» like `typo` (tiles have no single answer line, as today).

- Alternative: show the new-word card (`WordIntro`) — rejected: it has its own «Знаю»/«Дальше»
  semantics and would be a second screen instead of the panel in the thumb zone.

### 5. Action-zone layout

Typing and tiles: content (input / tile pool), then a row with the circle `outline` `icon-lg`
hint button (Phosphor `LightbulbIcon` bold, hidden at the limit) and outline «Не помню»
`flex-1`, then primary «Проверить» full width at the bottom. A single row of all three does not
fit at 320px (checked), and the primary action stays closest to the thumb. Choice: numbered options, then outline «Не помню» full width. All inside
`ThumbLayout` actions. Reused: `Button` sizes `icon-lg`/`lg` (as `SpeakButton`), `Input`,
`SentenceWithBlank`, `FeedbackPanel`; searched for an existing hint/prefix input — none.

### 6. Due order: lapses desc, then due asc

Only the comparator in `getDueWordIds` changes. Home counts use the length only, so they are
unaffected; top-up ordering by retrievability stays.

- Alternative: a separate «leech» queue that always takes 1–2 slots — rejected: more policy and
  constants for one learner; FSRS already shortens intervals after `Again`, the ordering only
  decides which due words get the 8 slots.

## Risks / Trade-offs

- [Lapses grow only for forgotten `Review` cards; a new word forgotten while still `Learning`
  keeps 0] → it is due within minutes anyway and returns in the next lesson.
- [Taller thumb zone: one extra row of buttons] → checked at 320×680: the tile pool, both rows
  and the sentence fit without scrolling.
- [Hint reveals half of a short word, e.g. «use» → «u»] → limit is at least the first letter,
  so 3-letter words get no extra hint; acceptable.

## Migration Plan

No stored-data change. Deploy via the usual push to `main`; rollback = revert.
