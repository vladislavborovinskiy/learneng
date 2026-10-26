## Context

See proposal.md — Why. Starting point is `.ai/guidelines/modules/progress.md`: progress is a
key-value set (`p_00` … `p_63` packs + `meta`) behind a two-method `KeyValueStore`
(`getAll`, `set`) in `web/src/lib/storage.ts`, with `cloudStore` (Telegram CloudStorage, Bot API
≥ 6.9) and `localStore`. `use-learning.ts` writes fire-and-forget and shows one sticky toast on
failure. Import writes packs one by one (not atomic). The reminder already uses the bot token in
GitHub Actions; there is no server.

This change deliberately breaks the "no backend" constraint stated in CLAUDE.md and
`openspec/config.yaml`; both are updated as part of the change. CloudStorage limits (keys
`A-Za-z0-9_-`, 1024 keys, 4096 chars per value) still apply because CloudStorage stays the
mirror, so the stored shape must not grow.

Guideline sections to update: `progress.md` — What this module is for, Glossary (Server store,
Unsynced keys), Key flows (Load, Grade, Backup), gotchas (import atomicity, fallback, outside
Telegram); `telegram.md` — What this module is for, Key flows (Worker deploy, daily backup),
gotchas (initData expiry, secrets).

## Goals / Non-Goals

**Goals:**
- Server is the source of truth inside Telegram; CloudStorage is a byte-identical mirror.
- No change for `use-learning.ts` callers, the backup format, or the dev setup outside Telegram.
- Fits the Cloudflare free tier with a wide margin (≈ 2 writes per answer, a few hundred per day).

**Non-Goals:**
- Retrying failed server writes while the app stays open beyond "on next successful write".
- Per-field merge between devices.

## Decisions

### 1. Cloudflare Worker + D1, one `kv` table

`kv(user_id INTEGER, key TEXT, value TEXT, updated_at INTEGER, PRIMARY KEY (user_id, key))`.
Free tier, no cold-start sleep, SQLite gives atomic `batch()` for restore and migration, Time
Travel gives point-in-time restore of the whole database.
- Rejected: Supabase — free projects pause after a week of inactivity.
- Rejected: Workers KV — 1000 writes/day on free tier is close to a heavy study day, and no
  atomic multi-key write.
- Rejected: Firebase — needs a custom-token bridge for Telegram auth, more moving parts.

### 2. Auth: `Authorization: tma <initData>`, HMAC check in the Worker

Secret key = HMAC-SHA256(key `"WebAppData"`, bot token); compare HMAC of the sorted
`data_check_string` with `hash` using Web Crypto, reject `auth_date` older than 24 h, take
`user.id` from the verified `user` field and require it in `ALLOWED_USER_IDS`.
- Rejected: Ed25519 `signature` check with Telegram's public key — avoids the token in the
  Worker, but the Worker needs the token anyway for `sendDocument`.
- Rejected: no allowlist (any Telegram user gets their own rows) — opens free-tier quota to
  strangers for no benefit to a one-learner app.

### 3. API: three routes, same KV model

- `GET /progress` → `{ entries: Record<string, string> }`
- `PUT /progress/:key` body `{ value }` → upsert one key (key validated against `p_00`…`p_63`,
  `meta`; value ≤ 64 KB — looser than CloudStorage's 4096 so the server never becomes the narrower limit)
- `PUT /progress` body `{ entries }` → replace all keys of the user in one D1 batch (restore,
  migration)

CORS allows only the GitHub Pages origin (`ALLOWED_ORIGIN`).
- Rejected: one blob per user — every answer would re-upload all progress and diverge from the
  CloudStorage layout the backup and mirror rely on.

### 4. Client: `syncedStore` wraps `cloudStore` + `apiStore`

`apiStore` implements `KeyValueStore` plus `replaceAll(entries)`. `syncedStore.set` writes
CloudStorage first (its failure rejects → existing toast), then the server; a server failure adds
the key to an unsynced set persisted in CloudStorage key `unsynced` (JSON array), a success
flushes the set from an in-memory copy of the CloudStorage values. `syncedStore.getAll`:
`GET /progress` → if empty and CloudStorage has packs/meta, `replaceAll(local)` (migration, clears
unsynced) → otherwise push unsynced keys and overlay their local values on the server result →
write server values into CloudStorage → return them; any server error → return CloudStorage.
Migration is checked before the push on purpose: pushing first would make an empty server look
non-empty after an offline first launch and skip the migration of everything else.
`loadAll` ignores the `unsynced` key because it only reads `p_` keys and `meta`. `importBackup`
calls `replaceAll` when available, then mirrors locally.

Store selection: `syncedStore` when `isTelegram && CloudStorage ≥ 6.9 && VITE_API_URL`; else as
today. `VITE_API_URL` is a public build-time variable (GitHub repo variable passed in
`deploy.yml`).
- Rejected: per-key `updatedAt` timestamps and newest-wins merge on load — changes the stored value
  format (breaks backup compatibility) for a single-learner app where an unsynced set is enough.
- Rejected: server-only, dropping CloudStorage — the app would stop working without network.

Searched for and reused: `KeyValueStore`, `serializePacks`/`serializeMeta`, backup validation in
`importBackup`, `reportSaveError` toast, `isTelegram`/`webApp` from `telegram.ts`. No new UI
components; only the settings description text changes («Прогресс хранится на сервере и
копией в Telegram. Сервер раз в день присылает копию в чат с ботом.» + existing manual backup
sentence).

### 5. Daily backup: Worker Cron Trigger `0 0 * * *` (03:00 MSK)

For each allowlisted user with any `updated_at` in the last 24 h, build the backup JSON exactly as
`exportBackup` does (non-empty packs + `meta`) from the stored strings and send it via
`sendDocument` (multipart, `chat_id` = user id) as `learneng-backup-YYYY-MM-DD.json`. Errors are
logged, nothing is retried.
- Rejected: GitHub Actions job pulling from the API — would need a separate machine credential
  and GitHub delays/disables schedules.

### 6. Repository layout and deploy

`worker/` — own `package.json`, `tsconfig.json`, `wrangler.toml` (D1 binding `DB`, cron, vars
`ALLOWED_ORIGIN`), `schema.sql`, `src/index.ts`. Secrets via `wrangler secret put`:
`TELEGRAM_BOT_TOKEN`, `ALLOWED_USER_IDS`. Workflow `.github/workflows/worker.yml`: on push to
`main` touching `worker/**` → typecheck → `wrangler d1 execute --remote --file schema.sql`
(idempotent `CREATE TABLE IF NOT EXISTS`) → `wrangler deploy`, with GitHub secrets
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- Rejected: Worker inside `web/` — mixes browser and Workers type environments in one tsconfig.

## Risks / Trade-offs

- [Two devices offline at once overwrite each other] → last-write-wins per pack; acceptable for
  one learner, noted in the guideline.
- [initData older than 24 h in a long-open app] → server writes fail with 401, keys stay
  unsynced and are pushed on the next launch; no data loss.
- [Migration races: server empty because of an outage-induced empty response] → migration runs
  only on a successful `200` with zero entries, never on errors.
- [Bot token now lives in two places (GitHub, Cloudflare)] → both are secret stores; rotation
  documented in `telegram.md`.
- [Free-tier limits change] → checked 2026-10-27 (developers.cloudflare.com): Workers Free —
  100k requests/day, 10 ms CPU per request and per cron run, 50 subrequests, 5 cron triggers per
  account, no credit card; D1 Free — 5M rows read/day, 100k rows written/day (an index write
  counts as an extra row), 5 GB per account / 500 MB per database, Time Travel 7 days, 100 bound
  parameters per query, a `batch()` counts as one query. One answer ≈ 2 upserts ≈ 4 written rows,
  a heavy day ≈ 1–2k rows → ≥ 50× headroom; a full replace ≈ 130 statements in one batch. Over the
  limit D1 errors until 00:00 UTC — the client falls back to CloudStorage and keeps keys unsynced.

## Migration Plan

1. Create D1 database and deploy the Worker with secrets; verify `GET /progress` returns 401
   without `initData`.
2. Set `VITE_API_URL` repo variable, deploy `web/`. First launch in Telegram uploads
   CloudStorage to the server.
3. Make a manual backup before step 2 as a safety net.

Rollback: remove `VITE_API_URL` and redeploy `web/` — the app reads CloudStorage, which was kept
in sync, exactly as before.
