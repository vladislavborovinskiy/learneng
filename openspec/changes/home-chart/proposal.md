## Why

The minimal home screen leaves the middle empty, and the forecast «финиш · …» has nothing that
shows where it comes from. A small line chart of new words per day fills the space with the
one thing worth seeing on home — the learning pace. The settings caption about server storage
is noise the learner does not need.

## What Changes

- Home: a line chart under the «сегодня / финиш» row — X: the last 14 local days, Y: new words
  started that day (the same numbers the forecast pace uses). One sage line with a faint area,
  hairline grid, small mono axis labels, today's point marked, tap/hover tooltip «28 окт · +3»
  in a glass plate. Built with the shadcn chart component (Recharts), restyled to the glass
  look.
- Settings: the caption «Прогресс хранится на сервере · копия приходит в чат с ботом каждую ночь»
  is removed.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `scheduling/home`: new requirement for the pace chart.
- `progress/settings`: settings content without the caption.

## Impact

- Code: `web/src/components/ui/chart.tsx` (added via shadcn), `web/src/components/pace-chart.tsx`,
  `web/src/screens/home.tsx`, `web/src/lib/scheduler.ts` (per-day series), `web/src/screens/settings.tsx`.
- Dependencies: `recharts` (~+100 KB gzip); the chart is lazy-loaded so the number and «Урок»
  render first.
- Stored data: none (uses `meta.days[*].learned`).
- Module guidelines: `scheduling.md`, `progress.md`.

## Non-goals

- Charts of reviews, accuracy or learned (long-term) words.
- Choosing the period on home.
