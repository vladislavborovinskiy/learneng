## Purpose

Defines what the home screen shows about today's learning and which main action it offers in
the lesson-based model.

## ADDED Requirements

### Requirement: Main action

The home screen SHALL offer one main action that starts a lesson. Its label SHALL be «Урок», or
«Повторение» when 24 or more words are due. The «Ещё 5 слов» action SHALL NOT exist.

#### Scenario: Normal day

- **WHEN** fewer than 24 words are due
- **THEN** the main action reads «Урок» and starts a lesson

#### Scenario: Backlog

- **WHEN** 24 or more words are due
- **THEN** the main action reads «Повторение» and starts a lesson without new words

#### Scenario: Everything learned and nothing due

- **WHEN** no unseen words remain
- **THEN** the main action still starts a lesson made of review items

### Requirement: Today's counters

The home screen SHALL show the number of due words labelled «повторить» and the number of new
words learned today labelled «выучено сегодня», and SHALL show how many lessons were completed
today.

#### Scenario: After two lessons

- **WHEN** the learner completed 2 lessons today with 6 new words in total
- **THEN** home shows 6 under «выучено сегодня» and 2 completed lessons

#### Scenario: New day

- **WHEN** the learner opens the app on a day without activity
- **THEN** «выучено сегодня» and the lesson count show 0

### Requirement: Backlog hint

When 24 or more words are due, the home screen SHALL explain that new words are paused until
the reviews are done.

#### Scenario: Backlog hint shown

- **WHEN** 30 words are due
- **THEN** home shows the hint «Накопилось 30 повторений — новые слова вернутся, когда их станет меньше 24»
