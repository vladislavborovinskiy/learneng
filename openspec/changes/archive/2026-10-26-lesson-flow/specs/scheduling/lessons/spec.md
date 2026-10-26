## Purpose

Defines what a single lesson contains — new words, due reviews and top-up reviews of learned
words — and that the learner may take any number of lessons per day.

## ADDED Requirements

### Requirement: Lessons are unlimited

The system SHALL let the learner start a new lesson at any time, any number of times per day.
There SHALL be no daily limit on new words.

#### Scenario: Many lessons in one day

- **WHEN** the learner has already completed several lessons today and starts another one
- **THEN** a lesson is built with new words if unseen words remain and the backlog rule does not apply

### Requirement: New words per lesson

A lesson SHALL include up to 3 unseen words: 2 IT words (in dictionary order) and 1 NGSL word
(by frequency rank). When one source runs out, the other SHALL fill the free slots. A lesson
SHALL include fewer new words only when fewer unseen words remain or the backlog rule applies.

#### Scenario: Regular lesson

- **WHEN** 5 words are due and 100 words are unseen
- **THEN** the lesson contains the next 2 unseen IT words and the most frequent unseen NGSL word

#### Scenario: NGSL words known from the level test

- **WHEN** every NGSL word is already known and IT words remain unseen
- **THEN** the lesson contains the next 3 unseen IT words

#### Scenario: Deck almost exhausted

- **WHEN** only 1 unseen word remains
- **THEN** the lesson contains that 1 new word

### Requirement: Review items per lesson

A lesson SHALL include up to 8 review items. Due words SHALL be taken first, most overdue
first. When fewer than 8 words are due, the remaining slots SHALL be filled with learned words
that are not due, lowest predicted recall probability first. A word SHALL appear as a review
item at most once per lesson (repeats after a wrong answer are not counted).

#### Scenario: Enough due words

- **WHEN** 12 words are due
- **THEN** the lesson contains the 8 most overdue of them and no top-up words

#### Scenario: Few due words

- **WHEN** 3 words are due and 50 words have been learned
- **THEN** the lesson contains the 3 due words and 5 learned non-due words with the lowest predicted recall

#### Scenario: Fresh learner

- **WHEN** no word has been studied yet
- **THEN** the lesson contains only new words

### Requirement: Backlog lesson

When 24 or more words are due, a lesson SHALL contain no new words and SHALL be presented as
«Повторение».

#### Scenario: Large backlog

- **WHEN** 30 words are due
- **THEN** the lesson contains the 8 most overdue words and no new words

#### Scenario: Backlog cleared

- **WHEN** the due count drops below 24
- **THEN** the next lesson includes new words again

### Requirement: Review answers update the schedule

Every answered review item, including top-up words that were not due, SHALL be recorded as a
spaced-repetition review with the same grading as today (correct → Good, typo → Hard,
wrong → Again).

#### Scenario: Top-up word answered correctly

- **WHEN** a learned non-due word is answered correctly in a lesson
- **THEN** its next review date is recalculated from this review
