# LearnEng

Личный тренажёр английского в духе Duolingo, Telegram Mini App. Цель — читать техническую документацию:
737 слов (IT-лексика + 500 частотных NGSL), у каждого 6 предложений. Повторения по FSRS, уроки из новых
слов вперемешку с повторениями, пять типов упражнений от выбора перевода до сборки предложения.

**Прод:** https://vladislavborovinskiy.github.io/learneng/

## Локальный запуск

```bash
cd web
npm ci
npm run dev
```

Без `VITE_API_URL` прогресс хранится в `localStorage`. С сервером:

```bash
cd worker
npm ci
npm run db:local
npm run dev
```

Секреты Worker локально — в `worker/.dev.vars`: `TELEGRAM_BOT_TOKEN`, `ALLOWED_USER_IDS`.

## Проверки

```bash
cd web && npm run typecheck && npm run lint
cd worker && npm run typecheck
node scripts/check-content.mjs
```

## Устройство

- `web/` — Vite + React 19 + Tailwind 4 + shadcn, статика на GitHub Pages (push в `main`).
- `worker/` — Cloudflare Worker + D1: прогресс по `initData` с allowlist, ежедневная копия файлом в чат с ботом.
- `content/` — словарь, факты для прелоадера, тест уровня.
- `scripts/send-reminder.mjs` — вечернее напоминание ботом, cron в GitHub Actions (20:00 МСК).
- `openspec/` — спеки поведения, изменения идут через них.
