## 1. Scheduling logic

- [x] 1.1 `scheduler.ts`: `newWordsLimit(due)` taper table, `getNewWordIds(progress, limit)` (2 slots → 1 IT + 1 NGSL, 1 slot → IT), `PAUSE_NEW_WORDS_AT = 48`, remove `isBacklog`/`BACKLOG_THRESHOLD` — verify in dev: lessons built with 5 / 15 / 30 / 50 due words contain 3 / 2 / 1 / 0 new words of the specified sources
- [x] 1.2 `scheduler.ts`: `getStats` adds `unstarted`, `pace`, `finishDate`; drops `isBacklog` — verify: with seeded `meta.days` (70 new words over the last 14 days, 400 unstarted) on 28 Oct the date is 16 January

## 2. Home

- [x] 2.1 `home.tsx`: main block «Выучено X из Y» + bar + «ещё не начато: N» + forecast / «начни урок, чтобы увидеть прогноз»; row «выучено сегодня» / «уроков сегодня»; hint only at 48+ due; button always «Урок» — verify in dev at 320px with fresh progress and with seeded progress (forecast shown, no «повторить»)

## 3. Docs & verification

- [x] 3.1 Update `.ai/guidelines/modules/scheduling.md` (taper, no backlog lesson, home block, forecast) and the scheduler line in CLAUDE.md
- [x] 3.2 Run `npm run lint && npm run typecheck` in `web/` — verify: no errors
- [x] 3.3 `openspec validate unified-lesson-home --strict` passes
