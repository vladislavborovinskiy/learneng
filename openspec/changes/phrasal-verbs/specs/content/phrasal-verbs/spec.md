## Purpose

Defines the phrase set: phrasal verbs and fixed expressions frequent in technical documentation,
how they are ordered and how their example sentences are written, including split forms.

## ADDED Requirements

### Requirement: Phrase set composition

The deck SHALL contain a phrase set of about 120 items: about 80 phrasal verbs (verb + particle,
e.g. «set up», «roll back», «fall back», «opt out») and about 40 fixed expressions (e.g. «out of
the box», «under the hood», «by default», «make sure»). Every item SHALL appear in a corpus of
real technical documentation, and the set SHALL be ordered by how often the item occurs there,
most frequent first. An item SHALL have the same shape as a word: English text, Russian
translations, six example sentences with translations, and a usage note where useful. Items
SHALL NOT duplicate existing words; the existing multi-word IT terms stay in the IT set.

#### Scenario: Frequent phrasal verb comes early

- **WHEN** «set up» occurs in the corpus more often than «spin up»
- **THEN** «set up» comes before «spin up» in the phrase set

#### Scenario: Existing term

- **WHEN** «from scratch» is already an IT word
- **THEN** it is not added to the phrase set

### Requirement: Split sentences

For a phrasal verb that can be split by its object, 1 or 2 of its six sentences SHALL show the
split form («We set it up yesterday.»). A split sentence SHALL record the whole span from the verb
to the particle as its practised form («set it up») and the two parts of the phrase («set»,
«up»). The other sentences, and all sentences of items that cannot be split, SHALL use the joined
form. Each item SHALL keep at least four joined sentences.

#### Scenario: Separable verb

- **WHEN** the item is «set up»
- **THEN** one or two of its sentences read like «Can you set it up for me?» and the rest like «Set up the database first.»

#### Scenario: Inseparable item

- **WHEN** the item is «run into» or «out of the box»
- **THEN** all six sentences use the joined form
