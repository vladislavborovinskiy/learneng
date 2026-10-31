# LearnEng

Личный тренажёр английского (в духе Duolingo) в виде Telegram Mini App. Один пользователь, цель — читать техническую документацию. Уровень пользователя ~A1–A2.

## Архитектура

Статика на GitHub Pages, контент собирается в бандл. Прогресс внутри Telegram — на сервере (Cloudflare Worker + D1, бесплатный тариф) с зеркалом в Telegram CloudStorage (фолбэк без сети); вне Telegram — `localStorage`.

## Layout

- `content/words.json` — словарь: 237 IT-слов (словарь alexey-goloburdin/eng-ru-dictionary) + 500 частотных NGSL (CC BY-SA). У каждого слова 6 предложений `{ en, ru, form, chunks }`, `form` — точная подстрока `en`, встречается ровно один раз (для упражнений с пропуском); `chunks` — индексы слов, с которых начинаются куски 2…n (2–4 смысловых куска для «Собери из кусков»). Проверка инвариантов — `node scripts/check-content.mjs`.
- `content/facts.json` — короткие проверенные факты об английском (EN ≤ 12 слов + RU ≤ 14) для прелоадера, встраиваются в `index.html` Vite-плагином `preloader-facts`.
- `content/level_test.json` — тест уровня: 100 слов NGSL по 5 частотным диапазонам + 15 псевдослов.
- `content/draft/` — промежуточные файлы генерации контента.
- `web/` — Vite + React 19 + TS 6 + Tailwind 4 + shadcn (Base UI, стиль base-nova).
  - `src/lib/telegram.ts` — `Telegram.WebApp` (официальный скрипт в `index.html`, в `<body>` после прелоадера), тема → класс `.dark`.
  - `index.html` — прелоадер `#preloader` на встроенных стилях: переливающийся приглушённый градиент шалфей → песок → глина на весь экран (без движения при reduced motion) и факт EN + RU по центру, порядок — перемешанная «колода» в `localStorage` `preloader-facts`; когда прогресс загружен и `document.fonts.ready`, `App.tsx` показывает белую кнопку «Понятно» внизу, прелоадер затухает только по ней (или `Enter`; клавиши до закрытия не доходят до экрана — перехват в inline-скрипте), при ошибке загрузки исчезает сам.
  - `src/lib/storage.ts` — KV поверх сервера/CloudStorage/localStorage (`syncedStore`: CloudStorage + API, несинхронизированные ключи в `unsynced`, миграция на пустой сервер, атомарное восстановление; включается при `VITE_API_URL`). Карточки FSRS хранятся пачками в 64 ключах `p_NN` (CloudStorage допускает в ключах только `A-Za-z0-9_-`) (хэш id слова), компактно массивом; настройки и статистика по дням — ключ `meta`; точность по типам упражнений за 30 дней — ключ `stats` (в ручную копию не входит).
  - `src/lib/scheduler.ts` — `ts-fsrs`, статистика, новые слова в уроке: 2 IT (по порядку словаря) + 1 NGSL (по рангу). Обучение уроками без дневного лимита (`buildLesson`): до 3 новых слов + до 8 повторений (сначала due — раньше слова с большим `lapses`, затем самые просроченные; добор выученными с наименьшей retrievability), новые вперемешку с повторениями; новых слов в уроке меньше по мере роста due (< 12 → 3, < 24 → 2, < 48 → 1, дальше 0), кнопка всегда «Урок»; главная: число выученных «из 737 слов», полоска, «сегодня +N», линейный график новых слов с первого дня занятий, максимум за 14 дней (`components/pace-chart.tsx`, shadcn chart / Recharts, lazy-чанк), плитки «точность · 7 дн» и «повторений сегодня», секция трудных слов без заголовка (топ-3 по `lapses`, перевод справа размыт до тапа), стрик — белый огонёк Phosphor + число справа от «из 737 слов», шапки нет. На итоге урока «Ещё урок».
  - `src/lib/i18n.ts` — язык интерфейса RU/EN: словари `ru` и `en: typeof ru` (функции для подстановок, месяцы), `StringsContext` в `App.tsx`, `useStrings()`; язык в `meta.language` (по умолчанию `ru`). Все строки интерфейса только через словарь; переводы слов, русская строка фактов и напоминание бота — всегда русские.
  - `src/lib/use-learning.ts` — хук состояния: загрузка, `grade`, `markKnown` (сразу `Easy`), `updateMeta`. Ошибка записи → тост `toast.error` (shadcn sonner в стиле приложения, `components/ui/sonner.tsx`, один тост с id `save-error`). Данные дублируются в ref, чтобы последовательные вызовы в одном обработчике не теряли изменения.
  - `src/lib/exercises.ts` — сборка упражнения по состоянию карточки FSRS (не Review → выбор EN→RU/RU→EN; stability < 7 дн → пропуск / сборка из кусков; 7–21 дн → ввод / сборка из слов; дальше ввод; плитки проверяются по одной, оценка по числу промахов), дистракторы той же части речи без пересечения переводов, проверка ввода по Левенштейну (опечатка → `Hard`), подсказки (поле ввода пустое, подсказка открывает буквы фиксированным префиксом, следующая плитка в сборке; с подсказкой максимум `Hard`) и «Не помню» (`Again`, слово возвращается в очередь).
  - `src/exercises/` — UI упражнений, карточка нового слова, панель обратной связи.
  - `src/screens/` — `home`, `session` (ошибка → слово возвращается в очередь через 4 позиции, не больше 2 раз; финальный круг — новые слова и слова с ошибками; при точности < 70% на итоге «Повторить ошибки»), `session-summary`, `level-test` (коррекция по псевдословам; диапазон 1–500 ≥ 85% → все NGSL-слова диапазона в `Easy`); навигация через `useState`, без роутера.
  - `src/lib/telegram.ts` — `useBackButton` (заодно блокирует свайп-закрытие, `Esc` = назад), `haptic`.
  - `src/lib/use-hotkeys.ts` — клавиатура для Telegram Desktop (`event.code`, capture-фаза): `1`–`4`, `Enter`, `Shift+Enter` «Не помню», `Tab` подсказка, буквы + `Space` для плиток; подписи клавиш `components/key-label.tsx` только при `pointer-fine`..
  - `src/screens/settings.tsx` — резервная копия (экспорт в буфер обмена как JSON `{ "p_NN": ..., "meta": ... }`, старые копии с `p:NN` тоже принимаются, импорт перезаписывает все 64 пачки и перезагружает страницу), повтор теста уровня, точность по упражнениям за 30 дней (`верно/всего` и %); сверху табы языка интерфейса «RU / EN» (`components/ui/tabs.tsx` — shadcn Tabs: стеклянная дорожка, бегунок `glass-strong`), внизу действия одним рядом как на главной: иконка-дискета (копия), «Тест заново», «Готово».
- `.github/workflows/deploy.yml` — push в `main` → lint + build `web/` (переменная `VITE_API_URL`) → GitHub Pages.
- `worker/` — Cloudflare Worker (TS без фреймворка): `src/auth.ts` проверка `initData` + allowlist `ALLOWED_USER_IDS`, `src/index.ts` API `GET/PUT /progress[/:key]` + CORS, `src/backup.ts` ежедневный файл-копия в чат с ботом (cron `0 0 * * *`), `schema.sql` таблица `kv`. Секреты Worker: `TELEGRAM_BOT_TOKEN`, `ALLOWED_USER_IDS`; локально — `worker/.dev.vars` (в gitignore).
- `.github/workflows/worker.yml` — push в `main` по `worker/**` → typecheck, схема в D1, `wrangler deploy`. Секреты `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- `scripts/check-content.mjs` — проверка `words.json` (`form` ровно один раз, правила `chunks`) и `facts.json` (длина, дубли); `content/draft/merge_chunks.mjs` вливает черновики кусков.
- `scripts/send-reminder.mjs` — отправка напоминания (`sendMessage` с кнопкой `web_app`), читает `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `APP_URL` из окружения. Локально ключи в `.env` (шаблон `.env.example`, `.env` в gitignore, ассистент его не читает).
- `.github/workflows/reminder.yml` — cron `0 17 * * *` (20:00 МСК) → `node scripts/send-reminder.mjs`. Секреты `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, переменная `APP_URL`.
- Дизайн: тёмное матовое стекло (прототип `content/draft/glass-prototype.html`, локально). Фон «Графит» `#0b0d12` с зерном и едва заметным светом сверху; текст `#f2f3f5`, подписи `#868c97`; главное действие — сплошная белая `#fafaf8` кнопка; акценты только «Шалфей и глина»: `--success` `#a8c5a0` (верно), `--warning` `#d8c18a` (почти / запомни) и `--destructive` `#d4917a` (неверно). Тема Telegram не используется (`initTelegram` красит шапку/фон в `#0b0d12`). Панели и второстепенные кнопки — утилиты `glass` / `glass-strong` (полупрозрачная заливка + blur + зерно), тонированное стекло `tint-success` / `tint-warning` / `tint-destructive`; никаких обводок, теней, свечений и градиентов (исключения — фон прелоадера и затемнение под зоной действий). Скругления: карточки `rounded-3xl`, кнопки `rounded-2xl`/`rounded-[20px]`, иконки и номера — круги. Панель результата без иконок. Shadcn-компоненты в `components/ui` перерисованы под этот стиль.
- Шрифты: Montserrat (`@fontsource/montserrat`, только latin + cyrillic, 300/400/500) — для всего: 300 для крупных слов и цифр, 400–500 для текста и кнопок, жирного нет; JetBrains Mono 400 (`font-mono`) — мелкие подписи. Изучаемое слово — `components/word-title.tsx`, начертание 500: размер подгоняется под ширину (`cqi` от длины самого длинного слова фразы, запас 0.66em на букву).
- Раскладка «под большой палец»: каждый экран — `ThumbLayout` (шапка → прокручиваемый контент → зона действий поверх него с отступом ~40px снизу, под кнопками лёгкий градиент затемнения `from-background/80`; кнопки вне скролла, не sticky — sticky + `backdrop-filter` на iOS прятал шестерёнку). Все кнопки только в зоне действий — это главный принцип, включая варианты ответа (нумерованные строки) и настройки (исключение — табы языка сверху в настройках); панель результата ответа заменяет варианты в той же зоне. Озвучка только по кнопке 🔊, без автоплея. Выход из сессии — системная BackButton Telegram (крестик только вне Telegram).
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

Фичи и изменения поведения идут через `openspec/` (схема `spec-driven`, конфиг `openspec/config.yaml`): `openspec/specs/<module>/<feature>/spec.md` — источник правды по наблюдаемому поведению; изменение в работе живёт в `openspec/changes/<change-id>/` (`proposal.md` → `specs/**/spec.md` дельта ADDED/MODIFIED/REMOVED → `design.md` → `tasks.md`); законченное архивируется в `openspec/changes/archive/YYYY-MM-DD-<change-id>/`, дельта вливается в основные спеки. Сначала договариваемся в документах, потом код. Команды: `/opsx:explore`, `/opsx:propose <id>`, `/opsx:apply`, `/opsx:update`, `/opsx:archive`; перед архивом `openspec validate <id> --strict`. Мелкие фиксы, стили, переименования — без change. Инициализировано 2026-10-26 (`openspec init --tools claude`), основные спеки: `progress/{settings,server-storage,daily-backup,answer-stats}`, `scheduling/{lessons,home}`, `session/{lesson-flow,hints,sentence-builder,keyboard}`, `ui/{visual-style,interface-language}`.

## Команды (в `web/`)

`npm run dev`, `npm run build`, `npm run lint` (oxlint), `npm run typecheck`, `npm run format`.

В `worker/`: `npm run dev` (wrangler dev), `npm run typecheck`, `npm run db:local` / `npm run db:remote` (схема D1), `npm run deploy`.

Из корня: `node --env-file=.env scripts/send-reminder.mjs` — отправить напоминание вручную.

## Current state / Open work

- Готово: контент, каркас, хранилище, планировщик, главный экран, сессия с 5 упражнениями (+ повтор новых слов в конце), тест уровня, настройки, workflow деплоя и напоминаний.
- Готово 2026-10-27: прогресс на сервере (`server-progress`) — миграция, второе устройство и дозаливка проверены в Telegram; ждём первый ночной файл-копию от бота (03:00 МСК).
- Готово 2026-10-28: подсказки и «Не помню», сборка предложения из кусков с проверкой по плиткам, повтор ошибок, единый «Урок» с плавным числом новых слов, клавиатура, стеклянный редизайн (Montserrat, шалфей / песок / глина), минималистичная главная с графиком, плитками и трудными словами, прелоадер. Все изменения в `openspec/changes/archive/2026-10-28-*`.
- Готово 2026-10-31: переключатель языка интерфейса RU / EN в настройках (`interface-language`).
- Дальше: проверка внутри Telegram на айфоне — клавиатура при вводе в предложении (строка кнопок над клавиатурой), `Esc` и подписи клавиш в Telegram Desktop, прелоадер, CloudStorage, BackButton, haptics.
- Роадмап контента (2026-10-31, по порядку, каждый — отдельный OpenSpec change):
  1. Фразовые глаголы и сочетания (`set up`, `roll back`, `out of the box`) — новый источник по схеме `words.json`, разрывные формы (`set it up`); заодно решить общий счётчик на главной и чередование источников в уроке.
  2. Сообщения об ошибках и интерфейс (`Permission denied`, `is deprecated`) — фраза целиком как единица.
  3. Семьи слов (`deploy → deployment → redeploy`) — поле `family`, упражнение «узнай форму».
  4. Грамматика на узнавание (пассив, `should`/`must`/`may`, условия, `-ing`) — карточки-конструкции под FSRS.
  5. Чтение реальных кусков документации — тап по слову → перевод и в колоду, вопрос на понимание.
  6. Бот-компаньон — итог недели по cron, разбор присланного текста по словарю.
  Аудирование — не делаем.
