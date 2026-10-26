# Telegram & Delivery Module — Business Context

## What this module is for

Everything that makes the static site a Telegram Mini App and keeps the habit going: WebApp
integration, deployment to GitHub Pages, the daily reminder from a bot. Code:
`web/src/lib/telegram.ts`, `web/index.html` (official `telegram-web-app.js`),
`.github/workflows/deploy.yml`, `.github/workflows/reminder.yml`, `scripts/send-reminder.mjs`.

## Glossary

- **`isTelegram`** — `Boolean(Telegram.WebApp.initData)`; the script is always loaded, so
  `webApp` exists in a browser too, but without `initData`.
- **Bot API version gates** — CloudStorage ≥ 6.9, `disableVerticalSwipes` ≥ 7.7,
  `setBottomBarColor` ≥ 7.10; always guard with `isVersionAtLeast`.
- **Reminder** — `sendMessage` to one chat with an inline `web_app` button «Заниматься».

## Key flows

1. **Init** (`initTelegram`) — paints header/background/bottom bar `#0a0a0a` (the app ignores the
   Telegram theme), `ready()`, `expand()`.
2. **Back** (`useBackButton`) — shows the system BackButton on non-home screens and disables
   vertical swipe-to-close while it is shown, so a scroll gesture does not close the lesson.
3. **Haptics** — `haptic('success' | 'warning' | 'error')` on answers; no-op outside Telegram.
4. **Deploy** — push to `main` → `npm ci`, lint, build in `web/` → GitHub Pages.
5. **Reminder** — cron `0 17 * * *` (20:00 MSK) runs the script with secrets
   `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` and variable `APP_URL`; locally
   `node --env-file=.env scripts/send-reminder.mjs` (`.env` is never read by the assistant).

## Non-obvious invariants / gotchas

- The reminder is sent every day regardless of whether the user already studied — there is no
  backend that could know.
- GitHub may delay scheduled workflows and disables them after 60 days without repo activity.
- Deploy runs lint and build, but not typecheck — run `npm run typecheck` locally.
- Not yet verified inside real Telegram: CloudStorage, BackButton, haptics (open work in
  CLAUDE.md).

## Where to look next

- CloudStorage usage — `progress.md`; where BackButton and haptics are used — `session.md`.
