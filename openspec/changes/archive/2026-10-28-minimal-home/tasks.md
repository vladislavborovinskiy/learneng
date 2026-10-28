## 1. Logic

- [x] 1.1 `scheduler.ts`: `getStats` drops `it`, `ngsl`, `lessonsToday`, `pace`, `unstarted` from its result — verify: `npm run typecheck`

## 2. Home

- [x] 2.1 `home.tsx`: large count + «из 737 слов», bar, row «сегодня +N» / «финиш · M YYYY», short paused hint, no source bars / tiles / test paragraph — verify in dev at 360px: fresh progress (no forecast) and seeded progress (forecast with year)

## 3. Docs & verification

- [x] 3.1 Update `.ai/guidelines/modules/scheduling.md` (home, forecast display) and the CLAUDE.md scheduler line
- [x] 3.2 Run `npm run lint && npm run typecheck` in `web/` — verify: no errors
- [x] 3.3 `openspec validate minimal-home --strict` passes
