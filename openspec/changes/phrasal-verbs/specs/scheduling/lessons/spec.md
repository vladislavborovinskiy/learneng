## MODIFIED Requirements

### Requirement: New words per lesson

A lesson SHALL include up to N unseen items, where N depends on the number of due items at the
moment the lesson is built: fewer than 12 due → 3, 12–23 → 2, 24–47 → 1, 48 or more → 0. With 3
slots the lesson SHALL take 2 IT words (in dictionary order) and 1 item from the shared slot; with
2 slots 1 IT word and 1 shared-slot item; with 1 slot 1 IT word. The shared slot SHALL take the
next unseen item (by frequency) from whichever of NGSL and the phrase set has the smaller share of
started items (items with a card divided by the size of the set); on a tie it SHALL take NGSL.
When one source runs out, the others SHALL fill the free slots. A lesson SHALL include fewer than
N new items only when fewer unseen items remain.

#### Scenario: Regular lesson

- **WHEN** 5 items are due, 30% of NGSL words and 10% of phrases are started
- **THEN** the lesson contains the next 2 unseen IT words and the most frequent unseen phrase

#### Scenario: Phrases caught up

- **WHEN** 5 items are due, 30% of NGSL words and 35% of phrases are started
- **THEN** the lesson contains the next 2 unseen IT words and the most frequent unseen NGSL word

#### Scenario: Growing backlog

- **WHEN** 15 items are due and phrases have the smaller started share
- **THEN** the lesson contains the next unseen IT word and the most frequent unseen phrase

#### Scenario: Large backlog

- **WHEN** 30 items are due
- **THEN** the lesson contains the next unseen IT word and the 8 most overdue review items

#### Scenario: New words paused

- **WHEN** 50 items are due
- **THEN** the lesson contains no new items and the 8 most overdue review items

#### Scenario: NGSL words known from the level test

- **WHEN** every NGSL word is already known, IT words and phrases remain unseen and 5 items are due
- **THEN** the lesson contains the next 2 unseen IT words and the most frequent unseen phrase

#### Scenario: Deck almost exhausted

- **WHEN** only 1 unseen item remains
- **THEN** the lesson contains that 1 new item
