## MODIFIED Requirements

### Requirement: Every button in the thumb zone

Every button of every screen SHALL be placed in the bottom action zone, including answer options
and settings actions. The only exceptions are the close button shown outside Telegram and the
interface language switch at the top of settings. The action
zone SHALL float over the scrollable content on a soft gradient darkening of the background, so
the buttons stand out from the content scrolling under them.

#### Scenario: Choice exercise

- **WHEN** «Выбери перевод» is shown
- **THEN** the four options are numbered rows at the bottom of the screen and one tap answers

#### Scenario: Settings

- **WHEN** settings are open
- **THEN** «Скопировать прогресс», «Восстановить», «Пройти заново» and «Готово» are all in the bottom zone, and only the «RU» / «EN» switch is at the top

#### Scenario: Content longer than the screen

- **WHEN** the content does not fit above the action zone
- **THEN** it scrolls under the buttons and is darkened by the gradient behind them
