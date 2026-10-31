# ui/visual-style Specification

## Purpose

Defines the app's visual language — dark frosted glass on a graphite ground, Montserrat, a white
main action and the sage / sand / clay accents — the launch preloader, and the rule that every
button is reachable with the thumb.

## Requirements

### Requirement: Palette

The app SHALL use a graphite background (#0B0D12), near-white text (#F2F3F5), muted grey for
captions (#868C97), solid near-white (#FAFAF8) with dark text (#0A0B0F) for the main action,
sage (#A8C5A0) for correct answers and positive markers, sand (#D8C18A) for «almost» results
(typo, «Не помню») and warnings, and clay (#D4917A) for wrong answers. No other accent colours
SHALL be used. Telegram's header, background and bottom bar SHALL be painted
graphite.

#### Scenario: Home screen colors

- **WHEN** the learner opens the app
- **THEN** the background is graphite, text is near-white, «Урок» is a solid near-white button and the streak dot is sage

### Requirement: Typography

All text SHALL use Montserrat, which renders Cyrillic and Latin in the same style: weight 500
for the word being learned, 300 for other large numbers and headings, 400–500 for body text and
buttons. Small captions and counters MAY
use a monospace face. No heavy (700+) weights SHALL be used.

#### Scenario: Mixed-script word card

- **WHEN** a new-word card shows «software» and «программное обеспечение»
- **THEN** both lines use Montserrat, the English word in weight 500

### Requirement: Flat controls and shapes

Panels and secondary buttons SHALL be frosted glass: a translucent white fill with background
blur and fine grain. Panels, buttons and tiles SHALL have no outlines, no drop shadows, no glows
and no gradients. The main action SHALL be a solid near-white button. Panels and buttons SHALL
have rounded corners; icon buttons and numbered markers SHALL be circles.

#### Scenario: Main action

- **WHEN** the home screen is shown
- **THEN** «Урок» is a solid near-white rounded button and the settings button is a glass circle, neither with an outline or shadow

### Requirement: Textures

The background SHALL be graphite with fine grain and a faint light at the top of the screen.
Halftone dots, hatching, rays and coloured glows SHALL NOT be used anywhere.

#### Scenario: Exercise screen

- **WHEN** an exercise is shown
- **THEN** the only texture is the grain of the background and of glass panels

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

### Requirement: Answer feedback visuals

The feedback panel SHALL be glass tinted with the result colour and SHALL contain no icon: sage
tint with sage title for «Правильно!» and «Верно, с подсказкой»; sand tint with sand title for
«Почти! Опечатка», «Почти! Были ошибки» and «Запомни»; clay tint with clay title for
«Неправильно». It SHALL show «Ответ: …»
where applicable and the sentence with its translation, the practised word highlighted in the
result colour.

#### Scenario: Forgotten word

- **WHEN** the learner taps «Не помню»
- **THEN** the panel is sand-tinted glass titled «Запомни» in sand

#### Scenario: Wrong answer

- **WHEN** the learner answers wrong
- **THEN** the panel is clay-tinted glass with «Неправильно», «Ответ: …» and the sentence, without an icon

### Requirement: Lesson summary

The summary SHALL be titled «Урок пройден» and SHALL show one rounded cell per answer in lesson
order: sage for correct (including typos and hinted answers), clay for mistakes, followed by
accuracy, number of answers, new words and the streak.

#### Scenario: Summary after 12 answers with 2 mistakes

- **WHEN** a lesson ends with 12 answers, 2 of them wrong
- **THEN** 12 cells are shown, 10 sage and 2 clay, and accuracy reads 83%

### Requirement: Word fits the screen width

The English word or phrase being learned (new-word card, translation choice) SHALL be shown large in
weight 500 and SHALL never overflow the screen: the font size SHALL shrink so that the
longest single word of the phrase fits the content width, phrases SHALL wrap only between words,
and a short word SHALL keep the maximum size.

#### Scenario: Long word

- **WHEN** the word «multiprocessing» is shown on a 360px wide screen
- **THEN** it is on one line, smaller than «deploy», and fully visible

#### Scenario: Phrase

- **WHEN** «object-oriented programming» is shown
- **THEN** it wraps into «object-oriented» and «programming», both fully visible

### Requirement: Streak chip

The home screen SHALL have no header or app title; the streak SHALL be shown as a glass chip at
the right end of the learned-count row («108 из 737 слов») with a filled flame icon and the
number only, without a unit; flame and number SHALL be near-white while the streak is above 0 and muted
grey at 0.

#### Scenario: Streak

- **WHEN** the streak is 12 days
- **THEN** the chip reads «12»

### Requirement: Launch preloader

From the first paint the app SHALL show a full-screen preloader: a slowly flowing muted sage →
sand → clay gradient (still with reduced motion) and one short English fact with its Russian
translation in the centre, taken in turn from a shuffled deck so facts do not repeat until all
were shown. No «Загрузка…» text SHALL be shown. Once the learner's progress is loaded and the
fonts are ready, a solid white «Понятно» button SHALL fade in at the bottom of the screen, in the
action zone. The preloader SHALL stay until the learner presses «Понятно» (or `Enter` on a
keyboard), then fade out and reveal the screen; no timer and no tap elsewhere SHALL close it, and
while it is shown keys SHALL NOT reach the screen underneath. If loading fails, the preloader SHALL
disappear by itself and the error message SHALL be shown.

#### Scenario: Normal launch

- **WHEN** the learner opens the app
- **THEN** the gradient and a fact are visible immediately, «Понятно» appears once progress is loaded, and the home screen appears only after it is pressed

#### Scenario: Keyboard

- **WHEN** «Понятно» is visible and the learner presses `Enter` in Telegram Desktop
- **THEN** the preloader closes and no lesson is started

#### Scenario: Load error

- **WHEN** progress cannot be loaded
- **THEN** the preloader disappears and «Не удалось загрузить прогресс: …» is shown
