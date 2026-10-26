# LearnEng

Личный тренажёр английского (в духе Duolingo) в виде Telegram Mini App. Один пользователь, цель — читать техническую документацию. Уровень пользователя ~A1–A2.

## Архитектура

Бэкенда нет. Статика на GitHub Pages, прогресс в Telegram CloudStorage (вне Telegram — `localStorage`), контент собирается в бандл.

## Layout

- `content/words.json` — словарь: 237 IT-слов (словарь alexey-goloburdin/eng-ru-dictionary) + 500 частотных NGSL (CC BY-SA). У каждого слова 6 предложений `{ en, ru, form }`, `form` — точная подстрока `en`, встречается ровно один раз (для упражнений с пропуском).
- `content/level_test.json` — тест уровня: 100 слов NGSL по 5 частотным диапазонам + 15 псевдослов.
- `content/draft/` — промежуточные файлы генерации контента.
- `web/` — Vite + React 19 + TS 6 + Tailwind 4 + shadcn (Base UI, стиль base-nova).
  - `src/lib/telegram.ts` — `Telegram.WebApp` (официальный скрипт в `index.html`), тема → класс `.dark`.
  - `src/lib/storage.ts` — KV поверх CloudStorage/localStorage. Карточки FSRS хранятся пачками в 64 ключах `p_NN` (CloudStorage допускает в ключах только `A-Za-z0-9_-`) (хэш id слова), компактно массивом; настройки и статистика по дням — ключ `meta`.
  - `src/lib/scheduler.ts` — `ts-fsrs`, очередь (сначала повторения, затем новые: IT, потом NGSL по рангу), статистика. Когда дневной лимит исчерпан, на главной кнопка «Ещё 5 слов» — сессия с `extraNew` новыми словами сверх лимита.
  - `src/lib/use-learning.ts` — хук состояния: загрузка, `grade`, `markKnown` (сразу `Easy`), `updateMeta`. Ошибка записи → тост `toast.error` (shadcn sonner в стиле приложения, `components/ui/sonner.tsx`, один тост с id `save-error`). Данные дублируются в ref, чтобы последовательные вызовы в одном обработчике не теряли изменения.
  - `src/lib/exercises.ts` — сборка упражнения по состоянию карточки FSRS (не Review → выбор EN→RU/RU→EN; stability < 7 дн → пропуск/плитки; иначе ввод), дистракторы той же части речи без пересечения переводов, проверка ввода по Левенштейну (опечатка → `Hard`).
  - `src/exercises/` — UI упражнений, карточка нового слова, панель обратной связи.
  - `src/screens/` — `home`, `session` (ошибка → слово возвращается в очередь через 4 позиции), `session-summary`, `level-test` (коррекция по псевдословам; диапазон 1–500 ≥ 85% → все NGSL-слова диапазона в `Easy`); навигация через `useState`, без роутера.
  - `src/lib/telegram.ts` — `useBackButton` (заодно блокирует свайп-закрытие), `haptic`.
  - `src/screens/settings.tsx` — новых слов в день, резервная копия (экспорт в буфер обмена как JSON `{ "p_NN": ..., "meta": ... }`, старые копии с `p:NN` тоже принимаются, импорт перезаписывает все 64 пачки и перезагружает страницу), повтор теста уровня.
- `.github/workflows/deploy.yml` — push в `main` → lint + build `web/` → GitHub Pages.
- `scripts/send-reminder.mjs` — отправка напоминания (`sendMessage` с кнопкой `web_app`), читает `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `APP_URL` из окружения. Локально ключи в `.env` (шаблон `.env.example`, `.env` в gitignore, ассистент его не читает).
- `.github/workflows/reminder.yml` — cron `0 17 * * *` (20:00 МСК) → `node scripts/send-reminder.mjs`. Секреты `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, переменная `APP_URL`.
- Дизайн: тёмная тема с лаймовым акцентом в духе 8-bit, тема Telegram не используется (`initTelegram` красит шапку/фон Telegram в `#0a0a0a`). Палитра и утилиты `pixel-corners` (ступенчатые углы через clip-path, толщина `--pixel`) и `stripes` — в `index.css`. Shadcn-компоненты в `components/ui` перерисованы под этот стиль.
- Шрифты: JetBrains Mono — основной; `font-pixel` — Pixelify Sans только для латинских букв (свой `@font-face` с `unicode-range`), кириллица и цифры падают на JetBrains Mono ради читаемости.
- Раскладка «под большой палец»: каждый экран — `ThumbLayout` (шапка → контент → зона действий с отступом ~40px снизу, без отдельного спейсера). Все кнопки только в зоне действий; панель результата ответа заменяет варианты в той же зоне. Озвучка только по кнопке 🔊, без автоплея. Выход из сессии — системная BackButton Telegram (крестик только вне Telegram).
- Иконки — pixelarticons поштучно: `pixelarticons/react/<Name>.js`.

## Гайдлайны модулей

Бизнес-контекст по модулям — назначение, глоссарий, ключевые флоу с точками входа в код, неочевидное поведение. **Перед работой над модулем прочитай его гайдлайн**; при изменении поведения обнови его в том же изменении.

| Модуль              | Покрывает                                                  | Гайдлайн                               |
| ------------------- | ---------------------------------------------------------- | -------------------------------------- |
| Content             | словарь, предложения, данные теста уровня                  | `.ai/guidelines/modules/content.md`    |
| Progress            | хранилище, FSRS-карточки, meta, резервная копия, настройки | `.ai/guidelines/modules/progress.md`   |
| Scheduling          | FSRS, очередь, дневной лимит, «Ещё 5 слов», стрик, главная | `.ai/guidelines/modules/scheduling.md` |
| Session             | занятие, упражнения, обратная связь, итог                  | `.ai/guidelines/modules/session.md`    |
| Level test          | тест уровня и пометка известных слов                       | `.ai/guidelines/modules/level-test.md` |
| Telegram & delivery | WebApp, BackButton, haptics, деплой, напоминания           | `.ai/guidelines/modules/telegram.md`   |

## Spec-driven изменения (OpenSpec)

Фичи и изменения поведения идут через `openspec/` (схема `spec-driven`, конфиг `openspec/config.yaml`): `openspec/specs/<module>/<feature>/spec.md` — источник правды по наблюдаемому поведению; изменение в работе живёт в `openspec/changes/<change-id>/` (`proposal.md` → `specs/**/spec.md` дельта ADDED/MODIFIED/REMOVED → `design.md` → `tasks.md`); законченное архивируется в `openspec/changes/archive/YYYY-MM-DD-<change-id>/`, дельта вливается в основные спеки. Сначала договариваемся в документах, потом код. Команды: `/opsx:explore`, `/opsx:propose <id>`, `/opsx:apply`, `/opsx:update`, `/opsx:archive`; перед архивом `openspec validate <id> --strict`. Мелкие фиксы, стили, переименования — без change. Инициализировано 2026-10-26 (`openspec init --tools claude`), основных спек пока нет — появляются по мере изменений.

## Команды (в `web/`)

`npm run dev`, `npm run build`, `npm run lint` (oxlint), `npm run typecheck`, `npm run format`.

Из корня: `node --env-file=.env scripts/send-reminder.mjs` — отправить напоминание вручную.

## Current state / Open work

- Готово: контент, каркас, хранилище, планировщик, главный экран, сессия с 5 упражнениями (+ повтор новых слов в конце), тест уровня, настройки, workflow деплоя и напоминаний.
- Дальше: первый деплой и проверка внутри Telegram (CloudStorage, BackButton, haptics).
- Потом: трек грамматики для чтения, трек чтения реальных текстов.
