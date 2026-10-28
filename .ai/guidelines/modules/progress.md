# Progress Module — Business Context

## What this module is for

Persisting the learner's state: FSRS cards per word, settings and per-day stats. Inside
Telegram the source of truth is the server (Cloudflare Worker + D1, `worker/`), with Telegram
CloudStorage as a byte-identical local mirror and offline fallback; outside Telegram (local dev,
browser) or without `VITE_API_URL` — CloudStorage / `localStorage` only, as before the server.
Also covers the manual backup in settings and the daily backup file from the server. Code:
`web/src/lib/storage.ts`, `web/src/lib/use-learning.ts`, `web/src/screens/settings.tsx`,
`worker/src/`.

## Glossary

- **Progress** — `Record<wordId, Card>` (ts-fsrs `Card`). A word without a card is unseen.
- **Meta** — `{ levelTestDone, days }`, where `days` maps a local date `'YYYY-MM-DD'`
  (`dayKey`) to `{ reviewed, learned, lessons? }`. Stored compactly as
  `[reviewed, learned, lessons]` per day (`serializeMeta`); `loadAll` also reads the older object
  form, so old storage and backups stay valid. A legacy `newPerDay` from before lessons is
  stripped on load.
- **Pack** — progress is sharded into 64 keys `p_00` … `p_63` by a string hash of the word id;
  each value is a JSON object `{ wordId: CompactCard }`. Key `meta` holds Meta. Key `stats` holds
  answer statistics `{ "YYYY-MM-DD": { "<exercise type>": [correct, total] } }`, last 30 days
  (`recordAnswer` in `useLearning`, «Не помню» and wrong count as incorrect).
- **CompactCard** — 9-number tuple: due (minutes since epoch), stability, difficulty (2 decimals),
  scheduled_days, learning_steps, reps, lapses, state, last_review (minutes, 0 = none).
- **Store** — `KeyValueStore` (`getAll`, `set`, optional atomic `replaceAll`). Picked once:
  `syncedStore` (Telegram + CloudStorage ≥ 6.9 + `VITE_API_URL`), `cloudStore`, `localStore`.
  `syncedStore` combines `cloudStore` and `apiStore` (HTTP to the Worker).
- **Unsynced keys** — keys whose server write failed; JSON array in CloudStorage key `unsynced`,
  pushed on the next successful write or launch.
- **Server table** — D1 `kv(user_id, key, value, updated_at)`, one row per key per Telegram user;
  API `GET /progress`, `PUT /progress/:key`, `PUT /progress` (replace all in one batch), auth
  header `Authorization: tma <initData>`.
- **Backup** — JSON `{ "p_NN": "<pack json>", …, "meta": "<meta json>" }` (values are strings),
  empty packs omitted.

## Key flows

1. **Load** — `useLearning` calls `loadAll()` once: reads every key, expands packs, merges `meta`
   over defaults. Load failure → full-screen error, nothing else works. With `syncedStore`:
   read CloudStorage → `GET /progress` → if the server answered with no entries and CloudStorage
   has data, upload everything (migration) → otherwise push unsynced keys, overlay them on the
   server result, refresh CloudStorage with server values → use server values. Any server error
   (4 s timeout) → silently use CloudStorage.
2. **Grade** — `grade(wordId, rating)` computes the next card, bumps today's `reviewed`, and
   `learned` if the word had no card; updates state synchronously, then writes **only the
   touched pack** and `meta` in the background. With `syncedStore` each write goes to
   CloudStorage first (failure → toast), then to the server (failure → key becomes unsynced,
   no toast).
3. **Mark known** — `markKnown(ids)` gives every still-unseen id an `Easy` card (goes straight
   to Review) and writes their packs. Does not touch Meta.
4. **Complete lesson** — `completeLesson()` bumps `days[today].lessons`; `grade` keeps the other
   fields of the day (spread), so it never resets the lesson count.
5. **Settings** — main view: no title, no caption, «Резервная копия →» (quiet
   ghost button), «Тест заново» (second tap «Точно?» starts it), «Готово»; read-only «Точность по
   упражнениям» over the stored 30 days (hidden without answers); no daily limit. Backup
   lives in a separate «Резервная копия» view of the same screen (`backupOpen` state); BackButton
   there returns to the main view instead of leaving settings.
6. **Backup** — in the «Резервная копия» view «Скопировать» copies `exportBackup()` to the
   clipboard; «Восстановить» requires a second tap («Прогресс сотрётся.
   Точно?»), validates, overwrites all 64 packs + meta, then reloads the page. With the server
   the overwrite is one atomic `PUT /progress`, then CloudStorage is rewritten.
7. **Daily backup** — Worker cron `0 0 * * *` (03:00 MSK): for each allowlisted user with a row
   updated in the last 24 h, sends `learneng-backup-YYYY-MM-DD.json` (backup format) to the
   user's chat with the bot via `sendDocument`. Errors are logged, nothing retried.

## Non-obvious invariants / gotchas

- CloudStorage keys allow only `A-Za-z0-9_-`, hence `p_NN`; old backups with `p:NN` are accepted
  and renamed on import, but `loadAll` ignores `p:` keys in storage.
- CloudStorage limits: 1024 keys, 4096 chars per value. ~12 words per pack today — fine, but grow
  the deck with that budget in mind. `meta.days` is trimmed to the last 120 days on every write;
  the compact day arrays keep that under ~3 KB (the object form would exceed 4096 chars after
  ~75 days). The streak therefore cannot exceed 120 days.
- `stats` is not part of the manual backup, and restoring a backup replaces all server keys, so
  the stats start over after an import.
- CloudStorage is used only when `isTelegram && isVersionAtLeast('6.9')`; older clients fall
  back to `localStorage` inside the WebView, i.e. progress is device-local there.
- `elapsed_days` is not stored (restored as 0) and timestamps are rounded to the minute; FSRS
  does not need more.
- Writes are fire-and-forget; a failure shows one sticky toast `id: 'save-error'` («Прогресс не
  сохранился») pointing to the backup. State is kept in a ref too, so several calls in one
  handler see each other's changes.
- `markKnown` does not increment `days.learned`, so words marked «Знаю» are not counted in
  «выучено сегодня».
- Import is atomic only on the server; without it packs are written one by one and a failure
  mid-way leaves a mix.
- Migration runs only on a successful empty response, and before the unsynced push — pushing
  first would make the server non-empty after an offline first launch and skip the migration.
- Devices sync last-write-wins per key; two devices editing offline overwrite each other's pack.
- `initData` older than 24 h is rejected by the server (401) — an app left open for a day keeps
  saving locally and catches up on next launch.
- The server accepts values up to 64 KB, CloudStorage only 4096 chars: CloudStorage stays the
  narrower limit. `meta` with 120 days of stats (~50 chars per day) may outgrow 4096 chars.

## Where to look next

- What a card state means for exercises — `session.md`; lessons and stats — `scheduling.md`;
  Telegram API versions — `telegram.md`.
