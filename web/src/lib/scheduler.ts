import { createEmptyCard, fsrs, generatorParameters, State, type Card, type Grade } from 'ts-fsrs'
import { newWordsOrder, words } from '@/lib/content'
import type { Meta, Progress } from '@/lib/storage'

const scheduler = fsrs(generatorParameters({ enable_fuzz: true }))

export function dayKey(date = new Date()) {
  return date.toLocaleDateString('en-CA')
}

export function gradeCard(card: Card | undefined, grade: Grade, now = new Date()) {
  return scheduler.next(card ?? createEmptyCard(now), now, grade).card
}

export function getDueWordIds(progress: Progress, now = new Date()) {
  return Object.entries(progress)
    .filter(([, card]) => card.due <= now)
    .sort(([, a], [, b]) => a.due.getTime() - b.due.getTime())
    .map(([wordId]) => wordId)
}

export function getNewWordIds(progress: Progress, meta: Meta, now = new Date()) {
  const learnedToday = meta.days[dayKey(now)]?.learned ?? 0
  const limit = Math.max(0, meta.newPerDay - learnedToday)
  return newWordsOrder
    .filter((word) => !progress[word.id])
    .slice(0, limit)
    .map((word) => word.id)
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

  return {
    due: getDueWordIds(progress, now).length,
    newToday: getNewWordIds(progress, meta, now).length,
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
