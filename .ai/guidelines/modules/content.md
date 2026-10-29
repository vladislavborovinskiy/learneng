# Content Module — Business Context

## What this module is for

The word bank and the level test, shipped inside the bundle. The goal of the app is reading
technical documentation, so the deck is IT vocabulary first, then general high-frequency words.
There is no CMS and no runtime fetch: changing content means editing JSON in `content/` and
redeploying. Entry point in code: `web/src/lib/content.ts` (imported via the `@content` alias).

## Glossary

- **Word** — `{ id, en, ru[], pos, source, topic, rank?, note, sentences[] }`.
  - `id` — lowercase `en`, multi-word phrases joined with `-` (`source-code`,
    `environment-variable`). It is the key of the FSRS card in storage — **never rename an id**
    of an existing word, the user's progress for it would be orphaned.
  - `ru` — translations, the first one is the canonical answer in EN→RU choice.
  - `pos` — `noun | verb | adj | adv | prep | conj | pron | det | phrase`; drives distractor
    selection.
  - `source` — `it` (237 words, dictionary alexey-goloburdin/eng-ru-dictionary, `topic` set:
    programming, general, development, network, files, os, databases, hardware, users) or `ngsl`
    (500 words of the New General Service List, CC BY-SA, `rank` = frequency rank, `topic` null).
  - `note` — optional usage hint shown on the new-word card (~420 words have one).
- **Sentence** — `{ en, ru, form, chunks }`, six per word. `form` is the exact substring of `en`
  that realizes the word (inflected, original case) and occurs **exactly once** in `en`; cloze,
  typing and the blank rendering rely on it. `chunks` — start indices (in `en.split(' ')`) of
  chunks 2…n for «Собери из кусков»: 2–4 natural phrases (subject / verb group / object /
  prepositional phrase / clause), per word for 2–3-word sentences, `form` never cut.
- **New-words order** — two queues: `itWordsOrder` (file order) and `ngslWordsOrder` (ascending
  `rank`); a lesson takes 2 IT + 1 NGSL (see `scheduling.md`).
- **Preloader facts** (`content/facts.json`) — `[{ en, ru, source }]`, short verified facts about
  English, its history, its links with Russian, learning and IT words; ≤ 12 English / ≤ 14 Russian
  words so they can be read in ~2.5 s. Not in the bundle: the `preloader-facts` Vite plugin
  inlines `[en, ru]` pairs into `index.html`. `check-content.mjs` checks lengths and duplicates.
- **Level test** (`content/level_test.json`) — `bands` (rank ranges 1–500 … 2001–2809), 100
  `words` `{ en, rank }` sampled from NGSL across the bands, 15 `pseudo` non-words.

## Key flows

1. **Generation** was a one-off offline process (LLM-assisted) whose intermediate files live in
   `content/draft/` (`input_*`, `words_*`, `ngsl_*`, merged). There is no generator script in
   the repo; drafts are kept for reference and re-runs, the app never reads them.
2. **Consumption** — `words`, `wordsById`, `itWordsOrder`, `ngslWordsOrder` from `content.ts`; the level test is
   imported directly by `screens/level-test.tsx`.

## Non-obvious invariants / gotchas

- `node scripts/check-content.mjs` validates the `form` and `chunks` invariants — run it after any
  edit of `words.json`. Chunks were produced once by LLM subagents
  (`content/draft/chunks_instruction.md`, `chunks_input_N.json` → `chunks_N.json`, merged by
  `content/draft/merge_chunks.mjs`, which keeps the file format and runs the check).
- The `form`-occurs-once invariant is not checked at runtime; a violation silently breaks the
  blank in cloze/typing. Validate it when adding or editing sentences.
- Only 24 of the 100 level-test words exist in `words.json` (ids match by lowercase `en`).
  The other 76 affect only the band estimate, not the deck.
- Distractors exclude any word sharing a `ru` translation with the target, so near-synonyms with
  identical translations never compete — keep translations precise rather than broad.
- Adding words to the middle of the `it` list changes the order of new words for an existing
  user but is otherwise safe; removing a word leaves an orphan card in storage (ignored by the UI).
- The bundle includes the whole `words.json`; size matters for a Mini App on mobile data.

## Where to look next

- How cards for these ids are stored — `progress.md`; how new words are queued — `scheduling.md`;
  how sentences become exercises — `session.md`; the test itself — `level-test.md`.
