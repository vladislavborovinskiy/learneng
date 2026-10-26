# Progress Module — Business Context

## What this module is for

Persisting the learner's state without a backend: FSRS cards per word, settings and per-day
stats. Inside Telegram the data lives in Telegram CloudStorage (follows the account across
devices); outside Telegram (local dev, browser) in `localStorage`. Also covers the manual backup
in settings. Code: `web/src/lib/storage.ts`, `web/src/lib/use-learning.ts`,
`web/src/screens/settings.tsx`.

## Glossary

- **Progress** — `Record<wordId, Card>` (ts-fsrs `Card`). A word without a card is unseen.
- **Meta** — `{ levelTestDone, days }`, where `days` maps a local date `'YYYY-MM-DD'`
  (`dayKey`) to `{ reviewed, learned, lessons? }`. A legacy `newPerDay` from before lessons is
  stripped on load.
- **Pack** — progress is sharded into 64 keys `p_00` … `p_63` by a string hash of the word id;
  each value is a JSON object `{ wordId: CompactCard }`. Key `meta` holds Meta.
- **CompactCard** — 9-number tuple: due (minutes since epoch), stability, difficulty (2 decimals),
  scheduled_days, learning_steps, reps, lapses, state, last_review (minutes, 0 = none).
- **Backup** — JSON `{ "p_NN": "<pack json>", …, "meta": "<meta json>" }` (values are strings),
  empty packs omitted.

## Key flows

1. **Load** — `useLearning` calls `loadAll()` once: reads every key, expands packs, merges `meta`
   over defaults. Load failure → full-screen error, nothing else works.
2. **Grade** — `grade(wordId, rating)` computes the next card, bumps today's `reviewed`, and
   `learned` if the word had no card; updates state synchronously, then writes **only the
   touched pack** and `meta` in the background.
3. **Mark known** — `markKnown(ids)` gives every still-unseen id an `Easy` card (goes straight
   to Review) and writes their packs. Does not touch Meta.
4. **Complete lesson** — `completeLesson()` bumps `days[today].lessons`; `grade` keeps the other
   fields of the day (spread), so it never resets the lesson count.
5. **Settings** — backup and retaking the level test; no daily limit.
6. **Backup** — «Скопировать прогресс» copies `exportBackup()` to the clipboard (user is told to
   keep it in Telegram «Избранное»); «Восстановить» requires a second tap («Прогресс сотрётся.
   Точно?»), validates, overwrites all 64 packs + meta, then reloads the page.

## Non-obvious invariants / gotchas

- CloudStorage keys allow only `A-Za-z0-9_-`, hence `p_NN`; old backups with `p:NN` are accepted
  and renamed on import, but `loadAll` ignores `p:` keys in storage.
- CloudStorage limits: 1024 keys, 4096 chars per value. ~12 words per pack today — fine, but grow
  the deck with that budget in mind. `meta.days` is trimmed to the last 120 days on every write.
- CloudStorage is used only when `isTelegram && isVersionAtLeast('6.9')`; older clients fall
  back to `localStorage` inside the WebView, i.e. progress is device-local there.
- `elapsed_days` is not stored (restored as 0) and timestamps are rounded to the minute; FSRS
  does not need more.
- Writes are fire-and-forget; a failure shows one sticky toast `id: 'save-error'` («Прогресс не
  сохранился») pointing to the backup. State is kept in a ref too, so several calls in one
  handler see each other's changes.
- `markKnown` does not increment `days.learned`, so words marked «Знаю» are not counted in
  «выучено сегодня».
- Import is not atomic: packs are written one by one, a failure mid-way leaves a mix.

## Where to look next

- What a card state means for exercises — `session.md`; lessons and stats — `scheduling.md`;
  Telegram API versions — `telegram.md`.
