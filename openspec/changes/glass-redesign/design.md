## Context

Styling lives in `web/src/index.css` (shadcn tokens mapped to Tailwind colours, Rubik via
`@fontsource`, utilities `halftone`, `hatch`, `hatch-primary`, `rays`, `--line` 1.5px) and in
the shadcn components under `components/ui` (button with `border-2` variants, card / progress
with `--line` outlines). Screens and exercises use `font-display font-black`, `border-(length:--line)`
and the texture utilities directly. `telegram.ts` paints the bars `#1a1815`. The approved look
is the local prototype `content/draft/glass-prototype.html` (Montserrat, «Шалфей и глина»,
«Графит»). See proposal.md — Why.

Module guidelines this change updates: `telegram.md` (bar colour), `session.md` (feedback
visuals, summary cells); CLAUDE.md «Дизайн» and «Шрифты» lines.

## Goals / Non-Goals

**Goals:**

- Swap the visual language through tokens and a few utilities so screens change mostly by
  class names, not structure.
- Keep shadcn component APIs (`variant`, `size`) so call sites change minimally.

**Non-Goals:**

- Layout or behaviour changes; light theme.

## Decisions

### 1. Tokens: keep shadcn names, new values + a few new ones

`--background #0b0d12`, `--foreground #f2f3f5`, `--muted-foreground #868c97`, `--primary
#fafaf8`, `--primary-foreground #0a0b0f`, `--success #a8c5a0`, `--destructive #d4917a`, `--glass
rgba(255,255,255,.045)`, `--glass-strong rgba(255,255,255,.09)`, `--track rgba(255,255,255,.08)`.
`--border`/`--input` become transparent-equivalents (glass), `--ring` near-white for focus.
Exposed to Tailwind as `bg-glass`, `bg-glass-strong`, `text-success`, `text-destructive`, etc.

- Alternative: a fresh token set without shadcn names — rejected: every `components/ui` file and
  sonner reference the shadcn names; renaming adds churn without benefit.

### 2. Glass and background as utilities in `index.css`

`@utility glass` = `background: var(--grain), var(--glass); backdrop-filter: blur(28px)
saturate(150%)` (+ `-webkit-`), `@utility glass-strong` likewise, `@utility tint-success` /
`tint-destructive` = grain + `color-mix(in srgb, <colour> 12%, transparent)`. `--grain` is an
inline SVG `feTurbulence` data URI. The body background = grain + faint top radial light +
graphite. Old utilities `halftone`, `hatch`, `hatch-primary`, `rays` and `--line` are deleted, so
leftovers fail the build or lint visibly.

- Alternative: per-component inline styles — rejected: the same three recipes repeat on ~15
  components.

### 3. Fonts: `@fontsource/montserrat` replaces `@fontsource/rubik`

Import only `latin` + `cyrillic` subsets of 300/400/500 (bundle size, as now with Rubik).
`--font-sans` = `--font-display` = Montserrat; `font-display font-black` call sites become
`font-light` (big words / numbers) or `font-medium` (titles). JetBrains Mono stays for small
captions (add the 400 file).

### 4. Components

- `Button`: no `border-2`; `default` = solid primary; `outline` / `secondary` → `glass`;
  `ghost` stays transparent; rounded `rounded-[20px]` (lg) / `rounded-2xl`; icon sizes stay
  circles; `font-medium`. Active state = `glass-strong` / opacity, no movement.
- `Card` → `glass rounded-3xl`, no outline. `Progress` → 3px `--track` rail, solid primary fill,
  rounded. `Input` → glass rounded, no outline, focus = subtle `glass-strong` + ring.
- `ScreenLabel` → glass pill, mono caption. `ProgressHeader` → thin rail + glass circle close.
- `FeedbackPanel` → `tint-success` / `tint-destructive` by `isMistake`, no icon; highlighted word
  in the result colour.
- Summary cells → rounded squares `bg-success` / `bg-destructive`.
- Tiles: pool tiles glass, placed tiles `glass-strong`, highlighted tile `bg-success/20`
  `text-success`, used slots `bg-glass` faded.
- Home: goal panel per prototype; streak chip glass with sage dot and the number only.

### 5. Adaptive word: `WordTitle` component

`components/word-title.tsx` (used by `WordIntro` and `Choice` en→ru): sets
`--longest` = longest space-separated part length and renders with
`font-size: min(3.6rem, calc(100cqi / (var(--longest) * 0.62)))`, `font-light`,
`text-wrap: balance`, `overflow-wrap: anywhere`; the content area becomes a size container
(`@container` on `ThumbLayout` main). Factor 0.62 checked in the prototype at 360px for the
deck's longest word «multiprocessing» and phrase «object-oriented programming».

- Alternative: JS measuring and shrinking — rejected: CSS container units handle it without
  layout passes.

## Risks / Trade-offs

- [`backdrop-filter` cost on weak Android] → the learner uses iPhone only (stated); blur kept.
- [Sage vs clay summary cells distinguishable only by hue] → they also differ in lightness; the
  feedback panel always has the text label.
- [Big visual diff in one change] → structure untouched; screenshots of every screen at 360px
  compared with the prototype before archiving.

## Migration Plan

No stored data. Deploy via push to `main`; rollback = revert.
