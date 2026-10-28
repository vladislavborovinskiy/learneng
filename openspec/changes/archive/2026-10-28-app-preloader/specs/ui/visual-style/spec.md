## ADDED Requirements

### Requirement: Launch preloader

From the first paint until the learner's progress is loaded and the Montserrat font is ready
(and at least 0.4 s after launch), the app SHALL show only a preloader: the graphite background
and a thin rounded bar in the centre whose sage → sand → clay gradient slowly flows. It SHALL
contain no text, logo or glow, and with reduced motion enabled the gradient SHALL stay still. The
preloader SHALL then fade out and reveal the screen; no intermediate «Загрузка…» text SHALL be
shown. If loading fails, the preloader SHALL disappear and the error message SHALL be shown.

#### Scenario: Normal launch

- **WHEN** the learner opens the app
- **THEN** the preloader bar is visible immediately and the home screen appears after it fades out, already in Montserrat

#### Scenario: Load error

- **WHEN** progress cannot be loaded
- **THEN** the preloader disappears and «Не удалось загрузить прогресс: …» is shown
