## ADDED Requirements

### Requirement: Pace chart

The home screen SHALL show, under the «сегодня / финиш» row, a line chart of new words started
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
