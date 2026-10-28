## Context

`home.tsx` renders a goal panel («Выучено», count, bar, «ещё не начато», forecast sentence), two
counter tiles, two source bars, the paused hint and a level-test paragraph. `getStats` returns
`unstarted`, `pace`, `finishDate`, `learnedToday`, `lessonsToday`, `it`, `ngsl` among others;
only `home.tsx` reads them. See proposal.md — Why.

Module guidelines this change updates: `scheduling.md` (Key flows: Home; Glossary: Forecast).

## Decisions

### 1. One block, one line

Large light number (`text-6xl font-light`) + «из 737 слов» muted, a 3px bar, then one flex row:
«сегодня +N» left, «финиш · окт 2033» right (mono, muted). No glass panel around it — the
number sits on the background so the screen reads as empty space above «Урок».

- Alternative: keep the counter tiles without labels — rejected: bare «0» / «0» are ambiguous.

### 2. Month formatting by a fixed list

`FORECAST_MONTHS = ['янв', …, 'дек']` in `home.tsx`; `toLocaleDateString('ru-RU', { month:
'short' })` returns «окт.» with a dot and genitive forms, which does not match the spec.

### 3. `getStats` trimmed

Drop `it`, `ngsl`, `lessonsToday`, `pace` and `unstarted` from the return value (no other reader);
keep computing pace/unstarted internally for `finishDate`.

## Risks / Trade-offs

- [Less information on home (lessons today, per-source progress)] → requested by the learner;
  settings keep exercise accuracy for deeper stats.

## Migration Plan

No stored data. Deploy via push to `main`; rollback = revert.
