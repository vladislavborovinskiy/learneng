## MODIFIED Requirements

### Requirement: Review items per lesson

A lesson SHALL include up to 8 review items. Due words SHALL be taken first, ordered by the
number of times the word was forgotten after being learned (the card's lapse count, already
stored with every card) from most to least, and among equal lapse counts most overdue first.
When fewer than 8 words are due, the remaining slots SHALL be filled with learned words that are
not due, lowest predicted recall probability first. A word SHALL appear as a review item at most
once per lesson (repeats after a wrong answer are not counted).

#### Scenario: Enough due words

- **WHEN** 12 words are due and none of them was ever forgotten
- **THEN** the lesson contains the 8 most overdue of them and no top-up words

#### Scenario: Troublesome words first

- **WHEN** 12 words are due and 2 of them were forgotten 3 times each
- **THEN** the lesson contains those 2 words and the 6 most overdue of the rest

#### Scenario: Few due words

- **WHEN** 3 words are due and 50 words have been learned
- **THEN** the lesson contains the 3 due words and 5 learned non-due words with the lowest predicted recall

#### Scenario: Fresh learner

- **WHEN** no word has been studied yet
- **THEN** the lesson contains only new words

### Requirement: Review answers update the schedule

Every answered review item, including top-up words that were not due, SHALL be recorded as a
spaced-repetition review: correct → Good, typo → Hard, correct or typo after a hint → Hard,
wrong → Again, «Не помню» → Again.

#### Scenario: Top-up word answered correctly

- **WHEN** a learned non-due word is answered correctly in a lesson
- **THEN** its next review date is recalculated from this review

#### Scenario: Forgotten review word

- **WHEN** the learner taps «Не помню» on a learned word
- **THEN** the word is recorded as Again, its lapse count grows and it becomes due within minutes
