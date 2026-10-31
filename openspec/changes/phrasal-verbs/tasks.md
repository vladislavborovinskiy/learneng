## 1. Corpus & list

- [ ] 1.1 Sparse-clone MDN content, react.dev and GitHub Docs Markdown into `content/draft/phrasal/corpus/` — verify: `du -sh` and file counts per source are printed, licences noted in `content/draft/phrasal/README.md`
- [ ] 1.2 Candidate list `candidates.json` (~200 phrasal verbs and expressions, `separable` flag for verbs) — verify: no candidate equals an existing `words.json` `en`
- [ ] 1.3 Counting script → `counts.json` (inflections, split occurrences with gap ≤ 3 tokens) — verify: spot-check 5 top items by grepping the corpus, counts within ±10%
- [ ] 1.4 Pick top ~80 verbs and ~40 expressions into `phrasal_list.json` with `rank` — verify: list reviewed with the user before generation

## 2. Content

- [ ] 2.1 Instruction + batches for LLM subagents (`instruction.md`, `input_N.json` → `items_N.json`): `ru`, `note`, 6 sentences with `form`, `chunks`, and `parts` on 1–2 split sentences of separable verbs — verify: one batch reviewed by hand first
- [ ] 2.2 Merge into `content/words.json` with `source: 'phrasal'`, `pos: 'phrasal-verb' | 'phrase'` — verify: 857±10 items, ids unique
- [ ] 2.3 `scripts/check-content.mjs`: `parts` rules (two items, `form` starts/ends with them, only on `phrasal-verb`, ≤ 2 split and ≥ 4 joined per item) — verify: script passes on the merged file and fails on a hand-broken copy

## 3. Logic

- [ ] 3.1 `content.ts`: `source` and `pos` types, `Sentence.parts?`, `phrasalOrder` — verify: `npm run typecheck`
- [ ] 3.2 `scheduler.ts`: shared slot by started share (tie → NGSL) with fallbacks; `getStats` adds `learnedWords` / `learnedPhrases` — verify in dev with seeded progress: 30% NGSL / 10% phrases → lesson has 2 IT + 1 phrase; 30% / 35% → 2 IT + 1 NGSL; all NGSL known → 2 IT + 1 phrase
- [ ] 3.3 `exercises.ts`: joined-only pool for cloze and typing; phrase distractors from the phrase set — verify in dev: 20 exercises for «set up» never show a split sentence in cloze/typing, cloze options are all phrases

## 4. UI

- [ ] 4.1 Feedback panel highlights `parts` and leaves the middle plain — verify in dev: «We set it up yesterday.» shows «set» and «up» highlighted
- [ ] 4.2 Home: split line «слова A · фразы B» left, «сегодня +N» right; strings in `ru` and `en` — verify in dev at 320 px in both languages
- [ ] 4.3 New-item card and word title for the longest expression — verify in dev at 320 px: «take into account» fits

## 5. Docs & verification

- [ ] 5.1 Update `.ai/guidelines/modules/content.md`, `scheduling.md`, `session.md` and CLAUDE.md (counts 737 → total, phrase set, roadmap step 1 done)
- [ ] 5.2 Run `node scripts/check-content.mjs` and `npm run lint && npm run typecheck` in `web/` — verify: no errors
- [ ] 5.3 `openspec validate phrasal-verbs --strict` passes
