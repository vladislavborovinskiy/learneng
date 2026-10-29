# session/hints Specification

## Purpose

Defines how the learner gets help during an exercise — letter and tile hints, and «Не помню» — and how each affects grading and feedback.

## Requirements

### Requirement: Empty typing input

In a typing exercise the input SHALL start empty, without any revealed letters, and SHALL grow
with the typed text so the answer is always fully visible. «Проверить» SHALL be disabled until at
least one character is typed.

#### Scenario: No letters revealed

- **WHEN** the expected answer is «Software» and no hint was taken
- **THEN** the input is empty and the learner types the whole word

### Requirement: Letter hint in typing

A typing exercise SHALL offer a hint button that reveals the next letter of the answer by
extending a fixed prefix that the learner cannot delete or edit (spaces inside the answer are
revealed together with the following letter). The answer checked SHALL be the prefix followed by
what the learner typed. Hints SHALL stop when half of the answer's letters (rounded down, at least
one letter) are revealed; the hint button SHALL then be hidden. Text already typed after the
prefix SHALL be cleared when a hint is taken.

#### Scenario: Taking a hint

- **WHEN** the answer is «deploy», no hint was taken and the learner taps the hint button twice
- **THEN** the prefix is «de»

#### Scenario: Hint limit

- **WHEN** the answer is «deploy» and the prefix is «dep»
- **THEN** the hint button is not shown

### Requirement: Tile hint

An assembly exercise SHALL offer a hint button that places the next correct tile. The hint
button SHALL be hidden when only one tile is left to place. A hint SHALL NOT count as a mistake.

#### Scenario: Hint

- **WHEN** the sentence is «Update your software» and the learner placed «Update»
- **THEN** after the hint the placed tiles are «Update your»

#### Scenario: Hint after a wrong tile

- **WHEN** the sentence is «Update your software», the learner placed «Update» and then tapped the wrong tile «software»
- **THEN** «software» stays in the pool and after the hint the placed tiles are «Update your»

#### Scenario: Last tile

- **WHEN** one tile is left to place
- **THEN** the hint button is not shown

### Requirement: Hinted answers are graded Hard at best

An answer given after at least one hint SHALL be graded `Hard` when it is correct or a typo,
and `Again` when it is wrong. The feedback panel SHALL read «Верно, с подсказкой» for a correct
or typo hinted answer and show the full answer. The lesson summary SHALL count a hinted answer
as correct.

#### Scenario: Correct after a hint

- **WHEN** the learner took a letter hint and then typed the answer correctly
- **THEN** the word is graded `Hard` and the panel reads «Верно, с подсказкой»

### Requirement: «Не помню»

Every exercise (translation choice, cloze, tiles, typing) SHALL offer «Не помню» in the action
zone while it is unanswered. Tapping it SHALL grade the word `Again`, show the feedback panel
titled «Запомни» with the English word, its Russian translations and the exercise sentence with
its translation, and put the word back into the lesson like a wrong answer. The summary SHALL
count it as a mistake. The new-word card SHALL NOT offer «Не помню».

#### Scenario: Forgotten in a choice exercise

- **WHEN** the learner taps «Не помню» on «Как переводится?» for «deploy»
- **THEN** «deploy» is graded `Again`, the panel «Запомни» shows «deploy — развернуть…» with the sentence, and «Дальше» continues the lesson

#### Scenario: Summary

- **WHEN** a lesson had 10 answers, one of them «Не помню»
- **THEN** the summary shows 90% accuracy and that answer as a mistake cell
