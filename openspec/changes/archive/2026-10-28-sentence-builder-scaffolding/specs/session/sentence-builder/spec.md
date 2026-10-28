## Purpose

Defines «Собери предложение»: when the learner assembles a sentence from chunks or from single
words, how each tile is checked, and how the result is graded.

## ADDED Requirements

### Requirement: Tile stages by word familiarity

For a word in long-term review with stability under 7 days, the exercise SHALL be either the
cloze choice or a chunk assembly, with equal probability. A chunk assembly SHALL offer the
sentence's 2–4 chunks in shuffled order and no extra tiles. For stability from 7 up to 21 days
the exercise SHALL be either typing or a word assembly (single words plus 3 extra words from
other sentences), with equal probability. From 21 days on the exercise SHALL be typing.
Translation choice for words not yet in long-term review is unchanged.

#### Scenario: Young word

- **WHEN** a word with stability 3 days gets an assembly exercise for «This software is free for personal use.»
- **THEN** the tiles are «This software», «is free», «for personal use» in random order and nothing else

#### Scenario: Familiar word

- **WHEN** a word with stability 10 days gets an assembly exercise
- **THEN** the tiles are the single words of the sentence plus 3 extra words

### Requirement: Chunk boundaries in content

Every sentence SHALL carry chunk boundaries: the indices of the words (counting space-separated
words of the English sentence from 0) where chunks 2…n start, giving 2–4 chunks, each a natural
phrase (subject group, verb group, object group, prepositional phrase or clause). Sentences of
2–3 words SHALL be split into single words. The practised word form (one or more words) SHALL
lie entirely within one chunk. Tiles SHALL show chunk text without the punctuation
`. , ! ? ; : " ( )`.

#### Scenario: Stored boundaries

- **WHEN** the sentence is «You can disable notifications in the settings.» with boundaries `[1, 4]`
- **THEN** the chunks are «You», «can disable notifications», «in the settings»

### Requirement: Per-tile checking

The learner SHALL place tiles in order. A tile that matches the next part of the sentence
(case-insensitive, punctuation ignored, any of several equal tiles) SHALL be placed; any other
tile SHALL shake, stay in the pool and count as a mistake. After two mistakes for the same
position the correct tile SHALL be highlighted until placed. Placed tiles SHALL NOT be removable.
When the last part is placed, the answer SHALL be submitted without a «Проверить» button.

#### Scenario: Wrong tile

- **WHEN** the next word is «your» and the learner taps «software»
- **THEN** «software» shakes and stays in the pool, and the mistake count becomes 1

#### Scenario: Highlight

- **WHEN** the learner taps two wrong tiles for the same position
- **THEN** the correct tile is highlighted

#### Scenario: Completion

- **WHEN** the learner places the last correct tile
- **THEN** the feedback panel appears immediately

### Requirement: Grading of an assembly

An assembly with no mistakes SHALL be graded `Good` («Правильно!»), with 1–2 mistakes `Hard`
with the panel title «Почти! Были ошибки», with 3 or more mistakes `Again` («Неправильно»).
When a hint was taken, `Good` SHALL become `Hard` («Верно, с подсказкой»); `Again` stays `Again`.
The feedback panel SHALL show the full sentence with its translation.

#### Scenario: Two mistakes

- **WHEN** the learner completes a sentence with 2 wrong taps and no hint
- **THEN** the word is graded `Hard` and the panel reads «Почти! Были ошибки»

#### Scenario: Many mistakes

- **WHEN** the learner completes a sentence with 4 wrong taps
- **THEN** the word is graded `Again` and comes back later in the lesson
