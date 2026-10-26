## Purpose

Defines the order of items inside a lesson, how a lesson ends and what the learner can do on
the lesson summary.

## ADDED Requirements

### Requirement: Interleaved order

A lesson SHALL start with up to 2 review items as a warm-up. Each new word SHALL be shown as a
new-word card immediately followed by an exercise on that word, and the remaining review items
SHALL be spread evenly between and after the new words. A lesson without new words SHALL
consist of its review items in order.

#### Scenario: Regular lesson

- **WHEN** a lesson has 3 new words and 8 review items
- **THEN** the learner sees 2 reviews, then new word 1 with its exercise, then reviews, new word 2, reviews, new word 3, then the remaining reviews

#### Scenario: Review-only lesson

- **WHEN** a lesson has no new words
- **THEN** the learner sees only review exercises

### Requirement: Final round over new words

After the last planned item, every new word introduced in this lesson (not skipped with «Знаю»)
SHALL be asked once more, in random order.

#### Scenario: Final round

- **WHEN** the learner introduced 3 new words and skipped none
- **THEN** after the planned items all 3 words are asked once more

### Requirement: Wrong answers come back

A wrongly answered item SHALL be asked again 4 positions later in the same lesson.

#### Scenario: Wrong answer

- **WHEN** the learner answers an item wrong
- **THEN** the same word is asked again 4 items later

### Requirement: Lesson completion

A lesson SHALL count as completed when its summary is shown; the day's completed-lesson count
SHALL then increase by one. Leaving a lesson early SHALL NOT count it, but answers already given
SHALL stay recorded.

#### Scenario: Completed lesson

- **WHEN** the learner reaches the summary
- **THEN** today's completed lessons increase by 1

#### Scenario: Leaving early

- **WHEN** the learner leaves via the back button after 5 answers
- **THEN** the completed-lesson count does not change and the 5 answers are kept

### Requirement: Summary actions

The lesson summary SHALL offer «Ещё урок», which immediately starts a new lesson built from the
current progress, and «На главную».

#### Scenario: Another lesson

- **WHEN** the learner taps «Ещё урок»
- **THEN** a new lesson starts, and words learned in the previous lesson may appear in it as review items
