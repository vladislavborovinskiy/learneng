## 1. Data & logic

- [x] 1.1 `exercises.ts`: `AnswerResult` gains `hinted` and `forgot`, `gradeByResult` maps them to `Hard`/`Again`; add `hintTiles(tiles, selected, answer)` and a helper for the typing reveal limit — verify: `npm run typecheck` (exhaustive maps compile)
- [x] 1.2 `scheduler.ts`: `getDueWordIds` sorts by `lapses` desc, then `due` asc — verify: in dev, give one due card `lapses: 3` in localStorage → it is the first review of the next lesson

## 2. UI

- [x] 2.1 `typing.tsx`: fixed prefix inside the input wrapper, hint button (reveals letters, clears typed text, hidden at the limit), «Не помню», check `prefix + value`, `hinted` when a hint was used — verify: «Software» shows «S», backspace keeps it; after a hint and a correct answer the panel reads «Верно, с подсказкой»
- [x] 2.2 `sentence-with-blank.tsx` hint follows the revealed prefix — verify: after a hint the blank shows «de____»
- [x] 2.3 `tiles.tsx`: hint button via `hintTiles`, «Не помню», `hinted` when a hint was used — verify: place a wrong tile, tap the hint → wrong tile removed, next correct one placed
- [x] 2.4 `choice.tsx`: «Не помню» under the options — verify: tap it → panel «Запомни»
- [x] 2.5 `feedback-panel.tsx`: variants `hinted` («Верно, с подсказкой», rays, shows «Ответ:») and `forgot` («Запомни», hatch, word with translations + sentence) — verify: both panels render in dev at 320px width without overflow
- [x] 2.6 `session.tsx`: requeue on `wrong | forgot`, haptics for new results; `session-summary.tsx`: `forgot` counts as a mistake cell, `hinted` as correct — verify: tap «Не помню» → the word returns 4 items later; summary accuracy excludes it

## 3. Docs & verification

- [x] 3.1 Update `.ai/guidelines/modules/session.md` and `scheduling.md` (results, hints, «Не помню», due order) and the `exercises.ts`/`scheduler.ts` lines in CLAUDE.md
- [x] 3.2 Run `npm run lint && npm run typecheck` in `web/` — verify: no errors
- [x] 3.3 `openspec validate hints-and-forgot --strict` passes
