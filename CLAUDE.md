# LearnEng

Личный тренажёр английского (в духе Duolingo) в виде Telegram Mini App. Один пользователь, цель — читать техническую документацию. Уровень пользователя ~A1–A2.

## Архитектура

Статика на GitHub Pages, контент собирается в бандл. Прогресс внутри Telegram — на сервере (Cloudflare Worker + D1, бесплатный тариф) с зеркалом в Telegram CloudStorage (фолбэк без сети); вне Telegram — `localStorage`.

## Layout

- `content/words.json` — словарь: 237 IT-слов (словарь alexey-goloburdin/eng-ru-dictionary) + 500 частотных NGSL (CC BY-SA). У каждого слова 6 предложений `{ en, ru, form }`, `form` — точная подстрока `en`, встречается ровно один раз (для упражнений с пропуском).
- `content/level_test.json` — тест уровня: 100 слов NGSL по 5 частотным диапазонам + 15 псевдослов.
- `content/draft/` — промежуточные файлы генерации контента.
- `web/` — Vite + React 19 + TS 6 + Tailwind 4 + shadcn (Base UI, стиль base-nova).
  - `src/lib/telegram.ts` — `Telegram.WebApp` (официальный скрипт в `index.html`), тема → класс `.dark`.
  - `src/lib/storage.ts` — KV поверх сервера/CloudStorage/localStorage (`syncedStore`: CloudStorage + API, несинхронизированные ключи в `unsynced`, миграция на пустой сервер, атомарное восстановление; включается при `VITE_API_URL`). Карточки FSRS хранятся пачками в 64 ключах `p_NN` (CloudStorage допускает в ключах только `A-Za-z0-9_-`) (хэш id слова), компактно массивом; настройки и статистика по дням — ключ `meta`.
  - `src/lib/scheduler.ts` — `ts-fsrs`, статистика, новые слова в уроке: 2 IT (по порядку словаря) + 1 NGSL (по рангу). Обучение уроками без дневного лимита (`buildLesson`): до 3 новых слов + до 8 повторений (сначала due, добор выученными с наименьшей retrievability), новые вперемешку с повторениями; при ≥ 24 due — урок «Повторение» без новых слов. На итоге урока «Ещё урок».
  - `src/lib/use-learning.ts` — хук состояния: загрузка, `grade`, `markKnown` (сразу `Easy`), `updateMeta`. Ошибка записи → тост `toast.error` (shadcn sonner в стиле приложения, `components/ui/sonner.tsx`, один тост с id `save-error`). Данные дублируются в ref, чтобы последовательные вызовы в одном обработчике не теряли изменения.
  - `src/lib/exercises.ts` — сборка упражнения по состоянию карточки FSRS (не Review → выбор EN→RU/RU→EN; stability < 7 дн → пропуск/плитки; иначе ввод), дистракторы той же части речи без пересечения переводов, проверка ввода по Левенштейну (опечатка → `Hard`).
  - `src/exercises/` — UI упражнений, карточка нового слова, панель обратной связи.
  - `src/screens/` — `home`, `session` (ошибка → слово возвращается в очередь через 4 позиции), `session-summary`, `level-test` (коррекция по псевдословам; диапазон 1–500 ≥ 85% → все NGSL-слова диапазона в `Easy`); навигация через `useState`, без роутера.
  - `src/lib/telegram.ts` — `useBackButton` (заодно блокирует свайп-закрытие), `haptic`.
  - `src/screens/settings.tsx` — резервная копия (экспорт в буфер обмена как JSON `{ "p_NN": ..., "meta": ... }`, старые копии с `p:NN` тоже принимаются, импорт перезаписывает все 64 пачки и перезагружает страницу), повтор теста уровня.
- `.github/workflows/deploy.yml` — push в `main` → lint + build `web/` (переменная `VITE_API_URL`) → GitHub Pages.
- `worker/` — Cloudflare Worker (TS без фреймворка): `src/auth.ts` проверка `initData` + allowlist `ALLOWED_USER_IDS`, `src/index.ts` API `GET/PUT /progress[/:key]` + CORS, `src/backup.ts` ежедневный файл-копия в чат с ботом (cron `0 0 * * *`), `schema.sql` таблица `kv`. Секреты Worker: `TELEGRAM_BOT_TOKEN`, `ALLOWED_USER_IDS`; локально — `worker/.dev.vars` (в gitignore).
- `.github/workflows/worker.yml` — push в `main` по `worker/**` → typecheck, схема в D1, `wrangler deploy`. Секреты `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- `scripts/send-reminder.mjs` — отправка напоминания (`sendMessage` с кнопкой `web_app`), читает `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `APP_URL` из окружения. Локально ключи в `.env` (шаблон `.env.example`, `.env` в gitignore, ассистент его не читает).
- `.github/workflows/reminder.yml` — cron `0 17 * * *` (20:00 МСК) → `node scripts/send-reminder.mjs`. Секреты `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, переменная `APP_URL`.
- Дизайн: тёмный «печатный» стиль ретро-журналов — три цвета: чернила `#1a1815`, бумага `#ede1c7` (текст, линии, контуры), оранжевый `#ee6a2e` (главное действие, прогресс, верный ответ) + приглушённый `#a39882` для подписей. Тема Telegram не используется (`initTelegram` красит шапку/фон в `#1a1815`). Кнопки плоские (заливка или контур 2px, без теней), панели с острыми углами и тонкой линией `--line` (1.5px), иконочные кнопки и номера — круги, ярлыки экранов — скруглённые таблички. Фактуры-утилиты в `index.css`: `halftone`, `hatch`, `hatch-primary` (заливка прогресса), `rays` (верный ответ) — не больше одной на экран. Верно/неверно различаются фактурой и подписью, а не цветом. Shadcn-компоненты в `components/ui` перерисованы под этот стиль.
- Шрифты: Rubik (`@fontsource/rubik`, только latin + cyrillic, 400/500/700/900) — основной и `font-display` для заголовков и цифр; JetBrains Mono (`font-mono`) — мелкие подписи.
- Раскладка «под большой палец»: каждый экран — `ThumbLayout` (шапка → контент → зона действий с отступом ~40px снизу, без отдельного спейсера). Все кнопки только в зоне действий — это главный принцип, включая варианты ответа (нумерованные строки) и настройки; панель результата ответа заменяет варианты в той же зоне. Озвучка только по кнопке 🔊, без автоплея. Выход из сессии — системная BackButton Telegram (крестик только вне Telegram).
- Иконки — Phosphor поштучно: `@phosphor-icons/react/dist/csr/<Name>` (экспорт `<Name>Icon`), `weight="bold"`.

## Гайдлайны модулей

Бизнес-контекст по модулям — назначение, глоссарий, ключевые флоу с точками входа в код, неочевидное поведение. **Перед работой над модулем прочитай его гайдлайн**; при изменении поведения обнови его в том же изменении.

| Модуль              | Покрывает                                                  | Гайдлайн                               |
| ------------------- | ---------------------------------------------------------- | -------------------------------------- |
| Content             | словарь, предложения, данные теста уровня                  | `.ai/guidelines/modules/content.md`    |
| Progress            | хранилище, FSRS-карточки, meta, резервная копия, настройки | `.ai/guidelines/modules/progress.md`   |
| Scheduling          | FSRS, уроки, завал повторений, стрик, главная              | `.ai/guidelines/modules/scheduling.md` |
| Session             | занятие, упражнения, обратная связь, итог                  | `.ai/guidelines/modules/session.md`    |
| Level test          | тест уровня и пометка известных слов                       | `.ai/guidelines/modules/level-test.md` |
| Telegram & delivery | WebApp, BackButton, haptics, деплой, напоминания           | `.ai/guidelines/modules/telegram.md`   |

## Spec-driven изменения (OpenSpec)

Фичи и изменения поведения идут через `openspec/` (схема `spec-driven`, конфиг `openspec/config.yaml`): `openspec/specs/<module>/<feature>/spec.md` — источник правды по наблюдаемому поведению; изменение в работе живёт в `openspec/changes/<change-id>/` (`proposal.md` → `specs/**/spec.md` дельта ADDED/MODIFIED/REMOVED → `design.md` → `tasks.md`); законченное архивируется в `openspec/changes/archive/YYYY-MM-DD-<change-id>/`, дельта вливается в основные спеки. Сначала договариваемся в документах, потом код. Команды: `/opsx:explore`, `/opsx:propose <id>`, `/opsx:apply`, `/opsx:update`, `/opsx:archive`; перед архивом `openspec validate <id> --strict`. Мелкие фиксы, стили, переименования — без change. Инициализировано 2026-10-26 (`openspec init --tools claude`), основные спеки: `progress/{settings,server-storage,daily-backup}`, `scheduling/{lessons,home}`, `session/lesson-flow`, `ui/visual-style`.

## Команды (в `web/`)

`npm run dev`, `npm run build`, `npm run lint` (oxlint), `npm run typecheck`, `npm run format`.

В `worker/`: `npm run dev` (wrangler dev), `npm run typecheck`, `npm run db:local` / `npm run db:remote` (схема D1), `npm run deploy`.

Из корня: `node --env-file=.env scripts/send-reminder.mjs` — отправить напоминание вручную.

## Current state / Open work

- Готово: контент, каркас, хранилище, планировщик, главный экран, сессия с 5 упражнениями (+ повтор новых слов в конце), тест уровня, настройки, workflow деплоя и напоминаний.
- Готово 2026-10-27: прогресс на сервере (`server-progress`) — миграция, второе устройство и дозаливка проверены в Telegram; ждём первый ночной файл-копию от бота (03:00 МСК).
- Дальше: проверка внутри Telegram (CloudStorage, BackButton, haptics).
- Потом: трек грамматики для чтения, трек чтения реальных текстов.
