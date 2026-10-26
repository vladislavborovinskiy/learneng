## Context

Theme lives in `web/src/index.css` as shadcn tokens plus utilities `pixel-corners` and
`stripes`; shadcn components in `components/ui` use `border-(length:--pixel)`, `pixel-corners`
and `font-pixel`. Icons come from `pixelarticons`. `ThumbLayout` already puts `actions` at the
bottom; only settings keeps buttons inside cards.

## Goals / Non-Goals

**Goals:** swap the visual system through tokens and the few shared components, so screens only
lose pixel-specific classes. **Non-Goals:** light theme, illustrations.

## Decisions

### 1. Tokens stay shadcn-shaped, colors collapse to three

`--background/--card` ink, `--foreground/--border/--input` paper, `--primary/--ring` orange,
`--muted-foreground` muted paper. Semantic tokens map into the same three colors
(`--success`, `--destructive` → orange, `--warning` → paper): correct vs wrong is carried by
texture and label, not by a fourth color.

- Alternative: keep a separate red/green — rejected: breaks the three-color print look the
  learner picked.

### 2. Lines via `--line: 1.5px`, controls via 2px borders

Thin lines for panels, tracks and option rows; 2px for buttons, tags and inputs.

### 3. Texture utilities in `index.css`

`halftone` (paper dots), `hatch` (paper diagonal), `hatch-primary` (orange diagonal, progress),
`rays` (orange conic rays from the bottom-left corner). Replace `pixel-corners` and `stripes`.

### 4. Fonts

`@fontsource/rubik` latin + cyrillic subsets, weights 400/500/700/900, as `--font-sans` and
`--font-display`; JetBrains Mono stays as `--font-mono` for captions. `font-pixel` and the
Pixelify face are removed.

### 5. Icons

`@phosphor-icons/react` per-icon imports `@phosphor-icons/react/dist/csr/<Name>`, `weight="bold"`.

- Alternative: lucide — rejected: thinner default stroke reads weaker against 2px borders.

### 6. Summary needs per-answer results

`Session` stats switch from counters to `results: AnswerResult[]` + `learned`; counts derive from
the array. No storage change.

### 7. Settings buttons move to `actions`

Content keeps explanations and the backup textarea; copy/restore/retake/done buttons go to the
action zone.

## Risks / Trade-offs

- [Only orange marks positive and negative states] → labels and textures differ strongly; haptics
  already differ.
- [Bundle grows with a new font] → only two subsets and four weights are imported.
