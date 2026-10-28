## 1. Content

- [ ] 1.1 `scripts/check-content.mjs`: validate `form` once per `en` and `chunks` rules (increasing, in range, 2–4 chunks, per-word for 2–3-word sentences) — verify: `node scripts/check-content.mjs` passes on current `words.json` (no `chunks` yet) and fails on a hand-broken copy
- [ ] 1.2 Write `content/draft/chunks_input_{1..6}.json` and the shared chunking instruction with examples — verify: 4422 sentences across the six files
- [ ] 1.3 Run six subagents → `content/draft/chunks_{1..6}.json`; merge into `content/words.json`; re-send invalid entries — verify: `node scripts/check-content.mjs` passes, every sentence has `chunks`
- [ ] 1.4 Review a random sample of 50 chunked sentences by hand — verify: listed in the chat, no split inside a phrase
- [ ] 1.5 `content.ts`: `Sentence` type gains `chunks: number[]` — verify: `npm run typecheck`

## 2. Logic & storage

- [ ] 2.1 `exercises.ts`: `TilesExercise.mode`, `chunkTexts`, stages by stability (7 / 21), `hintTiles` = next correct tile — verify: `npm run typecheck`; dev with seeded cards (stability 3 / 10 / 30) gives cloze|chunks, typing|words, typing
- [ ] 2.2 `storage.ts`: `stats` key (load, save with 30-day trim, mirror filter), excluded from backup — verify: after answers `learneng:stats` appears in localStorage; export backup has no `stats`
- [ ] 2.3 `use-learning.ts`: `recordAnswer(kind, correct)` via ref + commit — verify: two answers in one handler both counted

## 3. UI

- [ ] 3.1 `index.css`: `shake` keyframes/utility — verify: wrong tile visibly shakes in dev
- [ ] 3.2 `tiles.tsx`: per-tile placement, mistakes, highlight after 2 misses, auto-submit, hint, «Не помню», no «Проверить» — verify in dev at 320px: wrong tap shakes; 2 misses highlight; completion shows the panel; 0/2/4 mistakes give «Правильно!» / «Почти! Были ошибки» / «Неправильно»
- [ ] 3.3 `feedback-panel.tsx`: tiles `typo` title — verify: covered by 3.2
- [ ] 3.4 `session.tsx`: call `recordAnswer` with the exercise type — verify: `stats[today]` counts by type
- [ ] 3.5 `settings.tsx`: «Точность по упражнениям» block — verify: rows appear after answers, block hidden with empty stats

## 4. Docs & verification

- [ ] 4.1 Update `.ai/guidelines/modules/content.md`, `session.md`, `progress.md`; CLAUDE.md (layout: `chunks`, `stats` key, script)
- [ ] 4.2 Run `npm run lint && npm run typecheck` in `web/` — verify: no errors
- [ ] 4.3 `openspec validate sentence-builder-scaffolding --strict` passes
