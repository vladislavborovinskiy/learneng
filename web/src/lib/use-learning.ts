import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Rating, type Grade } from 'ts-fsrs'
import type { ExerciseType } from '@/lib/exercises'
import { strings, type Language } from '@/lib/i18n'
import { dayKey, gradeCard } from '@/lib/scheduler'
import {
  loadAll,
  saveCards,
  saveMeta,
  saveStats,
  type AnswerStats,
  type Meta,
  type Progress,
} from '@/lib/storage'

type LearningData = { progress: Progress; meta: Meta; stats: AnswerStats }

type LearningState =
  { status: 'loading' } | { status: 'error'; error: string } | ({ status: 'ready' } & LearningData)

function reportSaveError(language: Language) {
  return (error: unknown) => {
    console.error('Failed to save progress', error)
    toast.error(strings[language].backup.saveFailed, {
      id: 'save-error',
      description: strings[language].backup.saveFailedHint,
      duration: 8000,
    })
  }
}

export function useLearning() {
  const [state, setState] = useState<LearningState>({ status: 'loading' })
  const dataRef = useRef<LearningData | null>(null)

  const commit = useCallback((data: LearningData) => {
    dataRef.current = data
    setState({ status: 'ready', ...data })
  }, [])

  useEffect(() => {
    loadAll()
      .then(commit)
      .catch((error: unknown) => setState({ status: 'error', error: String(error) }))
  }, [commit])

  const grade = useCallback(
    (wordId: string, rating: Grade) => {
      const data = dataRef.current
      if (!data) return
      const now = new Date()
      const today = dayKey(now)
      const previous = data.progress[wordId]
      const progress = { ...data.progress, [wordId]: gradeCard(previous, rating, now) }
      const todayStats = data.meta.days[today] ?? { reviewed: 0, learned: 0 }
      const meta: Meta = {
        ...data.meta,
        days: {
          ...data.meta.days,
          [today]: {
            ...todayStats,
            reviewed: todayStats.reviewed + 1,
            learned: todayStats.learned + (previous ? 0 : 1),
          },
        },
      }
      commit({ ...data, progress, meta })
      saveCards(progress, [wordId]).catch(reportSaveError(meta.language))
      saveMeta(meta).catch(reportSaveError(meta.language))
    },
    [commit]
  )

  const markKnown = useCallback(
    (wordIds: string[]) => {
      const data = dataRef.current
      if (!data) return
      const now = new Date()
      const unseen = wordIds.filter((wordId) => !data.progress[wordId])
      const progress = { ...data.progress }
      for (const wordId of unseen) progress[wordId] = gradeCard(undefined, Rating.Easy, now)
      commit({ ...data, progress })
      saveCards(progress, unseen).catch(reportSaveError(data.meta.language))
    },
    [commit]
  )

  const completeLesson = useCallback(() => {
    const data = dataRef.current
    if (!data) return
    const today = dayKey()
    const todayStats = data.meta.days[today] ?? { reviewed: 0, learned: 0 }
    const meta: Meta = {
      ...data.meta,
      days: {
        ...data.meta.days,
        [today]: { ...todayStats, lessons: (todayStats.lessons ?? 0) + 1 },
      },
    }
    commit({ ...data, meta })
    saveMeta(meta).catch(reportSaveError(meta.language))
  }, [commit])

  const updateMeta = useCallback(
    (patch: Partial<Meta>) => {
      const data = dataRef.current
      if (!data) return
      const meta = { ...data.meta, ...patch }
      commit({ ...data, meta })
      saveMeta(meta).catch(reportSaveError(meta.language))
    },
    [commit]
  )

  const recordAnswer = useCallback(
    (type: ExerciseType, isCorrect: boolean) => {
      const data = dataRef.current
      if (!data) return
      const today = dayKey()
      const todayStats = data.stats[today] ?? {}
      const [correct, total] = todayStats[type] ?? [0, 0]
      const stats: AnswerStats = {
        ...data.stats,
        [today]: { ...todayStats, [type]: [correct + (isCorrect ? 1 : 0), total + 1] },
      }
      commit({ ...data, stats })
      saveStats(stats).catch(reportSaveError(data.meta.language))
    },
    [commit]
  )

  return { state, grade, markKnown, completeLesson, updateMeta, recordAnswer }
}
