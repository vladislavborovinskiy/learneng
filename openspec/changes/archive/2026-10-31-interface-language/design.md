## Context

See proposal.md for motivation. Today about 90 Russian strings are inlined in ~17 files:
screens, exercises, three components, `storage.ts` (backup errors), `use-learning.ts` (save
toast), `scheduler.ts` (`SHORT_MONTHS`), `App.tsx` (load error) and `index.html` (preloader
button). Meta is `{ levelTestDone, days }`, serialized by `serializeMeta` as JSON into the `meta`
key (well under the 4096-char CloudStorage limit; one more short field is fine) and merged over
`defaultMeta` on load. Settings already have one action row in the thumb zone and save Meta via
`updateMeta`. There is no React context for app state; `useLearning` is called once in `App`.

Module guideline sections to update: `progress.md` — Glossary (Meta gets `language`) and Key
flows 5 (settings switch); `session.md` and `scheduling.md` — one line that quoted strings have
English variants in `ui/interface-language`.

## Goals / Non-Goals

**Goals:**
- One typed dictionary where a missing English string fails `npm run typecheck`.
- Components read strings without prop drilling; switching re-renders at once.

**Non-Goals:**
- Lazy-loading dictionaries, plural rules beyond what the strings need, RTL.

## Decisions

### Dictionary: `web/src/lib/i18n.ts`

`const ru = { … }` holds every string grouped by screen (`home`, `session`, `exercises`,
`feedback`, `summary`, `levelTest`, `settings`, `backup`, `common`, `months`); strings with
placeholders are functions (`ofWords: (total: number) => \`из ${total} слов\``). `const en:
typeof ru = { … }`. Exported `strings = { ru, en }`, `type Language = keyof typeof strings`,
`type Strings = typeof ru`.

Rejected: `react-i18next` with JSON files — string keys are not type-checked, adds ~15 KB and
async loading for two small languages and one user. Rejected: keeping strings inline with
`language === 'en' ? … : …` — doubles every JSX site and nothing enforces completeness.

### Access: context + `useStrings()`

`i18n.ts` exports `StringsContext = createContext<Strings>(ru)` and `useStrings()`. `App.tsx`
wraps the screens in `<StringsContext value={strings[meta.language]}>` (React 19 context as a
provider). Components call `const t = useStrings()`.

Non-components take strings explicitly: `use-learning.ts` reads `strings[dataRef.meta.language]`
for the save toast; `importBackup` throws `BackupError` with `reason: 'notBackup' | 'unknownKey'
| 'badValue'` and `key`, and settings formats it via `t.backup.errors[reason](key)`; the load
error in `App.tsx` happens before Meta exists, so it uses `ru`. `SHORT_MONTHS` moves into the
dictionary as `months`; `formatDay` in `pace-chart.tsx` becomes language-aware (`Oct 28` vs
`28 окт`).

Rejected: passing `t` as a prop from `App` — exercises are three levels deep and every
intermediate component would carry it. Rejected: a module-level mutable `currentLanguage` — no
re-render on switch.

### Storage: `meta.language`

`Meta` gets `language: Language`, `defaultMeta.language = 'ru'`. `loadAll` keeps the existing
merge over defaults and normalizes anything other than `'en'` to `'ru'`. `serializeMeta` writes
it as is, so it reaches the server, CloudStorage and both backups without format changes; old
backups simply lack the field.

Rejected: `localStorage` — not synced across devices and lost on restore. Rejected: a separate
CloudStorage/server key — one more key in every sync path and the backup format for a single
field.

### Switch: shadcn `tabs`, restyled

`npx shadcn add tabs` (base-nova → `@base-ui/react` `Tabs`), then restyle `components/ui/tabs.tsx`
like `button`/`progress` were: list `glass rounded-2xl p-1`, tab `rounded-xl h-11 font-medium
text-muted-foreground`, selected tab `text-foreground`, `Tabs.Indicator` as a `glass-strong
rounded-xl` pill that slides (`transition-[left,width]`, off under reduced motion). No border,
shadow or ring except `focus-visible`. Settings render it full-width in the `ThumbLayout` header, `value={meta.language}`, `onValueChange` → `updateMeta({ language })`;
no haptic — the app's `haptic` only has notification types, and a tab switch is not a result. Tab panels are not used.

Rejected: two outline buttons — looks like two actions rather than one choice and needs its own
selected styling. Rejected: the thumb zone above the action row (first version) — the learner preferred it on top;
it is changed rarely, so reach matters less than keeping the bottom row uncluttered.

### Preloader button

The static `#preloader-close` keeps «Понятно» in `index.html`; `App.tsx` already reveals it after
load, and at that moment sets its text from `t.common.gotIt`. The button is hidden until then,
so there is no visible flash.

Rejected: reading the language from `localStorage` in the inline script — a second copy of the
setting that can go stale.

## Risks / Trade-offs

- [English text is longer and may wrap in the action row («Retake test», «Review mistakes»)]
  → check both languages at 360 px; buttons already use `whitespace-nowrap` and flex.
- [A string is missed and stays Russian] → grep for Cyrillic in `web/src` and `index.html` after
  the change; only the dictionary's `ru`, content data and `App.tsx` load error may match.
- [Specs keep quoting Russian] → the English wording table in `ui/interface-language` is the
  single mapping; new strings must be added to both the dictionary and that table.

## Migration Plan

No data migration: the field is optional on read. Rollback is a plain revert; an extra
`language` in stored Meta is ignored by the old code (spread into Meta, unused).
