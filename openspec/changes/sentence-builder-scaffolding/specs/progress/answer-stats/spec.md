## Purpose

Defines how answers are counted per exercise type and day, how long the counts are kept, and how
the learner sees accuracy per exercise type.

## ADDED Requirements

### Requirement: Answer statistics are stored per type and day

Every graded answer in a lesson SHALL be counted for the local day under its exercise type:
`en-ru`, `ru-en`, `cloze`, `chunks`, `tiles`, `typing`. A count is `[correct, total]`, where
correct means any result except wrong and «Не помню». The statistics SHALL be stored under the
key `stats` as JSON `{ "<YYYY-MM-DD>": { "<type>": [correct, total] } }`, keeping only the last
30 days, in the same storage as the progress (server with CloudStorage mirror in Telegram,
localStorage outside). Missing `stats` SHALL read as empty. The manual backup SHALL NOT include
`stats`.

#### Scenario: Counting

- **WHEN** the learner answers two chunk assemblies today, one with 4 mistakes
- **THEN** `stats[today].chunks` is `[1, 2]`

#### Scenario: Old days dropped

- **WHEN** statistics exist for 31 days and a new answer is counted
- **THEN** only the 30 most recent days remain stored

### Requirement: Accuracy per exercise in settings

Settings SHALL show «Точность по упражнениям» for the last 30 days: one row per exercise type
that has answers, with its Russian name («Перевод EN→RU», «Перевод RU→EN», «Вставь слово»,
«Собери из кусков», «Собери из слов», «Напиши слово»), accuracy in percent and the total number
of answers. With no answers the block SHALL NOT be shown.

#### Scenario: Settings

- **WHEN** the last 30 days contain 20 «Собери из кусков» answers with 15 correct
- **THEN** settings show the row «Собери из кусков — 75% · 20»
