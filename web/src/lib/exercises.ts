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

export type TilesExercise = {
  kind: 'tiles'
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

export type AnswerResult = 'correct' | 'hinted' | 'typo' | 'wrong' | 'forgot'

const OPTIONS_COUNT = 4
const EXTRA_TILES = 3
const FAMILIAR_STABILITY_DAYS = 7

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
  const unambiguous = words.filter(
    (other) =>
      other.id !== word.id && !other.ru.some((translation) => word.ru.includes(translation))
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

function buildChoice(word: Word, sentence: Sentence, mode: ChoiceMode): ChoiceExercise {
  const distractors = distractorWords(word, OPTIONS_COUNT - 1)
  const variants = {
    'en-ru': { answer: word.ru[0], others: distractors.map((other) => other.ru[0]) },
    'ru-en': { answer: word.en, others: distractors.map((other) => other.en) },
    'cloze': {
      answer: sentence.form,
      others: distractors.map((other) => matchCase(pick(other.sentences).form, sentence.form)),
    },
  }
  const { answer, others } = variants[mode]
  const options = shuffle([answer, ...new Set(others.filter((other) => other !== answer))])
  return { kind: 'choice', mode, word, sentence, options, answer }
}

function buildTiles(word: Word, sentence: Sentence): TilesExercise {
  const answer = tokenize(sentence.en)
  const used = new Set(answer.map((token) => token.toLowerCase()))
  const extras = shuffle(
    distractorWords(word, EXTRA_TILES * 2).flatMap((other) => tokenize(pick(other.sentences).en))
  )
    .filter((token) => !used.has(token.toLowerCase()))
    .slice(0, EXTRA_TILES)
  return { kind: 'tiles', word, sentence, tiles: shuffle([...answer, ...extras]), answer }
}

export function buildExercise(word: Word, card: Card | undefined): Exercise {
  const sentence = pick(word.sentences)

  if (!card || card.state !== State.Review) {
    return buildChoice(word, sentence, pick<ChoiceMode>(['en-ru', 'ru-en']))
  }
  if (card.stability < FAMILIAR_STABILITY_DAYS) {
    return Math.random() < 0.5 ? buildChoice(word, sentence, 'cloze') : buildTiles(word, sentence)
  }
  return { kind: 'typing', word, sentence, answer: sentence.form }
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

export function checkTiles(selected: string[], answer: string[]) {
  return selected.join(' ').toLowerCase() === answer.join(' ').toLowerCase()
}

export function hintTiles(tiles: string[], selected: number[], answer: string[]) {
  const sameToken = (tile: string, token: string) => tile.toLowerCase() === token.toLowerCase()
  let correctCount = 0
  while (
    correctCount < selected.length &&
    correctCount < answer.length &&
    sameToken(tiles[selected[correctCount]], answer[correctCount])
  ) {
    correctCount++
  }
  const kept = selected.slice(0, correctCount)
  if (correctCount >= answer.length) return kept
  const next = tiles.findIndex(
    (tile, index) => !kept.includes(index) && sameToken(tile, answer[correctCount])
  )
  return next === -1 ? kept : [...kept, next]
}

export function revealedPrefix(answer: string, letters: number) {
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
