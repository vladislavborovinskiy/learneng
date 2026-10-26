## 1. Data & logic

- [x] 1.1 `storage.ts`: remove `newPerDay` from `Meta`/`defaultMeta`, add optional `lessons` to `DayStats`, strip legacy `newPerDay` in `loadAll` — verify: `npm run typecheck`, app loads existing localStorage progress without errors
- [x] 1.2 `scheduler.ts`: add `buildLesson` with constants (3 new, 8 reviews, backlog 24, warm-up 2), top-up by lowest retrievability among non-due `Review` cards, interleaving; remove `getNewWordIds`; `getStats` returns `learnedToday`, `lessonsToday`, `isBacklog` instead of `newToday` — verify: in dev, with 0 progress a lesson has only 3 new words; after learning words, a lesson shows warm-up reviews before the first new word
- [x] 1.2a `content.ts`/`scheduler.ts`: new words per lesson = 2 IT + 1 NGSL, the other source fills when one runs out — verify: fresh lesson shows 2 IT words and 1 NGSL word
- [x] 1.3 `use-learning.ts`: add `completeLesson()` incrementing `days[today].lessons` via ref + commit + `saveMeta` — verify: after a finished lesson `meta.days[today].lessons` grows in localStorage

## 2. UI

- [x] 2.1 `session.tsx`: build the queue with `buildLesson`, drop `extraNew`, call `completeLesson` when the queue is exhausted — verify: finish a lesson → summary; leave early → lesson count unchanged
- [x] 2.2 `session-summary.tsx`: «Ещё урок» + «На главную»; `App.tsx`: `lessonKey` remount, remove `EXTRA_NEW_WORDS`/`extraNew` — verify: «Ещё урок» starts a fresh lesson with new words while not in backlog
- [x] 2.3 `home.tsx`: main action «Урок»/«Повторение», counters «повторить» and «выучено сегодня», lessons today, backlog hint — verify: with ≥ 24 due (shift card due dates in localStorage) the button reads «Повторение» and the hint is shown
- [x] 2.4 `settings.tsx`: remove «Новых слов в день» — verify: settings shows only backup and level test; restoring an old backup containing `newPerDay` works

## 3. Docs & verification

- [x] 3.1 Update `.ai/guidelines/modules/scheduling.md`, `session.md`, `progress.md` and CLAUDE.md (scheduler and settings lines)
- [x] 3.2 Run `npm run lint && npm run typecheck` in `web/` — verify: no errors
- [x] 3.3 `openspec validate lesson-flow --strict` passes
