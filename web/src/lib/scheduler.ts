import { createEmptyCard, fsrs, generatorParameters, State, type Card, type Grade } from 'ts-fsrs'
import { itWordsOrder, ngslWordsOrder, words, wordsById } from '@/lib/content'
import type { AnswerStats, Meta, Progress } from '@/lib/storage'

const scheduler = fsrs(generatorParameters({ enable_fuzz: true }))

const REVIEWS_PER_LESSON = 8
const WARMUP_REVIEWS = 2
const NGSL_SLOTS_FROM = 2
const PACE_DAYS = 14
const NEW_WORDS_TAPER = [
  { dueBelow: 12, count: 3 },
  { dueBelow: 24, count: 2 },
  { dueBelow: 48, count: 1 },
]
const PAUSE_NEW_WORDS_AT = 48

export function dayKey(date = new Date()) {
  return date.toLocaleDateString('en-CA')
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function gradeCard(card: Card | undefined, grade: Grade, now = new Date()) {
  return scheduler.next(card ?? createEmptyCard(now), now, grade).card
}

export function getDueWordIds(progress: Progress, now = new Date()) {
  return Object.entries(progress)
    .filter(([, card]) => card.due <= now)
    .sort(([, a], [, b]) => b.lapses - a.lapses || a.due.getTime() - b.due.getTime())
    .map(([wordId]) => wordId)
}

export type LessonItem = {
  wordId: string
  intro: boolean
}

function getTopUpWordIds(progress: Progress, excluded: Set<string>, count: number, now: Date) {
  return Object.entries(progress)
    .filter(
      ([wordId, card]) => card.state === State.Review && card.due > now && !excluded.has(wordId)
    )
    .map(([wordId, card]) => ({ wordId, recall: scheduler.get_retrievability(card, now, false) }))
    .sort((a, b) => a.recall - b.recall)
    .slice(0, count)
    .map(({ wordId }) => wordId)
}

export function newWordsLimit(dueCount: number) {
  return NEW_WORDS_TAPER.find(({ dueBelow }) => dueCount < dueBelow)?.count ?? 0
}

function getNewWordIds(progress: Progress, limit: number) {
  const unseenIt = itWordsOrder.filter((word) => !progress[word.id])
  const unseenNgsl = ngslWordsOrder.filter((word) => !progress[word.id])
  const ngslSlots = limit >= NGSL_SLOTS_FROM ? 1 : 0
  const itCount = Math.min(unseenIt.length, limit - Math.min(ngslSlots, unseenNgsl.length))
  return [...unseenIt.slice(0, itCount), ...unseenNgsl.slice(0, limit - itCount)].map(
    (word) => word.id
  )
}

export function buildLesson(progress: Progress, now = new Date()): LessonItem[] {
  const due = getDueWordIds(progress, now)
  const dueReviews = due.slice(0, REVIEWS_PER_LESSON)
  const reviews = [
    ...dueReviews,
    ...getTopUpWordIds(progress, new Set(dueReviews), REVIEWS_PER_LESSON - dueReviews.length, now),
  ].map((wordId) => ({ wordId, intro: false }))
  const newWords = getNewWordIds(progress, newWordsLimit(due.length)).map((wordId) => ({
    wordId,
    intro: true,
  }))

  if (newWords.length === 0) return reviews

  const warmup = reviews.slice(0, WARMUP_REVIEWS)
  const rest = reviews.slice(WARMUP_REVIEWS)
  const items = [...warmup]
  newWords.forEach((newWord, index) => {
    const from = Math.round((rest.length * index) / newWords.length)
    const to = Math.round((rest.length * (index + 1)) / newWords.length)
    items.push(newWord, ...rest.slice(from, to))
  })
  return items
}

export function getStreak(meta: Meta, now = new Date()) {
  const day = new Date(now)
  if (!meta.days[dayKey(day)]?.reviewed) day.setDate(day.getDate() - 1)
  let streak = 0
  while (meta.days[dayKey(day)]?.reviewed) {
    streak++
    day.setDate(day.getDate() - 1)
  }
  return streak
}

export const SHORT_MONTHS = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
]

const ACCURACY_DAYS = 7
const HARD_WORDS_COUNT = 3

export function getStats(
  progress: Progress,
  meta: Meta,
  answerStats: AnswerStats,
  now = new Date()
) {
  const due = getDueWordIds(progress, now).length
  const firstDay = Object.keys(meta.days).sort()[0]
  const paceSeries = Array.from({ length: PACE_DAYS }, (_, index) =>
    dayKey(addDays(now, index - PACE_DAYS + 1))
  )
    .filter((day, index) => !firstDay || day >= firstDay || index === PACE_DAYS - 1)
    .map((day) => ({ day, learned: meta.days[day]?.learned ?? 0 }))
  const [correct, total] = Array.from({ length: ACCURACY_DAYS }, (_, offset) =>
    Object.values(answerStats[dayKey(addDays(now, -offset))] ?? {})
  )
    .flat()
    .reduce(
      ([correctSum, totalSum], [dayCorrect, dayTotal]) => [
        correctSum + dayCorrect,
        totalSum + dayTotal,
      ],
      [0, 0]
    )
  const hardWords = Object.entries(progress)
    .filter(([wordId, card]) => card.lapses > 0 && wordsById.has(wordId))
    .sort(
      ([, a], [, b]) =>
        b.lapses - a.lapses || (b.last_review?.getTime() ?? 0) - (a.last_review?.getTime() ?? 0)
    )
    .slice(0, HARD_WORDS_COUNT)
    .map(([wordId, card]) => {
      const word = wordsById.get(wordId)!
      return { id: wordId, en: word.en, ru: word.ru[0], lapses: card.lapses }
    })
  const today = meta.days[dayKey(now)]

  return {
    isNewWordsPaused: due >= PAUSE_NEW_WORDS_AT,
    learnedToday: today?.learned ?? 0,
    reviewedToday: today?.reviewed ?? 0,
    accuracyWeek: total > 0 ? Math.round((correct / total) * 100) : null,
    hardWords,
    paceSeries,
    streak: getStreak(meta, now),
    total: words.length,
    learned: words.filter((word) => progress[word.id]?.state === State.Review).length,
  }
}
