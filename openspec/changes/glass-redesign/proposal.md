## Why

The retro print style (ink, paper, orange, hatching) no longer matches what the learner wants to
open every day. A prototype (`content/draft/glass-prototype.html`, local only) settled a calmer,
premium dark look: frosted glass panels on a graphite ground, a white main action, Montserrat
and a muted sage / clay accent pair. The learner approved every part of it.

## What Changes

- **BREAKING** (visual): the whole app moves from the retro print style to the glass style.
- Palette: graphite background `#0B0D12`, near-white text `#F2F3F5`, muted grey captions
  `#868C97`, white main action `#FAFAF8` with dark text, accent pair sage `#A8C5A0` («верно»,
  progress-positive), sand `#D8C18A` («почти», «запомни») and clay `#D4917A` («неверно»). Telegram header / background / bottom bar
  painted graphite.
- Background «Графит»: plain graphite with fine grain and a faint light at the top. No glows, no
  coloured blobs.
- Surfaces: frosted glass — translucent white fill (~4–9%), blur, fine grain. **No outlines, no
  shadows, no glows, no gradients** on panels or buttons. Rounded corners (cards ~24px, buttons
  ~18–20px, circles for icon buttons and number markers).
- Buttons: main action solid white; everything else glass.
- Typography: Montserrat (Cyrillic + Latin) for everything — light 300 for large words and
  numbers, 400–500 for text and buttons; a monospace face only for small captions.
- The word being learned scales to the screen width: short words stay large, the longest word
  of the phrase always fits, phrases wrap between words.
- Feedback: «Правильно!» / «Почти! Опечатка» / «Верно, с подсказкой» in sage, «Неправильно» /
  «Запомни» in clay — text and tinted glass only, no icons, no textures.
- Summary cells: sage for correct, clay for mistakes.
- Streak chip shows a flame icon and only the number.
- Textures (halftone, hatching, rays) are removed.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `ui/visual-style`: palette, typography, surfaces, background, feedback visuals, summary cells;
  new requirement for the adaptive word size. The thumb-zone requirement stays unchanged.

## Impact

- Code: `web/src/index.css` (tokens, fonts, utilities), `web/src/components/ui/*`,
  `web/src/components/*`, every screen and exercise in `web/src/screens` and
  `web/src/exercises`, `web/src/lib/telegram.ts` (bar colours), `web/package.json` (font
  package swap).
- Stored data: none.
- Module guidelines: `telegram.md` (bar colour), `session.md` (feedback visuals); CLAUDE.md
  design and font lines.

## Non-goals

- Changing layout, flows or behaviour — screens keep their structure and the thumb zone.
- A light theme.
- Illustrations or imagery behind the glass.
