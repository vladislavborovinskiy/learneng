## ADDED Requirements

### Requirement: Split sentences in exercises

A split sentence of a phrasal verb SHALL be used only for translation choice and sentence
assembly (chunks or words). The cloze choice and typing exercises SHALL pick a joined sentence of
the item. In a chunk assembly the whole span from the verb to the particle SHALL lie within one
chunk. On the feedback panel both parts of the phrase SHALL be highlighted,
and the object between them SHALL not be.

#### Scenario: Typing a separable verb

- **WHEN** «set up» gets a typing exercise
- **THEN** the sentence shown is a joined one such as «Set up the database first.» and the answer is «Set up»

#### Scenario: Assembly with a split sentence

- **WHEN** «set up» gets a chunk assembly with «We set it up yesterday.»
- **THEN** «set it up» is inside one chunk, and after the answer «set» and «up» are highlighted but «it» is not

### Requirement: Answer options for phrases

In translation and cloze choice for an item of the phrase set, the wrong options SHALL be other
items of the phrase set, never single words; the rule that no option shares a Russian translation
with the answer still applies.

#### Scenario: Cloze for a phrase

- **WHEN** the cloze choice is shown for «roll back»
- **THEN** all four options are phrases such as «roll back», «fall back», «set up», «clean up»
