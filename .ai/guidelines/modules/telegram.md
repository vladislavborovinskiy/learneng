# Telegram & Delivery Module — Business Context

## What this module is for

Everything that makes the static site a Telegram Mini App and keeps the habit going: WebApp
integration, deployment to GitHub Pages and of the progress Worker to Cloudflare, the daily
reminder from a bot. Code:
`web/src/lib/telegram.ts`, `web/index.html` (official `telegram-web-app.js`, loaded synchronously in
`<body>` right after the inline `#preloader`, so the preloader paints before it; the preloader is
a flowing dimmed sage / sand / clay gradient with one fact from `content/facts.json`, inlined at
build by the `preloader-facts` Vite plugin and picked from a shuffle bag in `localStorage`
`preloader-facts`; after load + fonts `App.tsx` shows a «Понятно» button and the preloader closes only on it or `Enter`; an inline capture listener swallows all keys until then so `Enter` does not start a lesson; on load error it hides by itself),
`.github/workflows/deploy.yml`, `.github/workflows/reminder.yml`, `scripts/send-reminder.mjs`,
`.github/workflows/worker.yml`, `worker/` (server side of `progress.md`).

## Glossary

- **`isTelegram`** — `Boolean(Telegram.WebApp.initData)`; the script is always loaded, so
  `webApp` exists in a browser too, but without `initData`.
- **Bot API version gates** — CloudStorage ≥ 6.9, `disableVerticalSwipes` ≥ 7.7,
  `setBottomBarColor` ≥ 7.10; always guard with `isVersionAtLeast`.
- **Reminder** — `sendMessage` to one chat with an inline `web_app` button «Заниматься».
- **initData check** — the Worker verifies `Authorization: tma <initData>`: HMAC-SHA256 with
  secret `HMAC("WebAppData", bot token)` over all fields except `hash`, sorted by key; rejects
  `auth_date` older than 24 h and users not in `ALLOWED_USER_IDS`.

## Key flows

1. **Init** (`initTelegram`) — paints header/background/bottom bar `#0b0d12` (graphite) (the app ignores the
   Telegram theme), `ready()`, `expand()`.
2. **Back** (`useBackButton`) — shows the system BackButton on non-home screens and disables
   vertical swipe-to-close while it is shown, so a scroll gesture does not close the lesson.
   `Esc` triggers the same handler (in and outside Telegram); Telegram Desktop may also handle
   `Esc` itself — not verified yet.
3. **Haptics** — `haptic('success' | 'warning' | 'error')` on answers; no-op outside Telegram.
4. **Deploy** — push to `main` → `npm ci`, lint, build in `web/` (with repo variable
   `VITE_API_URL`) → GitHub Pages. Push touching `worker/**` → `worker.yml`: typecheck, apply
   `schema.sql` to remote D1 (idempotent), `wrangler deploy`; secrets `CLOUDFLARE_API_TOKEN`,
   `CLOUDFLARE_ACCOUNT_ID`. Worker secrets (`wrangler secret put`): `TELEGRAM_BOT_TOKEN`,
   `ALLOWED_USER_IDS`; var `ALLOWED_ORIGIN` (CORS) in `wrangler.toml`. Local Worker dev:
   `npm run db:local && npm run dev` in `worker/` with fake values in `worker/.dev.vars`.
5. **Reminder** — cron `0 17 * * *` (20:00 MSK) runs the script with secrets
   `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` and variable `APP_URL`; locally
   `node --env-file=.env scripts/send-reminder.mjs` (`.env` is never read by the assistant).

## Non-obvious invariants / gotchas

- The reminder is sent every day regardless of whether the user already studied — it still runs
  from GitHub Actions, not from the Worker that knows the progress.
- The bot token lives in two secret stores (GitHub for the reminder, Cloudflare for the Worker);
  rotate it in both.
- GitHub may delay scheduled workflows and disables them after 60 days without repo activity.
- Deploy runs lint and build, but not typecheck — run `npm run typecheck` locally.
- Not yet verified inside real Telegram: CloudStorage, BackButton, haptics (open work in
  CLAUDE.md).

## Where to look next

- CloudStorage usage — `progress.md`; where BackButton and haptics are used — `session.md`.
