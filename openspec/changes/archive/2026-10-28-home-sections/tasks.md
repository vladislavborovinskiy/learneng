## 1. Logic

- [x] 1.1 `scheduler.ts`: `getStats(progress, meta, answerStats)` drops `finishDate`, adds `accuracyWeek`, `reviewedToday`, `hardWords`; `App.tsx` passes `state.stats` — verify: `npm run typecheck`

## 2. Home

- [x] 2.1 `home.tsx`: no «финиш»; tiles; «Трудные слова»; flame streak chip — verify in dev at 360px with seeded lapses and answers, and fresh (no hard words, «—»)

## 3. Docs & verification

- [x] 3.1 Update `glass-redesign` streak requirement, `.ai/guidelines/modules/scheduling.md`, CLAUDE.md home line
- [x] 3.2 Run `npm run lint && npm run typecheck && npm run build` in `web/` — verify: no errors
- [x] 3.3 `openspec validate home-sections --strict` and `openspec validate glass-redesign --strict` pass
