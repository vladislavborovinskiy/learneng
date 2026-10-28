## Context

Home (`home.tsx`) shows the learned count, a bar and the «сегодня / финиш» row; `getStats`
computes the 14-day pace from `meta.days[*].learned` but returns only `finishDate`. The project
is shadcn (`components.json`, style base-nova) without a chart component yet. See proposal.md.

Module guidelines this change updates: `scheduling.md` (Home flow), `progress.md` (Settings flow).

## Decisions

### 1. shadcn `chart` + Recharts `LineChart`

`npx shadcn add chart` adds `components/ui/chart.tsx` (ChartContainer / ChartTooltip /
ChartConfig) and `recharts`. `components/pace-chart.tsx` renders `LineChart` with `Line`
(`type="monotone"`, 2px, round caps, `var(--color-learned)` = sage), an `Area`-like gradient
via `<defs>` at ~12% opacity, `CartesianGrid vertical={false}` hairline `--track`, `XAxis`
(4 ticks, «28 окт»), `YAxis` (allowDecimals false, width ~24), active dot 8px, last point
marked with a dot. Tooltip content = custom glass plate (`glass rounded-xl`), text in text
tokens, not the series colour.

- Alternative: hand-written SVG — rejected by the learner in favour of the shadcn canon.

### 2. Data from `getStats`

`getStats` adds `paceSeries: { day: string; learned: number }[]` for the same 14 days it sums
for the pace (oldest → today), so chart and forecast always agree.

### 3. Lazy load

`home.tsx` imports `PaceChart` via `React.lazy` + `Suspense` with a fixed-height empty
placeholder (same height), so Recharts loads in its own chunk and does not delay the number and
«Урок»; no layout shift.

## Risks / Trade-offs

- [+~100 KB gzip] → separate chunk, cached after first load.
- [Recharts tooltip on touch] → `trigger` default works on tap in iOS WebView; verified in
  device emulation.

## Migration Plan

No stored data. Deploy via push to `main`; rollback = revert.
