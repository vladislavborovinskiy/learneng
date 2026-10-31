## MODIFIED Requirements

### Requirement: Goal progress and forecast

The home screen SHALL show, as its main block, the number of items of all sets (words and
phrases) in long-term review as one large number followed by «из Y слов» (Y = all items of all
sets), a thin progress bar, and under the bar on one line the split by set on the left
«слова A · фразы B» (A = IT and NGSL words in long-term review, B = phrases in long-term review)
and «сегодня +N» on the right. It SHALL NOT show a «Выучено» label, the number of unstarted
items, a finish forecast or explanatory paragraphs.

#### Scenario: Main block

- **WHEN** 206 words and 12 phrases are learned, the deck has 857 items and 3 new items were started today
- **THEN** home shows «218», «из 857 слов», the bar, «слова 206 · фразы 12» and «сегодня +3», and no «финиш»

#### Scenario: No phrases yet

- **WHEN** no phrase is in long-term review
- **THEN** the split line reads «слова A · фразы 0»

#### Scenario: Forecast

- **WHEN** 70 new items were started in the last 14 days and 400 items are not started
- **THEN** home shows no finish date or pace text

#### Scenario: No pace yet

- **WHEN** no new items were started in the last 14 days
- **THEN** home shows «сегодня +0» and no forecast text
