## MODIFIED Requirements

### Requirement: Launch preloader

From the first paint until the learner's progress is loaded and the Montserrat font is ready, and
at least 2.5 s after launch, the app SHALL show only a preloader: a full-screen background whose
sage → sand → clay gradient, dimmed over graphite, slowly flows, and centred on it one short fact —
the English sentence and its Russian translation under it, in muted text. There SHALL be no bar,
logo or glow; with reduced motion enabled the gradient SHALL stay still. This is the only place in
the app where a gradient is allowed. Facts SHALL be shown in a shuffled order so that a fact
repeats only after all facts were shown. A tap on the preloader after progress is loaded SHALL
close it without waiting for the 2.5 s. The preloader SHALL then fade out and reveal the screen; no
intermediate «Загрузка…» text SHALL be shown. If loading fails, the preloader SHALL disappear and
the error message SHALL be shown.

#### Scenario: Normal launch

- **WHEN** the learner opens the app
- **THEN** the flowing background with a fact is visible immediately and the home screen appears after it fades out, already in Montserrat

#### Scenario: No repeats

- **WHEN** there are 150 facts and the learner opens the app 150 times
- **THEN** every fact is shown exactly once

#### Scenario: Tap to skip

- **WHEN** progress is loaded 0.8 s after launch and the learner taps the preloader
- **THEN** the preloader fades out without waiting for 2.5 s

#### Scenario: Load error

- **WHEN** progress cannot be loaded
- **THEN** the preloader disappears and «Не удалось загрузить прогресс: …» is shown
