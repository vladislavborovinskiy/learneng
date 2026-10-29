# session/lesson-flow Specification

## Purpose

Defines the order of items inside a lesson, how a lesson ends and what the learner can do on
the lesson summary.

## Requirements

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
and every word that had at least one mistake (wrong or «Не помню») in this lesson SHALL be asked
once more, each word once, in random order. Mistakes made in the final round itself SHALL NOT
add further final-round items.

#### Scenario: Final round

- **WHEN** the learner introduced 3 new words and skipped none
- **THEN** after the planned items all 3 words are asked once more

#### Scenario: Missed review word

- **WHEN** a review word was answered wrong, then right when it came back
- **THEN** it is asked once more in the final round

#### Scenario: New word with a mistake

- **WHEN** a new word was introduced and later answered wrong
- **THEN** it appears in the final round only once

### Requirement: Wrong answers come back

A wrongly answered item, or an item answered with «Не помню», SHALL be asked again 4 positions
later in the same lesson, at most 2 times per word per lesson. After a word has come back twice,
further mistakes on it SHALL NOT add it back.

#### Scenario: Wrong answer

- **WHEN** the learner answers an item wrong
- **THEN** the same word is asked again 4 items later

#### Scenario: Forgotten word

- **WHEN** the learner taps «Не помню»
- **THEN** the same word is asked again 4 items later

#### Scenario: Comeback limit

- **WHEN** the learner taps «Не помню» on the same word for the third time in a lesson
- **THEN** the word is not added back, and the lesson reaches its summary after the remaining items

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
current progress, and «На главную». When accuracy is below 70% and at least one word had a
mistake, the summary SHALL also offer «Повторить ошибки» as the main action: it starts a lesson
made only of the words that had a mistake, each once, with exercises built from the current
progress and no new words. That lesson SHALL follow the same final-round, comeback and summary
rules and SHALL count as a completed lesson.

#### Scenario: Another lesson

- **WHEN** the learner taps «Ещё урок»
- **THEN** a new lesson starts, and words learned in the previous lesson may appear in it as review items

#### Scenario: Many mistakes

- **WHEN** a lesson ends with 60% accuracy and mistakes on 4 words
- **THEN** the summary shows «Повторить ошибки», and tapping it starts a lesson of those 4 words

#### Scenario: Good lesson

- **WHEN** a lesson ends with 85% accuracy
- **THEN** «Повторить ошибки» is not shown

### Requirement: Lesson progress bar never goes back

The lesson progress bar SHALL show completed steps out of the planned length: the queue plus the
final round of new words and missed words, counted from the start of the lesson. The bar SHALL
NOT decrease: when a mistake puts a word back into the queue it SHALL stay where it is until the
learner catches up.

#### Scenario: Mistake

- **WHEN** the learner answers wrong and the word returns to the queue
- **THEN** the bar does not move back

#### Scenario: Final round

- **WHEN** the main queue ends and the final round of new words starts
- **THEN** the bar keeps moving forward without a jump back
