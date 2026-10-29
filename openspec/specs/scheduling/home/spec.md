# scheduling/home Specification

## Purpose

Defines what the home screen shows about today's learning and which main action it offers in
the lesson-based model.

## Requirements

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
large number followed by «из Y слов» (Y = all words), a thin progress bar and «сегодня +N». It
SHALL NOT show a «Выучено» label, the number of unstarted words, a finish forecast or explanatory
paragraphs.

#### Scenario: Main block

- **WHEN** 7 words are learned and 3 new words were started today
- **THEN** home shows «7», «из 737 слов», the bar and «сегодня +3», and no «финиш»

#### Scenario: Forecast

- **WHEN** 70 new words were started in the last 14 days and 400 words are not started
- **THEN** home shows no finish date or pace text

#### Scenario: No pace yet

- **WHEN** no new words were started in the last 14 days
- **THEN** home shows «сегодня +0» and no forecast text

### Requirement: Pace chart

The home screen SHALL show, under «сегодня +N», a line chart of new words started
per day over the last 14 local days including today (values from `meta.days[YYYY-MM-DD].learned`,
missing days count as 0). The line SHALL be sage, with a faint area below, hairline horizontal
grid, small muted axis labels (days as «28 окт» on a few ticks, whole-number counts) and today's
point marked. Tapping or hovering a day SHALL show a glass tooltip «<день> <мес> · +N». The
chart SHALL have no legend, title or border.

#### Scenario: Active learner

- **WHEN** the learner started 3, 0 and 5 new words on the last three days
- **THEN** the line ends with points 3, 0, 5 and today's point (5) is marked

#### Scenario: Fresh learner

- **WHEN** no new words were started in the last 14 days
- **THEN** the chart shows a flat line at 0

#### Scenario: Tooltip

- **WHEN** the learner taps the point for 28 October with 3 new words
- **THEN** a tooltip «28 окт · +3» appears

### Requirement: Stats tiles

Under the pace chart the home screen SHALL show two glass tiles: answer accuracy over the last 7
local days including today (correct / total from the stored answer statistics, as a whole
percent, «—» without answers) labelled «точность за неделю», and reviews done today
(`meta.days[today].reviewed`) labelled «повторений сегодня».

#### Scenario: Tiles

- **WHEN** the last 7 days have 50 answers with 41 correct and 24 reviews were done today
- **THEN** the tiles read «82%» «точность за неделю» and «24» «повторений сегодня»

#### Scenario: No answers yet

- **WHEN** there are no answers in the last 7 days
- **THEN** the accuracy tile reads «—»

### Requirement: Hard words

The home screen SHALL show a glass section without a visible title (labelled «Трудные слова» for
screen readers) listing up to 3 words with the most lapses (ties by most recent review), each as the English word on the left and its first Russian translation on the right. The
translation SHALL be blurred until the learner taps the row; a tap reveals it until the home
screen is left. The section SHALL NOT be shown when no word has lapses.

#### Scenario: Hard words

- **WHEN** «deploy» has 4 lapses, «capability» 2 and «throughput» 1
- **THEN** the section lists deploy, capability, throughput with blurred translations

#### Scenario: Reveal translation

- **WHEN** the learner taps the «deploy» row
- **THEN** its translation «развернуть» is shown unblurred

#### Scenario: No lapses

- **WHEN** no word has been forgotten after learning
- **THEN** the section is not shown
