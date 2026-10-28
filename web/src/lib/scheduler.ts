import { createEmptyCard, fsrs, generatorParameters, State, type Card, type Grade } from 'ts-fsrs'
import { itWordsOrder, ngslWordsOrder, words } from '@/lib/content'
import type { Meta, Progress } from '@/lib/storage'

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
export const PAUSE_NEW_WORDS_AT = 48

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

export function getStats(progress: Progress, meta: Meta, now = new Date()) {
  const isLearned = (wordId: string) => progress[wordId]?.state === State.Review
  const itWords = words.filter((word) => word.source === 'it')
  const ngslWords = words.filter((word) => word.source === 'ngsl')

  const due = getDueWordIds(progress, now).length
  const today = meta.days[dayKey(now)]
  const unstarted = words.filter((word) => !progress[word.id]).length
  const startedRecently = Array.from(
    { length: PACE_DAYS },
    (_, offset) => meta.days[dayKey(addDays(now, -offset))]?.learned ?? 0
  ).reduce((sum, count) => sum + count, 0)
  const pace = startedRecently / PACE_DAYS
  const finishDate = pace > 0 && unstarted > 0 ? addDays(now, Math.ceil(unstarted / pace)) : null

  return {
    due,
    isNewWordsPaused: due >= PAUSE_NEW_WORDS_AT,
    unstarted,
    pace,
    finishDate,
    learnedToday: today?.learned ?? 0,
    lessonsToday: today?.lessons ?? 0,
    streak: getStreak(meta, now),
    total: words.length,
    learned: words.filter((word) => isLearned(word.id)).length,
    it: { total: itWords.length, learned: itWords.filter((word) => isLearned(word.id)).length },
    ngsl: {
      total: ngslWords.length,
      learned: ngslWords.filter((word) => isLearned(word.id)).length,
    },
  }
}
