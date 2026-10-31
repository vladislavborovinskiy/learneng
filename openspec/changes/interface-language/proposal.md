## Why

Every button, label and message is in Russian. The learner wants to be able to switch the whole
interface to English, so the app itself becomes reading practice, and to switch back when an
English label gets in the way.

## What Changes

- Settings get an interface language switch «RU / EN» at the top of the screen — the one
  exception to the thumb-zone rule besides the close button. It is a two-segment tab control in
  the glass style.
- The choice is stored in `meta` (`language`, default `ru`), so it follows the learner across
  devices and is part of the manual and daily backups. Progress and backups without the field
  load as Russian.
- With English selected, every interface string is shown in English: buttons, screen labels,
  exercise titles, feedback titles, home and summary labels, chart dates («Oct 28»), settings,
  level test, preloader button, toasts, backup errors and accessibility labels.
- Stays Russian regardless of the switch: word and sentence translations, the Russian line of
  preloader facts and the bot reminder.
- Russian stays the default; nothing changes for the learner until they switch.

## Capabilities

### New Capabilities

- `ui/interface-language`: the two interface languages, what is and is not translated, the
  English wording of every Russian string quoted in the specs, and the fallback to Russian.

### Modified Capabilities

- `progress/settings`: the settings screen offers the language switch at the top and the choice
  is kept in Meta.
- `ui/visual-style`: the language switch is an exception to «every button in the thumb zone».

## Impact

- Code: `web/src/lib/` (new strings dictionary, `storage.ts` Meta field and backup errors,
  `use-learning.ts` toast, `scheduler.ts` month names), all screens in `web/src/screens/`, all
  exercises in `web/src/exercises/`, `web/src/components/` (chart, header, speak button, new
  `ui/tabs.tsx` from shadcn), `web/src/App.tsx`, `web/index.html` (preloader button).
- Dependencies: shadcn `tabs` (Base UI `Tabs`, already a dependency through Base UI).
- Stored data: optional `language` in the `meta` key; old data stays valid.
- Module guidelines: `.ai/guidelines/modules/progress.md` (Meta, settings),
  `.ai/guidelines/modules/session.md` and `.ai/guidelines/modules/scheduling.md` (note that
  quoted strings have English variants).

## Non-goals

- Translating content: words, sentences, facts, level test data.
- The bot reminder text and the bot description.
- Detecting the language from Telegram or the system.
- More languages or a third-party i18n library.
