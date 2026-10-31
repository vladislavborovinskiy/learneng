## 1. Strings & storage

- [x] 1.1 `lib/i18n.ts`: `ru` dictionary with every interface string from the files listed in design.md (grouped by screen, functions for placeholders, `months`), `en: typeof ru` with the wording from `ui/interface-language`, `strings`, `Language`, `Strings`, `StringsContext`, `useStrings` — verify: `npm run typecheck` fails if one `en` key is removed
- [x] 1.2 `storage.ts`: `Meta.language` (default `'ru'`, anything but `'en'` → `'ru'` on load), `BackupError` with `reason` and `key` instead of Russian messages — verify in dev: old `meta` without the field loads as Russian; restoring `{}` shows the translated «not a backup» error
- [x] 1.3 `use-learning.ts`: save toast from `strings[meta.language]` — verify: with the network blocked in dev and English selected, the toast reads «Progress not saved»

## 2. UI

- [x] 2.1 `App.tsx`: `StringsContext` provider with `strings[meta.language]`; preloader button text from `t.common.gotIt` when it is revealed — verify: with English selected, reload shows «Got it»
- [x] 2.2 Replace inline Russian with `useStrings()` in `screens/home.tsx`, `session-summary.tsx`, `level-test.tsx`, `settings.tsx`, `exercises/choice.tsx`, `typing.tsx`, `tiles.tsx`, `word-intro.tsx`, `feedback-panel.tsx`, `components/progress-header.tsx`, `speak-button.tsx`, `pace-chart.tsx` (dates «Oct 28» / «28 окт»); drop `SHORT_MONTHS` from `scheduler.ts` — verify: `grep -rnP '[А-Яа-яЁё]' web/src` matches only the `ru` dictionary and the load error in `App.tsx`
- [x] 2.3 `npx shadcn add tabs` and restyle `components/ui/tabs.tsx` per design.md (glass list, sliding `glass-strong` indicator, no borders/shadows, reduced motion) — verify in dev: indicator slides between «RU» and «EN»
- [x] 2.4 `settings.tsx`: full-width «RU» / «EN» switch above the action row, labelled «Язык интерфейса» / «Interface language», `updateMeta({ language })` — verify in dev: tapping «EN» switches settings at once, the choice survives a reload, and home, a lesson with all five exercise types, the summary and the level test read in English at 360 px without broken rows

## 3. Docs & verification

- [x] 3.1 Update `.ai/guidelines/modules/progress.md` (Meta `language`, settings flow), one line in `session.md` and `scheduling.md` about English variants, and CLAUDE.md (`lib/i18n.ts`, settings switch, `components/ui/tabs.tsx`)
- [x] 3.2 Run `npm run lint && npm run typecheck` in `web/` — verify: no errors
- [x] 3.3 `openspec validate interface-language --strict` passes
