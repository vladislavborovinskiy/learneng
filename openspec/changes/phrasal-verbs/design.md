## Context

See proposal.md — Why. Relevant current state:

- `content/words.json` — 737 items `{ id, en, ru, pos, source: 'it' | 'ngsl', topic, rank?, note,
  sentences }`; 12 IT items are already multi-word (`pos: 'phrase'`). Exercises never assume one
  token: cloze, typing and the feedback split the sentence by `sentence.form`, tiles split by
  spaces, `check-content.mjs` checks that `form` occurs once and is not cut by chunks.
- `content.ts` exposes two queues, `itWordsOrder` and `ngslWordsOrder`; `getNewWordIds` in
  `scheduler.ts` fills slots 2 IT + 1 NGSL with fallbacks.
- `exercises.ts` picks one random sentence per exercise (`pick(word.sentences)`), distractors by
  same `pos` without shared translations.
- `getStats` returns `learned` / `total` over `words`; home renders `ofWords(total)`; strings live
  in `lib/i18n.ts` (RU + EN).

Module guideline sections to update: `content.md` — Glossary (Word `source`, Sentence `parts`,
new-words order), Key flows (generation of the phrase set, corpus), gotchas (split sentences);
`scheduling.md` — Glossary/Key flows (shared slot); `session.md` — exercise choice (joined vs split
sentences), distractors for phrases.

## Goals / Non-Goals

**Goals:**
- Phrases ride the existing card, lesson and exercise machinery; the only new data is a source
  value and an optional `parts` on split sentences.
- Content invariants stay machine-checked.

**Non-Goals:**
- A generic «sets» registry for future roadmap steps — two sources joining one slot do not justify
  it yet; it can be extracted when error messages arrive.

## Decisions

### Item shape: same Word, `source: 'phrasal'`, `pos: 'phrasal-verb' | 'phrase'`

Phrases are `Word`s with `source: 'phrasal'` and `rank` = corpus frequency rank. Phrasal verbs
get `pos: 'phrasal-verb'`, expressions reuse `'phrase'`. Ids follow the existing rule (`set-up`,
`out-of-the-box`), so progress storage, packs and backups need nothing.

Rejected: a separate `phrases.json` with its own type — every consumer (`wordsById`, stats,
exercises, hard words) would need to merge two lists. Rejected: `source: 'it'` with a flag — the
lesson slot rule and the home split need the set to be first-class.

### Split sentences: `form` is the whole span, `parts` marks the phrase

A split sentence stores `form: "set it up"` (still the exact, once-only substring) and
`parts: ["set", "up"]`. Because `form` stays contiguous, `check-content.mjs`'s occurrence and
chunk checks, `en.split(form)` and chunk building work unchanged. New checks: `parts` has two
items, `form` starts with `parts[0]` and ends with `parts[1]`, at most 2 split and at least 4
joined sentences per item, `parts` only on `phrasal-verb`.

Exercise selection: `buildExercise` passes a sentence pool — joined sentences (`!parts`) for
cloze and typing, all sentences for choice and assemblies. Feedback: when `parts` is present the
`form` span is rendered as `parts[0]` highlighted, the middle plain, `parts[1]` highlighted.

Rejected: `form: ["set", "up"]` (array) — breaks the once-only substring invariant, every
`split(form)` call and the chunk check. Rejected: a two-gap blank — new UI for cloze and typing
for 1–2 sentences per item (non-goal).

### Distractors: same source first

`distractorWords` filters candidates by `source === word.source` when the word is a phrase, then
by `pos` as today, falling back to the whole phrase set. For words nothing changes.

Rejected: relying on `pos` alone — expressions share `'phrase'` with IT terms like «source code»,
which would be guessable by shape.

### Shared slot by started share

`content.ts` adds `phrasalOrder` (by `rank`). In `getNewWordIds` the former NGSL slot becomes a
shared slot: `startedShare(order) = started / order.length`, take from the queue with the smaller
share (tie → NGSL); fallbacks fill from the remaining queues in order IT → shared winner → other.
Computed from `progress`, nothing stored.

Rejected: alternating by lesson count in `meta` — needs stored state and ignores the level-test
head start of NGSL. Rejected: taking an IT slot — IT is the core goal.

### Home split

`getStats` adds `learnedWords` (it + ngsl) and `learnedPhrases`; `total` and `learned` keep
covering all items. Home puts `t.home.split(learnedWords, learnedPhrases)` on the left of the row
under the bar and «сегодня +N» on the right (row becomes `justify-between`). New strings in both
dictionaries: `слова N · фразы M` / `words N · phrases M`.

Rejected: two bars — the user chose one total with a breakdown line.

### Corpus and list

One-off offline work in `content/draft/phrasal/` (gitignored like the rest of `draft/`):
1. Download docs as Markdown: MDN content (CC BY-SA 2.5), react.dev (CC BY 4.0), GitHub Docs
   (CC BY 4.0) — sparse clone of the content folders only.
2. Candidate list (~200 phrasal verbs and expressions) assembled by hand + LLM.
3. A counting script (in `content/draft/phrasal/`) counts each candidate with inflections
   (`set/sets/setting`, `roll/rolled`) and split occurrences (particle within 3 tokens), writes
   `counts.json`.
4. Keep the top ~80 verbs and ~40 expressions, drop those already in `words.json`.
5. Generate items in batches with the same LLM-subagent flow as words and chunks
   (`content/draft/phrasal/instruction.md`, `input_N.json` → `items_N.json`), merge, run
   `check-content.mjs`.

Rejected: PHaVE list — general English, many items rare in docs. Rejected: committing the corpus
— hundreds of MB, only counts matter.

## Risks / Trade-offs

- [Typing a phrasal verb is longer, typo tolerance is per string] → Levenshtein on the whole
  answer already allows 2 typos from 8 chars; acceptable.
- [Translations of phrasal verbs overlap with words («set up» = «настроить» ≈ «configure»)] → the
  shared-translation filter already prevents ambiguous options; keep `ru` precise.
- [WordTitle sizing for 3-word expressions] → it sizes by the longest word, same as existing
  multi-word IT terms; check «take into account» at 320 px.
- [Bundle +~16%] → acceptable; revisit splitting content when the reading track adds texts.
- [Counting heuristics over-count «set … up» across clauses] → limit the gap to 3 tokens and
  spot-check top items by hand.

## Migration Plan

No data migration: new ids, existing cards untouched. The home total jumps from 737 to ~857 on
release. Rollback: revert; cards of started phrases stay in storage as orphans and are ignored.
