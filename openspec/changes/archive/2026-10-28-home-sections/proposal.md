## Why

The minimal home screen still feels empty below the chart, and the «финиш · …» forecast line
does not help the learner. Home should give a quick, calm picture of how learning goes and
what to work on, without adding buttons.

## What Changes

- The «финиш · M YYYY» forecast is removed from home.
- Two glass tiles under the chart: answer accuracy over the last 7 days («точность · 7 дн») and
  reviews done today («повторений сегодня»).
- A glass section of hard words (no visible title): up to 3 words with the most lapses — English word, first
  translation, clay dots for lapses (up to 3). Hidden when no word has lapses.
- The streak chip shows a Phosphor flame instead of a dot: sand when the streak is above 0,
  muted at 0 (applies to the `glass-redesign` streak requirement).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `scheduling/home`: goal block without forecast; new stats tiles and hard-words section.

## Impact

- Code: `web/src/screens/home.tsx`, `web/src/lib/scheduler.ts` (`getStats`), `web/src/App.tsx`
  (passes answer stats).
- Stored data: none (uses cards' `lapses`, `meta.days[*].reviewed`, `stats`).
- Module guidelines: `scheduling.md`; CLAUDE.md home line. Depends on `minimal-home` being
  archived first.

## Non-goals

- Tapping a hard word to drill it (buttons stay in the thumb zone).
- «Недавно выученные» section.
