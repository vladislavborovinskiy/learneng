## Why

The learner almost never assembles a sentence correctly: «Собери предложение» appears right after
a word is first learned, asks to order 6–10 single words plus 3 extra ones with no guidance, and
a word-order mistake grades the word itself `Again`, so the same word keeps coming back to the
same unsolvable exercise. The exercise checks English word order, which an A1–A2 learner has not
been taught, instead of teaching it. There is also no stored data to see which exercise types
fail, so the effect of any change cannot be measured.

## What Changes

- Tiles are checked one at a time: a wrong tile shakes and is not placed; after two wrong taps
  for the same position the right tile is highlighted. The exercise ends by itself when the
  sentence is complete — there is no «Проверить» and no removing of placed tiles.
- Grade by the number of wrong taps: 0 → `Good`, 1–2 → `Hard` («Почти! Были ошибки»), 3+ →
  `Again`; a hint still caps the grade at `Hard`.
- Two tile stages: young words (stability under 7 days) are assembled from 2–4 meaningful
  chunks («This software» / «is free» / «for personal use») without extra tiles; word-by-word
  assembly with 3 extra tiles moves to familiar words (7–21 days), shared 50/50 with typing.
- Content: every sentence gets chunk boundaries, produced once offline by LLM-assisted
  generation and validated by a script that also checks the existing `form` invariant.
- Answer statistics per exercise type (correct/total per day, last 30 days) are stored and shown
  in settings as «Точность по упражнениям».

## Capabilities

### New Capabilities

- `session/sentence-builder`: tile stages, per-tile checking, highlighting, grading, hint.
- `progress/answer-stats`: stored per-type answer statistics and their display in settings.

### Modified Capabilities

- `session/hints`: the tile hint no longer removes wrong tiles (they cannot be placed).

## Impact

- Content: `content/words.json` gains a chunk-boundaries field per sentence (~+7% raw size);
  drafts in `content/draft/`; new validation script in `scripts/`.
- Code: `web/src/lib/{content,exercises,storage,use-learning}.ts`, `web/src/exercises/{tiles,feedback-panel}.tsx`,
  `web/src/screens/{session,settings}.tsx`, `web/src/index.css` (shake keyframes).
- Stored data: new key `stats` (CloudStorage + server); existing keys and backups unchanged.
- Module guidelines: `content.md`, `session.md`, `progress.md`.
- Depends on `hints-and-forgot` being archived first (its `session/hints` spec is modified here).

## Non-goals

- Grammar lessons explaining word order — the planned grammar track.
- Accepting alternative valid word orders.
- Showing statistics anywhere but settings.
