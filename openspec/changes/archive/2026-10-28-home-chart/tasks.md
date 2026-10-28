## 1. Data & component

- [x] 1.1 `scheduler.ts`: `getStats` returns `paceSeries` (14 days, oldest → today) — verify: `npm run typecheck`
- [x] 1.2 `npx shadcn add chart` (recharts) and `components/pace-chart.tsx` styled per design — verify: `npm run build`, chart in its own chunk

## 2. Screens

- [x] 2.1 `home.tsx`: lazy `PaceChart` under the row, fixed-height placeholder — verify in dev at 360px: fresh (flat 0) and seeded data, tooltip on tap
- [x] 2.2 `settings.tsx`: caption removed — verify in dev

## 3. Docs & verification

- [x] 3.1 Update `.ai/guidelines/modules/scheduling.md`, `progress.md`; CLAUDE.md home line
- [x] 3.2 Run `npm run lint && npm run typecheck && npm run build` in `web/` — verify: no errors
- [x] 3.3 `openspec validate home-chart --strict` passes
