## 0. Preconditions

- [x] 0.1 Re-check current Cloudflare free-tier limits for Workers (requests/day, CPU), D1 (rows written/read per day, storage, Time Travel window) and Cron Triggers in the official docs; record them in design.md Risks and confirm ≥ 100× headroom over ~500 writes/day
- [ ] 0.2 Developer makes a manual backup (Настройки → «Скопировать») and saves it in Telegram «Избранное»; confirm the text is there before any deploy

## 1. Worker & database

- [x] 1.1 Scaffold `worker/` (`package.json` with wrangler + `@cloudflare/workers-types`, `tsconfig.json`, `wrangler.toml` with D1 binding `DB`, cron `0 0 * * *`, var `ALLOWED_ORIGIN`); verify `npm run typecheck` in `worker/` passes on an empty handler
- [x] 1.2 Add `worker/schema.sql` with `CREATE TABLE IF NOT EXISTS kv (user_id, key, value, updated_at, PRIMARY KEY (user_id, key))`; verify `wrangler d1 execute --local --file schema.sql` runs twice without error
- [x] 1.3 Implement initData verification (HMAC-SHA256 via Web Crypto, 24 h `auth_date` limit, `ALLOWED_USER_IDS` allowlist); verify with `wrangler dev` that a request without header, with a tampered `hash`, and with a non-allowlisted user all return 401
- [x] 1.4 Implement `GET /progress`, `PUT /progress/:key` (key whitelist `p_00`…`p_63`, `meta`; value ≤ 64 KB) and `PUT /progress` (replace all in one `DB.batch`); verify with curl against `wrangler dev` using a valid initData that put → get round-trips and an invalid key returns 400
- [x] 1.5 Add CORS for `ALLOWED_ORIGIN` incl. `OPTIONS` preflight; verify a preflight from another origin gets no `Access-Control-Allow-Origin`
- [ ] 1.6 Implement the scheduled handler: for each allowlisted user with `updated_at` in the last 24 h send `learneng-backup-YYYY-MM-DD.json` via `sendDocument`; verify with `wrangler dev --test-scheduled` and `curl /__scheduled` that the file arrives in the bot chat and is skipped when nothing changed

## 2. Client storage

- [x] 2.1 Add `apiStore` (`getAll`, `set`, `replaceAll`) in `web/src/lib/storage.ts` sending `Authorization: tma <initData>` to `VITE_API_URL`; verify `npm run typecheck` in `web/`
- [x] 2.2 Add `syncedStore` (CloudStorage first, then server; unsynced keys in CloudStorage key `unsynced`; flush on load and after a successful write; migration via `replaceAll` only on a successful empty response; mirror server values into CloudStorage after load; CloudStorage fallback on any server error) and select it when `isTelegram && CloudStorage ≥ 6.9 && VITE_API_URL`; verify `npm run dev` outside Telegram still uses `localStorage` (DevTools → Application) and makes no network calls to the API
- [x] 2.3 Make `importBackup` use `replaceAll` when the store supports it, then mirror to CloudStorage; verify an old backup with `p:NN` keys still validates (paste one into settings in `npm run dev`)
- [x] 2.4 Update the settings «Резервная копия» description to mention the server and the daily file from the bot; verify on the settings screen in `npm run dev`
- [x] 2.5 Add `.env.example` entry `VITE_API_URL=` in `web/` (no secrets) and pass `VITE_API_URL: ${{ vars.VITE_API_URL }}` to the build step in `deploy.yml`; verify `npm run build` succeeds with and without the variable

## 3. Delivery

- [x] 3.1 Add `.github/workflows/worker.yml` (push to `main` on `worker/**` + manual: `npm ci`, typecheck, `wrangler d1 execute --remote --file schema.sql`, `wrangler deploy`, secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`); verify the YAML with `npx action-validator` or a dry `workflow_dispatch` run after the developer adds secrets
- [ ] 3.2 Give the developer the exact one-time setup commands (`wrangler login`, `wrangler d1 create`, `wrangler secret put TELEGRAM_BOT_TOKEN` / `ALLOWED_USER_IDS`, GitHub secrets and the `VITE_API_URL` variable); verify after their run that `curl <worker>/progress` returns 401

## 4. End-to-end in Telegram

- [ ] 4.1 Open the Mini App in Telegram after deploy: home shows the same progress as before; verify with `wrangler d1 execute --remote --command "SELECT key FROM kv"` that the migration uploaded all keys
- [ ] 4.2 Answer one exercise, reopen on a second device (or Telegram Desktop): progress matches; verify `updated_at` changed for the touched pack and `meta`
- [ ] 4.3 Temporarily point `VITE_API_URL` at an unreachable host in a local Telegram test build (or block the Worker route): lesson works without toasts, `unsynced` key appears in CloudStorage; restore the URL and reopen — `unsynced` is empty and the server has the offline answers

## 5. Docs & verification

- [x] 5.1 Update `.ai/guidelines/modules/progress.md` (server store, unsynced keys, load/migration/fallback, atomic restore) and `.ai/guidelines/modules/telegram.md` (Worker deploy, daily backup, initData expiry, token in two secret stores)
- [x] 5.2 Update CLAUDE.md (Архитектура, Layout: `worker/`, `worker.yml`, Команды) and the "no backend" wording in `openspec/config.yaml`
- [x] 5.3 Run `npm run lint && npm run typecheck` in `web/` and `npm run typecheck` in `worker/`; both pass
