## Why

All learning progress lives only in Telegram CloudStorage, tied to one bot and one account, with
a manual clipboard backup as the only safety net. Losing the bot, the account, or hitting a bad
write would wipe months of FSRS history, and the manual backup depends on remembering to make it.

## What Changes

- Progress (word cards and meta) is stored on a small server: a Cloudflare Worker with a D1
  database, on the free tier. The server becomes the source of truth inside Telegram.
- The learner is identified by Telegram launch data verified on the server; no login screen.
  Only allowlisted Telegram users can read or write.
- Telegram CloudStorage stays as a local mirror: every save goes there too, the app works from it
  when the server is unreachable, and saves that missed the server are pushed later.
- First launch after the change uploads existing CloudStorage progress to the empty server, so no
  progress is lost in the migration.
- Restoring a backup in settings writes to the server in one atomic step.
- A daily server job sends a backup file (same format as the manual backup) to the bot chat when
  progress changed during the day.
- The manual backup in settings keeps working unchanged; its description text is updated.
- Outside Telegram (local dev, plain browser) nothing changes: `localStorage` only.
- A deployment workflow for the Worker is added.

## Capabilities

### New Capabilities

- `progress/server-storage`: where progress is saved and loaded from, offline fallback and
  catch-up, migration from CloudStorage, access restricted to allowlisted users.
- `progress/daily-backup`: automatic daily backup file delivered to the bot chat.

### Modified Capabilities

None. `progress/settings` requirements (backup copy/restore, level test, old backups restore) stay
as they are; only the settings description wording changes.

## Impact

- New `worker/` project (Cloudflare Worker, D1 schema, cron trigger) and a new GitHub Actions
  workflow to deploy it; new secrets in Cloudflare (bot token, allowlist, backup chat) and in
  GitHub (Cloudflare API token, account id), a build-time API URL for `web/`.
- `web/src/lib/storage.ts` gains a server-backed store; `settings.tsx` description text.
- Architecture statement "no backend" in CLAUDE.md and `openspec/config.yaml` becomes outdated.
- Module guidelines: `.ai/guidelines/modules/progress.md`, `.ai/guidelines/modules/telegram.md`.
- Free-tier limits of Workers and D1 must be re-checked against current Cloudflare docs before
  implementation.

## Non-goals

- Multi-user features, accounts, sign-up, or any UI for managing users.
- Moving the daily reminder off GitHub Actions or making it progress-aware (possible follow-up).
- Conflict resolution beyond last-write-wins per key between devices.
- Changing the stored card format, pack layout or backup format.
- A full offline queue with retries while the app stays open (catch-up happens on next save or
  next launch).
