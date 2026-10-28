## 1. Session logic

- [x] 1.1 `session.tsx`: `missed` (unique word ids with a mistake) and `comebacks` per word; requeue only while `comebacks < 2` — verify in dev: tapping «Не помню» on the same word three times ends with the word not coming back a third time and the lesson reaching the summary
- [x] 1.2 `session.tsx`: final round = shuffled unique `introduced ∪ missed` — verify in dev: a review word answered wrong and then right appears once more after the planned items; a new word with a mistake appears there only once
- [x] 1.3 `session.tsx`: optional `items` prop used instead of `buildLesson` — verify: `npm run typecheck`

## 2. Summary & navigation

- [x] 2.1 `session-summary.tsx`: «Повторить ошибки» (primary, own row) when accuracy < 70% and there are missed words; otherwise the current actions — verify at 320px: both layouts fit
- [x] 2.2 `App.tsx`: `mistakeItems` state, `onRepeatMistakes` starts a lesson of missed words, «Ещё урок» resets it — verify in dev: «Повторить ошибки» starts a lesson containing exactly the missed words, its summary counts as a lesson

## 3. Docs & verification

- [x] 3.1 Update `.ai/guidelines/modules/session.md` (final round, comeback limit, «Повторить ошибки») and the session line in CLAUDE.md
- [x] 3.2 Run `npm run lint && npm run typecheck` in `web/` — verify: no errors
- [x] 3.3 `openspec validate mistakes-review --strict` passes
