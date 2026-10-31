import { Rating, State, type Card, type Grade } from 'ts-fsrs'
import { words, type Sentence, type Word } from '@/lib/content'

export type ChoiceMode = 'en-ru' | 'ru-en' | 'cloze'

export type ChoiceExercise = {
  kind: 'choice'
  mode: ChoiceMode
  word: Word
  sentence: Sentence
  options: string[]
  answer: string
}

export type TilesMode = 'chunks' | 'words'

export type TilesExercise = {
  kind: 'tiles'
  mode: TilesMode
  word: Word
  sentence: Sentence
  tiles: string[]
  answer: string[]
}

export type TypingExercise = {
  kind: 'typing'
  word: Word
  sentence: Sentence
  answer: string
}

export type Exercise = ChoiceExercise | TilesExercise | TypingExercise

export type ExerciseType = ChoiceMode | 'chunks' | 'tiles' | 'typing'

export function exerciseType(exercise: Exercise): ExerciseType {
  if (exercise.kind === 'typing') return 'typing'
  if (exercise.kind === 'tiles') return exercise.mode === 'chunks' ? 'chunks' : 'tiles'
  return exercise.mode
}

export type AnswerResult = 'correct' | 'hinted' | 'typo' | 'wrong' | 'forgot'

const OPTIONS_COUNT = 4
const EXTRA_TILES = 3
const FAMILIAR_STABILITY_DAYS = 7
const MATURE_STABILITY_DAYS = 21
const MAX_TILE_MISTAKES_FOR_HARD = 2

export function shuffle<T>(items: T[]) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function distractorWords(word: Word, count: number) {
  const isPhrase = word.source === 'phrasal'
  const unambiguous = words.filter(
    (other) =>
      (other.source === 'phrasal') === isPhrase &&
      other.id !== word.id &&
      !other.ru.some((translation) => word.ru.includes(translation))
  )
  const samePos = unambiguous.filter((other) => other.pos === word.pos)
  return shuffle(samePos.length >= count ? samePos : unambiguous).slice(0, count)
}

function matchCase(value: string, sample: string) {
  const isCapitalized = sample[0] !== sample[0].toLowerCase()
  return isCapitalized ? value[0].toUpperCase() + value.slice(1) : value.toLowerCase()
}

export function tokenize(text: string) {
  return text
    .replace(/[.,!?;:"()]/g, '')
    .split(/\s+/)
    .filter(Boolean)
}

function joinedSentences(word: Word) {
  return word.sentences.filter((sentence) => !sentence.parts)
}

function buildChoice(word: Word, sentence: Sentence, mode: ChoiceMode): ChoiceExercise {
  const distractors = distractorWords(word, OPTIONS_COUNT - 1)
  const variants = {
    'en-ru': { answer: word.ru[0], others: distractors.map((other) => other.ru[0]) },
    'ru-en': { answer: word.en, others: distractors.map((other) => other.en) },
    'cloze': {
      answer: sentence.form,
      others: distractors.map((other) =>
        matchCase(pick(joinedSentences(other)).form, sentence.form)
      ),
    },
  }
  const { answer, others } = variants[mode]
  const options = shuffle([answer, ...new Set(others.filter((other) => other !== answer))])
  return { kind: 'choice', mode, word, sentence, options, answer }
}

export function chunkTexts(sentence: Sentence) {
  const sentenceWords = sentence.en.split(' ')
  const starts = [0, ...sentence.chunks, sentenceWords.length]
  return starts
    .slice(0, -1)
    .map((start, index) =>
      tokenize(sentenceWords.slice(start, starts[index + 1]).join(' ')).join(' ')
    )
}

function buildChunkTiles(word: Word, sentence: Sentence): TilesExercise {
  const answer = chunkTexts(sentence)
  let tiles = shuffle(answer)
  while (new Set(answer).size > 1 && tiles.join('|') === answer.join('|')) tiles = shuffle(answer)
  return { kind: 'tiles', mode: 'chunks', word, sentence, tiles, answer }
}

function buildWordTiles(word: Word, sentence: Sentence): TilesExercise {
  const answer = tokenize(sentence.en)
  const used = new Set(answer.map((token) => token.toLowerCase()))
  const extras = shuffle(
    distractorWords(word, EXTRA_TILES * 2).flatMap((other) => tokenize(pick(other.sentences).en))
  )
    .filter((token) => !used.has(token.toLowerCase()))
    .slice(0, EXTRA_TILES)
  return {
    kind: 'tiles',
    mode: 'words',
    word,
    sentence,
    tiles: shuffle([...answer, ...extras]),
    answer,
  }
}

export function buildExercise(word: Word, card: Card | undefined): Exercise {
  const sentence = pick(word.sentences)
  const joinedSentence = pick(joinedSentences(word))

  if (!card || card.state !== State.Review) {
    return buildChoice(word, sentence, pick<ChoiceMode>(['en-ru', 'ru-en']))
  }
  if (card.stability < FAMILIAR_STABILITY_DAYS) {
    return Math.random() < 0.5
      ? buildChoice(word, joinedSentence, 'cloze')
      : buildChunkTiles(word, sentence)
  }
  if (card.stability < MATURE_STABILITY_DAYS && Math.random() < 0.5) {
    return buildWordTiles(word, sentence)
  }
  return { kind: 'typing', word, sentence: joinedSentence, answer: joinedSentence.form }
}

function levenshtein(a: string, b: string) {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost)
    }
    previous = current
  }
  return previous[b.length]
}

export function checkTyping(input: string, answer: string): AnswerResult {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ')
  const distance = levenshtein(normalize(input), normalize(answer))
  if (distance === 0) return 'correct'
  const allowedTypos = answer.length >= 8 ? 2 : answer.length >= 4 ? 1 : 0
  return distance <= allowedTypos ? 'typo' : 'wrong'
}

export function isSameTile(tile: string, token: string) {
  return tile.toLowerCase() === token.toLowerCase()
}

export function nextTileIndex(tiles: string[], placed: number[], answer: string[]) {
  return tiles.findIndex(
    (tile, index) => !placed.includes(index) && isSameTile(tile, answer[placed.length])
  )
}

export function tilesResult(mistakes: number): AnswerResult {
  if (mistakes === 0) return 'correct'
  return mistakes <= MAX_TILE_MISTAKES_FOR_HARD ? 'typo' : 'wrong'
}

export function revealedPrefix(answer: string, letters: number) {
  if (letters === 0) return ''
  let count = 0
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] !== ' ') count++
    if (count === letters) return answer.slice(0, i + 1)
  }
  return answer
}

export function maxHintLetters(answer: string) {
  return Math.max(1, Math.floor(answer.replace(/ /g, '').length / 2))
}

export function withHint(result: AnswerResult, hinted: boolean): AnswerResult {
  return hinted && (result === 'correct' || result === 'typo') ? 'hinted' : result
}

export function isMistake(result: AnswerResult) {
  return result === 'wrong' || result === 'forgot'
}

export const gradeByResult: Record<AnswerResult, Grade> = {
  correct: Rating.Good,
  hinted: Rating.Hard,
  typo: Rating.Hard,
  wrong: Rating.Again,
  forgot: Rating.Again,
}
