## Context

No key handling exists in the app. Buttons are Base UI `Button`s; `FeedbackPanel`'s «Дальше» has
`autoFocus`, so a native `Enter` already activates it on some platforms; the typing input submits
its form on `Enter`. `useBackButton(onBack)` in `telegram.ts` wires the Telegram BackButton and
is used by session, level test and settings. Tailwind 4.3 ships the `pointer-fine:` variant. See
proposal.md — Why.

Module guidelines this change updates: `session.md` (new Glossary entry «Keyboard», gotchas),
`telegram.md` (BackButton flow: `Esc`).

## Goals / Non-Goals

**Goals:**

- One small hook owns all listeners; components declare bindings, never add raw listeners.
- No double actions between native button/form behaviour and shortcuts.

**Non-Goals:**

- Focus management or tab order for accessibility (Tab is repurposed as hint inside lessons).

## Decisions

### 1. `useHotkeys(bindings, enabled)` in `web/src/lib/use-hotkeys.ts`

`bindings: Record<string, () => void>` keyed by `event.code` with an optional `Shift+` prefix
(`'Enter'`, `'Shift+Enter'`, `'Tab'`, `'Digit3'`, `'Numpad3'`, `'Space'`, `'Escape'`). One
`keydown` listener on `window` in the **capture** phase: ignores `event.repeat` and
Ctrl/Alt/Meta combos, looks up the binding, calls `preventDefault()` + `stopPropagation()` and
runs it. Capture + `preventDefault` stops the native `Enter` click on the focused button and the
implicit form submit, so every action fires once from one place. Bindings are kept in a ref so
the listener is attached once per `enabled` change.

- Alternative: `onKeyDown` props on each component — rejected: focus decides which element
  receives the key, so «Дальше» would work only when the panel happens to be focused.
- Alternative: a library (`react-hotkeys-hook`) — rejected: one 20-line hook covers the need; no
  new dependency in the bundle.

### 2. `event.code`, not `event.key`

Digits and tile letters are matched by physical key (`KeyA`–`KeyZ` → `a`–`z`, `Digit0`–`Digit9`),
so shortcuts and tile search work with the Russian layout active — the learner's default. Tile
search therefore uses its own `keydown` path inside the same hook: a `onText(char)` callback
receives Latin letters/digits derived from `code` when no binding matched; the typing exercise
does not pass it (the input receives real text there).

- Alternative: `event.key` — rejected: on the Russian layout `KeyF` yields «а», tiles would never
  match.

### 3. Where bindings live

- `Choice`: `Digit1..4` / `Numpad1..4` → option, `Shift+Enter` → forgot; disabled once feedback
  is shown.
- `Typing`: `Enter` → submit (if non-empty), `Shift+Enter` → forgot, `Tab` → hint (if available).
- `Tiles`: `Tab` → hint, `Shift+Enter` → forgot, `Space` → place highlighted, `Backspace` →
  search text minus one, `onText` → append; search text shown as a mono line above the pool.
- `WordIntro`: `Enter` → «Дальше». `FeedbackPanel`: `Enter` → «Дальше» (its `autoFocus` stays for
  screen readers; the capture handler prevents the double click).
- `SessionSummary`: `Enter` → primary action.
- `useBackButton`: registers `Escape` → `onBack` via the same hook, in and outside Telegram.

Only one exercise or panel is mounted at a time, so bindings never compete; exercise bindings are
disabled while `feedback` is shown.

### 4. Key labels

A tiny inline `<kbd>` styled `hidden pointer-fine:inline font-mono text-[10px]` inside the
buttons («Enter», «⇧Enter», «Tab», «Space»), defined once as `KeyLabel` in
`web/src/components/key-label.tsx` because five components use it. Reused: `Button`; the choice
number circles already act as labels.

## Risks / Trade-offs

- [Telegram Desktop may handle `Esc` itself (e.g. close the Mini App)] → harmless: leaving is
  what `Esc` should do; checked manually in Telegram Desktop.
- [`Tab` no longer moves focus inside lessons] → acceptable for a single-user trainer; outside
  lessons Tab works normally.
- [`pointer-fine` on touch laptops shows labels] → labels are tiny and still correct.

## Migration Plan

No stored-data change. Deploy via push to `main`; rollback = revert.
