## Purpose

Defines the app's visual language — a dark, print-inspired style with paper colors and one
orange accent — and the rule that every button is reachable with the thumb.

## ADDED Requirements

### Requirement: Palette

The app SHALL use a dark warm ink background (#1A1815), paper color (#EDE1C7) for text, lines
and outlined controls, one orange accent (#EE6A2E) for the main action, progress and positive
feedback, and a muted paper tone (#A39882) for captions. Telegram's header, background and
bottom bar SHALL be painted with the ink color.

#### Scenario: Home screen colors

- **WHEN** the learner opens the app
- **THEN** the background is ink, text and outlines are paper, and only the main action, the due counter and progress fills are orange

### Requirement: Typography

Headings, large numbers and body text SHALL use one heavy rounded grotesk that renders Cyrillic
and Latin in the same style; small captions SHALL use a monospace face. No pixel font SHALL be
used.

#### Scenario: Mixed-script word card

- **WHEN** a new-word card shows «software» and «программное обеспечение»
- **THEN** both lines use the same typeface family

### Requirement: Flat controls and shapes

Buttons SHALL be flat — either filled or outlined — without shadows or pressed-in depth.
Panels and text buttons SHALL have sharp corners; icon buttons and numbered markers SHALL be
circles; screen labels SHALL be outlined tags with rounded corners.

#### Scenario: Main action

- **WHEN** the home screen is shown
- **THEN** «Урок» is a flat orange rectangle and the settings button is an outlined circle

### Requirement: Textures

Halftone dots, hatching and orange rays SHALL be used as accents, at most one texture per
screen besides progress bar fills.

#### Scenario: Exercise screen

- **WHEN** an exercise is shown without feedback
- **THEN** no texture is used except the hatched progress fill

### Requirement: Every button in the thumb zone

Every button of every screen SHALL be placed in the bottom action zone, including answer options
and settings actions. The only exception is the close button shown outside Telegram.

#### Scenario: Choice exercise

- **WHEN** «Выбери перевод» is shown
- **THEN** the four options are numbered rows at the bottom of the screen and one tap answers

#### Scenario: Settings

- **WHEN** settings are open
- **THEN** «Скопировать прогресс», «Восстановить», «Пройти заново» and «Готово» are all in the bottom zone

### Requirement: Answer feedback visuals

A correct answer SHALL show orange rays with the label «Правильно!», a typo «Почти! Опечатка»
with the same rays, and a wrong answer paper hatching with the inverted label «Неправильно» and
the correct answer. All variants SHALL show the sentence with its translation.

#### Scenario: Wrong answer

- **WHEN** the learner answers wrong
- **THEN** the panel is hatched, shows «Неправильно», «Ответ: …» and the sentence

### Requirement: Lesson summary

The summary SHALL be titled «Урок пройден» and SHALL show one cell per answer in lesson order:
filled orange for correct (including typos), hatched for wrong, followed by accuracy, number of
answers, new words and the streak.

#### Scenario: Summary after 12 answers with 2 mistakes

- **WHEN** a lesson ends with 12 answers, 2 of them wrong
- **THEN** 12 cells are shown, 10 filled and 2 hatched, and accuracy reads 83%
