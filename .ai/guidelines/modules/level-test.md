# Level Test Module — Business Context

## What this module is for

A quick yes/no vocabulary test that estimates how many of the most frequent English words the
learner knows and removes already known words from the new-word queue, so a non-beginner does
not start from «the». Code: `web/src/screens/level-test.tsx`, data in
`content/level_test.json`.

## Glossary

- **Item** — a real word `{ en, rank }` or a pseudo-word (`rank: null`); 115 items, shuffled.
- **Band** — a rank range from `bands` (1–500, 501–1000, 1001–1500, 1501–2000, 2001–2809).
- **False-alarm rate** — share of pseudo-words answered «Знаю».
- **Band score** — hit rate corrected for guessing: `(hit − fa) / (1 − fa)`, clamped at 0.
- **Estimate** — Σ band score × band size, shown as «≈ N слов из 2809 самых частых ты знаешь».

## Key flows

1. «Знаешь это слово?» → «Знаю» / «Не знаю» for every item.
2. Result: estimate and per-band percentages.
3. **Reliable** (false alarms ≤ 1/3, i.e. ≤ 5 of 15) → «Сохранить»: marks known every test word
   present in the deck, and if band 1–500 scores ≥ 85% — **all NGSL words with rank ≤ 500** as
   `Easy`; sets `levelTestDone`.
4. **Unreliable** → red explanation, «Пройти позже»; nothing is saved and `levelTestDone` stays
   false.
5. Started from home («Тест», until done) or settings («Пройти заново»).

## Non-obvious invariants / gotchas

- Retaking only adds known words: `markKnown` skips words that already have a card.
- Exiting midway saves nothing.
- Only 24 test words exist in the deck, so the band-1 rule is what actually shortens the queue.

## Where to look next

- `markKnown` and storage — `progress.md`; test data — `content.md`.
