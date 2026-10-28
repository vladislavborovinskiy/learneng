# session/keyboard Specification

## Purpose

Defines keyboard control of lessons for desktop use (Telegram Desktop or a browser): which keys
do what in each exercise state, how tiles are picked from the keyboard, and when key labels are
shown.

## Requirements

### Requirement: Main action on Enter

`Enter` SHALL trigger exactly once the main action of the current lesson state: «Дальше» on the
new-word card, «Проверить» in typing (only when something is typed), «Дальше» on the feedback
panel, and the primary button on the lesson summary («Повторить ошибки» when shown, otherwise
«Ещё урок»). A held key (auto-repeat) SHALL NOT trigger it again.

#### Scenario: Continue after feedback

- **WHEN** the feedback panel is shown and the learner presses `Enter`
- **THEN** the next item opens, and holding `Enter` does not skip further items

#### Scenario: Typing

- **WHEN** the learner types an answer and presses `Enter`
- **THEN** the answer is checked once

### Requirement: Answer options by number

In translation and cloze choice, keys `1`–`4` (top row or numpad, independent of the keyboard
layout) SHALL pick the option with that number.

#### Scenario: Pick option

- **WHEN** «Как переводится?» is shown and the learner presses `3`
- **THEN** option 3 is chosen and the feedback panel appears

### Requirement: «Не помню» and hint keys

`Shift+Enter` SHALL trigger «Не помню» in every exercise. `Tab` SHALL trigger the hint in typing
and tiles while the hint button is shown; otherwise `Tab` SHALL do nothing.

#### Scenario: Forgot from the keyboard

- **WHEN** a typing exercise is shown and the learner presses `Shift+Enter`
- **THEN** the panel «Запомни» appears

#### Scenario: Hint in typing

- **WHEN** the learner presses `Tab` in a typing exercise with the hint available
- **THEN** one more letter is revealed and focus stays in the input

### Requirement: Picking tiles by typing

In tiles, typed letters SHALL form a search text (shown above the tile pool); the first unused
tile whose text starts with it (case-insensitive) SHALL be highlighted, and `Space` SHALL place
the highlighted tile with the same checking as a tap, then clear the search text. `Backspace`
SHALL delete the last typed letter. With no matching tile nothing SHALL be highlighted and
`Space` SHALL do nothing.

#### Scenario: Place by typing

- **WHEN** the pool has «the old package» and «from the project» and the learner types «fr» and presses `Space`
- **THEN** «from the project» is tapped (placed if it is the next part, otherwise it shakes and counts as a mistake)

### Requirement: Esc as back

Wherever the Telegram back button is shown (lesson, level test, settings, backup view), `Esc`
SHALL do the same as the back button.

#### Scenario: Leave lesson

- **WHEN** the learner presses `Esc` during a lesson
- **THEN** the lesson is left as with the back button and answers already given are kept

### Requirement: Key labels on desktop

On devices whose primary pointer is precise (mouse/trackpad), buttons with shortcuts SHALL show a
small key label («Enter», «⇧Enter», «Tab», «Space»); on touch devices labels SHALL NOT be shown.
Choice options keep their number circles as the label.

#### Scenario: Phone

- **WHEN** the app is opened on a phone
- **THEN** no key labels are visible
