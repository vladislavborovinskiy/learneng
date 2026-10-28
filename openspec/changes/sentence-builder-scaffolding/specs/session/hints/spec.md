## MODIFIED Requirements

### Requirement: Tile hint

An assembly exercise SHALL offer a hint button that places the next correct tile. The hint
button SHALL be hidden when only one tile is left to place. A hint SHALL NOT count as a mistake.

#### Scenario: Hint

- **WHEN** the sentence is «Update your software» and the learner placed «Update»
- **THEN** after the hint the placed tiles are «Update your»

#### Scenario: Hint after a wrong tile

- **WHEN** the sentence is «Update your software», the learner placed «Update» and then tapped the wrong tile «software»
- **THEN** «software» stays in the pool and after the hint the placed tiles are «Update your»

#### Scenario: Last tile

- **WHEN** one tile is left to place
- **THEN** the hint button is not shown
