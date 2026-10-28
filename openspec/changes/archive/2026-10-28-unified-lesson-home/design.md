## Context

`buildLesson(progress, now)` takes `isBacklog(due.length)` (due ≥ `BACKLOG_THRESHOLD` = 24) to
drop new words entirely; `getNewWordIds(progress)` always fills 3 slots (2 IT + 1 NGSL).
`getStats` returns `due`, `isBacklog`, `learnedToday`, `lessonsToday`, `streak`, totals per
source. `home.tsx` shows «повторить» / «выучено сегодня» cells, «уроков сегодня» row, the
backlog hint, «Выучено X / Y» with IT/NGSL bars. `meta.days[day].learned` counts words graded for
the first time that day (lessons only; «Знаю» and the level test do not count). See
proposal.md — Why.

Module guidelines this change updates: `scheduling.md` (Glossary: lesson, backlog, learned;
Key flows: home).

## Goals / Non-Goals

**Goals:**

- One pure function decides the new-word count from the due count; home and lessons share it.

**Non-Goals:**

- A forecast that models reviews or retention — it only extrapolates new-word starts.

## Decisions

### 1. `newWordsLimit(dueCount)` with a step table

`NEW_WORDS_TAPER = [{ dueBelow: 12, count: 3 }, { dueBelow: 24, count: 2 }, { dueBelow: 48,
count: 1 }]`, otherwise 0. `getNewWordIds(progress, limit)`: NGSL slots = `limit >= 2 ? 1 : 0`
(capped by unseen NGSL), IT fills the rest; if IT runs out, NGSL fills. `isBacklog` /
`BACKLOG_THRESHOLD` are replaced by `PAUSE_NEW_WORDS_AT = 48` (used by the hint) and the table.

- Alternative: a continuous formula (e.g. `3 - floor(due / 16)`) — rejected: the same steps but
  harder to read and to quote in the spec.
- Alternative: never pause new words — rejected: at 48+ due a single new word per lesson still
  piles on reviews that are already late.

### 2. Forecast in `getStats`

`getStats` adds `unstarted` (words without a card), `pace` (sum of `days[d].learned` for the 14
local days ending today / 14) and `finishDate` (`Date | null`: today + `ceil(unstarted / pace)`
days, `null` when pace is 0 or nothing is unstarted). Days are walked with the existing `dayKey`
so local midnight rules match the streak. Formatting (`toLocaleDateString('ru-RU', { day:
'numeric', month: 'long' })`, `toLocaleString('ru-RU', { maximumFractionDigits: 1 })`) lives in
`home.tsx`.

- Alternative: average over active days only — rejected: overstates the pace after a break and
  promises an unrealistically early date.

### 3. Home layout

Main block (`--line` panel): «Выучено X из Y» (display font) + `Progress`, «ещё не начато: N»,
forecast line (mono, muted). Then a two-cell row «выучено сегодня» / «уроков сегодня» reusing the
current cell markup (the accent goes to «выучено сегодня»). Then the paused-words hint (48+ due,
hatch panel as now), then the IT / «Частотные слова» bars as now, without their own heading
(moved into the main block). Main action always «Урок». Reused: existing cell grid markup,
`Progress`, hint panel; nothing new in `components/`.

## Risks / Trade-offs

- [Behavior change for a 24–47 due backlog: one new word per lesson instead of none] →
  intended by the learner; the 48 pause keeps a safety valve.
- [Forecast jumps after a few idle days] → 14-day window smooths it; it is informational only.

## Migration Plan

No stored-data change. Deploy via push to `main`; rollback = revert.
