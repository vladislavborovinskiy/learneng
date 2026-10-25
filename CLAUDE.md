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
  - `src/lib/storage.ts` — KV поверх CloudStorage/localStorage. Карточки FSRS хранятся пачками в 64 ключах `p:NN` (хэш id слова), компактно массивом; настройки и статистика по дням — ключ `meta`.
  - `src/lib/scheduler.ts` — `ts-fsrs`, очередь (сначала повторения, затем новые: IT, потом NGSL по рангу), статистика.
  - `src/lib/use-learning.ts` — хук состояния: загрузка, `grade`, `updateMeta`.
  - `src/screens/` — экраны; навигация через `useState`, без роутера.
- Цвета shadcn-токенов берутся из `--tg-theme-*` с фолбэками.

## Команды (в `web/`)

`npm run dev`, `npm run build`, `npm run lint` (oxlint), `npm run typecheck`, `npm run format`.

## Current state / Open work

- Готово: контент, каркас, хранилище, планировщик, главный экран.
- Дальше: сессия + 5 упражнений (выбор EN→RU / RU→EN, пропуск, плитки, ввод), тест уровня, настройки/экспорт, деплой на Pages, напоминание через GitHub Actions.
- Потом: трек грамматики для чтения, трек чтения реальных текстов.
