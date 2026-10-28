## MODIFIED Requirements

### Requirement: Main action

The home screen SHALL offer one main action «Урок» that starts a lesson, regardless of the
number of due words. The «Ещё 5 слов» and «Повторение» actions SHALL NOT exist.

#### Scenario: Normal day

- **WHEN** 5 words are due
- **THEN** the main action reads «Урок» and starts a lesson

#### Scenario: Backlog

- **WHEN** 30 words are due
- **THEN** the main action still reads «Урок»

#### Scenario: Everything learned and nothing due

- **WHEN** no unseen words remain
- **THEN** the main action still starts a lesson made of review items

### Requirement: Today's counters

The home screen SHALL show the number of new words learned today labelled «выучено сегодня» and
the number of lessons completed today labelled «уроков сегодня». It SHALL NOT show a due-words
counter.

#### Scenario: After two lessons

- **WHEN** the learner completed 2 lessons today with 6 new words in total
- **THEN** home shows 6 under «выучено сегодня» and 2 under «уроков сегодня»

#### Scenario: New day

- **WHEN** the learner opens the app on a day without activity
- **THEN** «выучено сегодня» and «уроков сегодня» show 0

### Requirement: Backlog hint

When 48 or more words are due, the home screen SHALL explain that new words are paused until the
reviews are done.

#### Scenario: Backlog hint shown

- **WHEN** 50 words are due
- **THEN** home shows the hint «Накопилось 50 повторений — новые слова вернутся, когда их станет меньше 48»

#### Scenario: No hint during taper

- **WHEN** 30 words are due
- **THEN** no hint is shown

## ADDED Requirements

### Requirement: Goal progress and forecast

The home screen SHALL show, as its main block, «Выучено X из Y» (X = words in long-term review,
Y = all words) with a progress bar and the number of words not started yet («ещё не начато: N»).
It SHALL show a forecast based on the pace of the last 14 local days, where pace = new words
started in those days (stored per day as `meta.days[YYYY-MM-DD].learned`) divided by 14: «при
темпе ~P в день — до D», where P is the pace rounded to one decimal in Russian notation without a trailing zero
(«5», «4,5») and D is today plus
⌈N / pace⌉ days, formatted as day and month in Russian (e.g. «15 января»). When the pace is 0
the forecast SHALL read «начни урок, чтобы увидеть прогноз». When no words remain unstarted the
forecast SHALL NOT be shown.

#### Scenario: Forecast

- **WHEN** 70 new words were started in the last 14 days, 400 words are not started and today is 28 October
- **THEN** home shows «при темпе ~5 в день — до 16 января»

#### Scenario: No pace yet

- **WHEN** no new words were started in the last 14 days
- **THEN** home shows «начни урок, чтобы увидеть прогноз»
