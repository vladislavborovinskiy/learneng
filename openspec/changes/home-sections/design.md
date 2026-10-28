## Context

`getStats` returns `isNewWordsPaused`, `finishDate`, `learnedToday`, `paceSeries`, `streak`,
`total`, `learned`; home renders the number, bar, «сегодня / финиш» row, lazy `PaceChart`.
Answer statistics live in `state.stats` (`AnswerStats`, 30 days), passed today only to settings.
See proposal.md.

Module guidelines this change updates: `scheduling.md` (Home flow, Forecast glossary entry).

## Decisions

### 1. `getStats(progress, meta, answerStats)`

Drops `finishDate` (and the pace sum only it used — `paceSeries` stays for the chart). Adds
`accuracyWeek: number | null` (sum over the 7 local days of all exercise types), `reviewedToday`,
`hardWords: { id, en, ru, lapses }[]` (cards with `lapses > 0`, sorted by lapses desc, then
`last_review` desc, top 3). `App` passes `state.stats`.

- Alternative: compute tiles inside `home.tsx` — rejected: keeps all home figures in one pure
  function like today.

### 2. Layout

Tiles = the `glass rounded-3xl p-4` tiles from the earlier home (large light number + caption).
Hard words = `glass rounded-3xl p-5` with a `text-sm font-medium` title and rows `en` (medium) /
`ru` (muted, truncated) / dots (`size-1.5 rounded-full bg-destructive`). Section order: chart,
tiles, hard words, paused hint.

### 3. Streak flame

`FlameIcon` (`@phosphor-icons/react/dist/csr/Flame`, `weight="fill"`, `size-3.5`) replaces the dot:
`text-warning` (sand) when streak > 0, `text-muted-foreground` at 0. Updates the `glass-redesign`
streak requirement (not yet archived) in place.

## Risks / Trade-offs

- [Home gets taller than one screen with a long hard-words list] → capped at 3 rows; content area
  scrolls if a small phone needs it.

## Migration Plan

No stored data. Deploy via push to `main`; rollback = revert.
