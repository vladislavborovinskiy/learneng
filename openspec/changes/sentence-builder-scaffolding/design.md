## Context

`buildExercise` picks by card: not `Review` → choice EN→RU/RU→EN; `Review` with stability < 7 →
cloze or word tiles 50/50; otherwise typing. Word tiles = `tokenize(sentence.en)` + 3 extras;
`Tiles` lets the learner place/remove freely and checks on «Проверить». With ts-fsrs default
weights a word graduates to `Review` with stability ≈ 2.3 days (Good) and the next successful
review lifts it above 7, so today's tiles hit almost every freshly learned word — exactly the
learner's weakest point. `hints-and-forgot` added `hintTiles`, `withHint`, `isMistake` and the
`hinted`/`forgot` results. Storage keeps `p_NN` packs and `meta` (CloudStorage value limit 4096
chars, server limit 64 KB). See proposal.md — Why.

Module guidelines this change updates: `content.md` (Glossary: Sentence; gotchas: validation),
`session.md` (Glossary: exercise kinds, answer result; Key flows 2), `progress.md` (Glossary:
storage keys; backup).

## Goals / Non-Goals

**Goals:**

- Chunk data is produced once, validated by a script that stays in the repo.
- Stats storage never hits the 4096-char CloudStorage limit.

**Non-Goals:**

- Re-tuning FSRS or the choice/cloze stages.

## Decisions

### 1. Chunk boundaries as word indices: `chunks: number[]` on each sentence

`"chunks": [1, 4]` — start indices of chunks 2…n in `en.split(' ')`. ~16 chars per sentence
(~70 KB raw over 4422 sentences, ~7% of `words.json`, far less gzipped). `chunkTexts(sentence)`
in `exercises.ts` slices words by the indices and strips punctuation like `tokenize`.

- Alternative: store chunk strings — rejected: duplicates every sentence (~+200 KB) and needs a
  separate text-equality check.
- Alternative: compute chunks at runtime with a POS tagger (`compromise`, tried offline) —
  rejected: ~1/3 of splits are wrong («for personal | use») and it adds a dependency to the
  bundle.

### 2. Generation: LLM subagents over drafts, merge + validate script

`scripts/check-content.mjs` (Node, no deps): validates `form` occurs exactly once in `en` and,
when present, `chunks` is strictly increasing, within `1..words-1`, gives 2–4 chunks, and
sentences of 2–3 words are split per word, and `form` does not cross a chunk boundary; prints offending ids and exits 1. Drafts:
`content/draft/chunks_input_{1..6}.json` (`{ id, i, en }` per sentence) → six subagents write
`content/draft/chunks_{1..6}.json` (`{ id, i, chunks }`) following one shared instruction with
examples → merge into `words.json` → `check-content.mjs`. Invalid entries are re-sent to a
subagent, not hand-fixed silently.

- Alternative: one agent for all 4422 sentences — rejected: too long for one context, quality
  drifts; six slices run in parallel.

### 3. Exercise kinds: `TilesExercise` gets `mode: 'chunks' | 'words'`

`buildExercise`: `Review` & stability < 7 → cloze | tiles(chunks); 7 ≤ stability < 21 → typing |
tiles(words, 3 extras); ≥ 21 → typing. Constants `FAMILIAR_STABILITY_DAYS = 7`,
`MATURE_STABILITY_DAYS = 21`. Answer stays `string[]` (chunk texts or tokens), so per-tile
checking and `hintTiles` work for both modes.

- Alternative: a separate `ChunksExercise` kind with its own component — rejected: identical UI
  and logic, only the token source differs.

### 4. Per-tile checking inside `Tiles`

State: `placed: number[]`, `mistakes`, `missesHere` (reset on each placed tile). Tap → if
`tiles[i]` matches `answer[placed.length]` (case-insensitive) place it, else shake (CSS
`@keyframes shake` in `index.css`, re-triggered by a key on the tile) and count. `missesHere >= 2`
→ the first unused matching tile gets `border-primary`. When `placed.length === answer.length`,
call `onAnswer` with `0 → correct, 1–2 → typo, 3+ → wrong`, then `withHint`. `hintTiles` reduces
to «append next correct tile»; it stays in `exercises.ts`.

- Alternative: keep free placement + «Проверить» and only colour the first wrong tile after
  checking — rejected: still makes the learner guess the whole order before any feedback, which
  is what fails today.

### 5. Tiles `typo` title

`FeedbackPanel` uses «Почти! Были ошибки» when `exercise.kind === 'tiles'` and result is `typo`;
the result enum stays as is. Alternative: a new `AnswerResult` value — rejected: same grade and
styling as `typo`, only the wording differs.

### 6. Stats in a separate `stats` key, 30 days

Kinds: `en-ru | ru-en | cloze | chunks | tiles | typing` derived from the exercise in
`session.tsx` when answering; `useLearning.recordAnswer(kind, correct)` updates state via the same
ref + commit pattern and saves `stats`. Worst case ~6 kinds × ~12 chars + date ≈ 100 chars/day →
~3 KB for 30 days. `syncedStore` mirror filter and `loadAll` learn the key; backup export/import
ignore it.

- Alternative: inside `meta.days` — rejected: `meta` already holds up to 120 days × ~55 chars,
  which is over the 4096 CloudStorage limit by itself (separate issue, see Risks); adding stats
  there makes it worse.

### 7. Settings block

A read-only list under the existing settings content (no buttons, thumb-zone rule kept): rows
«<name> — N% · total» styled like the summary rows (`border-b border-foreground/35`). Reused:
summary row markup pattern; searched for an existing stats list component — none.

## Risks / Trade-offs

- [LLM chunking mistakes] → script validates structure; a sample of 50 sentences is reviewed by
  hand before merging; wrong splits can be fixed in `words.json` later without code changes.
- [Stage shift: word tiles now meet familiar words, typing share drops for 7–21 days] → intended;
  the stats block shows whether accuracy moves.
- [`meta` exceeds 4096 chars after ~75 days of use (pre-existing, not caused by this change)] →
  reported to the user; fix as a separate small change (fewer stored days).

- [Restoring a backup replaces all server keys, so `stats` is reset after an import] →
  acceptable for diagnostic data; documented in `progress.md`.

## Migration Plan

Content and code ship together in one deploy. `stats` starts empty. Rollback = revert; an
orphan `stats` key is ignored by older builds.
