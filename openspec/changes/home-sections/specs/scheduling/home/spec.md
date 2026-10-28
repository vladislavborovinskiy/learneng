## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Stats tiles

Under the pace chart the home screen SHALL show two glass tiles: answer accuracy over the last 7
local days including today (correct / total from the stored answer statistics, as a whole
percent, «—» without answers) labelled «точность · 7 дн», and reviews done today
(`meta.days[today].reviewed`) labelled «повторений сегодня».

#### Scenario: Tiles

- **WHEN** the last 7 days have 50 answers with 41 correct and 24 reviews were done today
- **THEN** the tiles read «82%» «точность · 7 дн» and «24» «повторений сегодня»

#### Scenario: No answers yet

- **WHEN** there are no answers in the last 7 days
- **THEN** the accuracy tile reads «—»

### Requirement: Hard words

The home screen SHALL show a glass section without a visible title (labelled «Трудные слова» for
screen readers) listing up to 3 words with the most lapses (ties by most recent review), each as the English word, its first Russian translation and
clay dots equal to the lapse count capped at 3. The section SHALL NOT be shown when no word has
lapses. The rows SHALL NOT be buttons.

#### Scenario: Hard words

- **WHEN** «deploy» has 4 lapses, «capability» 2 and «throughput» 1
- **THEN** the section lists deploy with 3 dots, capability with 2, throughput with 1

#### Scenario: No lapses

- **WHEN** no word has been forgotten after learning
- **THEN** the section is not shown
