## MODIFIED Requirements

### Requirement: Lessons are unlimited

The system SHALL let the learner start a new lesson at any time, any number of times per day.
There SHALL be no daily limit on new words.

#### Scenario: Many lessons in one day

- **WHEN** the learner has already completed several lessons today and starts another one
- **THEN** a lesson is built with as many new words as the taper allows for the current due count

### Requirement: New words per lesson

A lesson SHALL include up to N unseen words, where N depends on the number of due words at the
moment the lesson is built: fewer than 12 due → 3, 12–23 → 2, 24–47 → 1, 48 or more → 0. With 3
slots the lesson SHALL take 2 IT words (in dictionary order) and 1 NGSL word (by frequency rank);
with 2 slots 1 IT and 1 NGSL word; with 1 slot 1 IT word. When one source runs out, the other
SHALL fill the free slots. A lesson SHALL include fewer than N new words only when fewer unseen
words remain.

#### Scenario: Regular lesson

- **WHEN** 5 words are due and 100 words are unseen
- **THEN** the lesson contains the next 2 unseen IT words and the most frequent unseen NGSL word

#### Scenario: Growing backlog

- **WHEN** 15 words are due
- **THEN** the lesson contains the next unseen IT word and the most frequent unseen NGSL word

#### Scenario: Large backlog

- **WHEN** 30 words are due
- **THEN** the lesson contains the next unseen IT word and the 8 most overdue review items

#### Scenario: New words paused

- **WHEN** 50 words are due
- **THEN** the lesson contains no new words and the 8 most overdue review items

#### Scenario: NGSL words known from the level test

- **WHEN** every NGSL word is already known, IT words remain unseen and 5 words are due
- **THEN** the lesson contains the next 3 unseen IT words

#### Scenario: Deck almost exhausted

- **WHEN** only 1 unseen word remains
- **THEN** the lesson contains that 1 new word

## REMOVED Requirements

### Requirement: Backlog lesson

**Reason**: replaced by the gradual new-words taper; there is no separate «Повторение» lesson.

**Migration**: none — no stored data depends on it; lessons with 24+ due words now include one
new word until 48 due words.
