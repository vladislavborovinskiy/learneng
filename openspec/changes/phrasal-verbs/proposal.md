## Why

Technical documentation is full of phrasal verbs and fixed expressions — «set up», «roll back»,
«fall back», «out of the box», «under the hood» — whose meaning cannot be guessed from the single
words the learner already knows. The deck has only one such item («from scratch»), so reading
still stalls on them. This is step 1 of the content roadmap and sets up how further sets (error
messages, word families) join the deck.

## What Changes

- A new set «фразы» of about 120 items: ~80 phrasal verbs and ~40 fixed expressions frequent in
  technical documentation, ordered by frequency in a corpus of real docs (MDN, React, GitHub
  Docs). Each item has six sentences like any word.
- Phrasal verbs that can be split («set it up») get 1–2 split sentences out of six. Split
  sentences are used for translation choice and sentence assembly, never for the blank or typing
  exercises; the feedback highlights both parts.
- Answer options for a phrase are other phrases from the same set.
- New words per lesson: IT keeps its slots; the slot that was always NGSL goes to whichever of
  NGSL and phrases has the smaller share of started items. The 3/2/1/0 taper is unchanged.
- Home: the main number counts all items («из 857 слов» with the full set) and a line under the
  bar shows the split «слова N · фразы M». Hard words, chart and tiles include phrases as is.
- The level test does not cover phrases.

## Capabilities

### New Capabilities

- `content/phrasal-verbs`: the phrase set — composition, ordering, sentence rules including split
  forms.

### Modified Capabilities

- `scheduling/lessons`: new-word slots share the NGSL slot with phrases by started share.
- `scheduling/home`: total over all sets and the per-set line under the bar.
- `session/sentence-builder`: split sentences — which exercises use them and how chunks and
  feedback treat them.

## Impact

- Content: `content/words.json` grows by ~120 items with a new source; `scripts/check-content.mjs`
  learns the split-sentence rules; corpus and candidate lists in `content/draft/` (not shipped).
- Code: word types and set queues, new-word selection, exercise building and distractors,
  feedback highlighting, home main block, interface strings (RU and EN).
- Stored data: none new — phrases are cards keyed by id like words; existing progress is untouched.
- Bundle: `words.json` grows by roughly 16%.
- Module guidelines: `.ai/guidelines/modules/content.md`, `scheduling.md`, `session.md`.

## Non-goals

- Two-gap blank or typing for split forms.
- Error messages, word families, grammar and reading (later roadmap steps).
- Phrases in the level test.
- Moving the existing IT multi-word terms («source code», «from scratch») into the new set.
