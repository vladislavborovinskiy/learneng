## MODIFIED Requirements

### Requirement: Today's counters

The home screen SHALL show the number of new words started today as «сегодня +N». It SHALL NOT
show a due-words counter, a lessons-today counter or per-source progress bars.

#### Scenario: After two lessons

- **WHEN** the learner started 6 new words today
- **THEN** home shows «сегодня +6» and no lesson count

#### Scenario: New day

- **WHEN** the learner opens the app on a day without activity
- **THEN** home shows «сегодня +0»

### Requirement: Backlog hint

When 48 or more words are due, the home screen SHALL show the one-line hint «Новые слова на
паузе — сначала повторения».

#### Scenario: Backlog hint shown

- **WHEN** 50 words are due
- **THEN** home shows «Новые слова на паузе — сначала повторения»

#### Scenario: No hint during taper

- **WHEN** 30 words are due
- **THEN** no hint is shown

### Requirement: Goal progress and forecast

The home screen SHALL show, as its main block, the number of words in long-term review as one
large number followed by «из Y слов» (Y = all words) and a thin progress bar. It SHALL NOT show
a «Выучено» label, the number of unstarted words or explanatory paragraphs. Next to «сегодня +N»
it SHALL show «финиш · M YYYY», where the date is today plus ⌈unstarted / pace⌉ days, pace = new
words started in the last 14 local days (stored per day as `meta.days[YYYY-MM-DD].learned`)
divided by 14, and M is the short Russian month («янв», «фев», «мар», «апр», «май», «июн»,
«июл», «авг», «сен», «окт», «ноя», «дек»). When the pace is 0 or no words remain unstarted the
forecast SHALL NOT be shown.

#### Scenario: Forecast

- **WHEN** 70 new words were started in the last 14 days, 400 words are not started and today is 28 October 2026
- **THEN** home shows «финиш · янв 2027»

#### Scenario: Slow pace

- **WHEN** 4 new words were started in the last 14 days and 731 words are not started on 28 October 2026
- **THEN** home shows «финиш · окт 2033», with the year

#### Scenario: No pace yet

- **WHEN** no new words were started in the last 14 days
- **THEN** no forecast is shown
