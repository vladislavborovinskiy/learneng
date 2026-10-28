## MODIFIED Requirements

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
