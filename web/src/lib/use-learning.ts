import { useCallback, useEffect, useState } from 'react'
import type { Grade } from 'ts-fsrs'
import { dayKey, gradeCard } from '@/lib/scheduler'
import { loadAll, saveCard, saveMeta, type Meta, type Progress } from '@/lib/storage'

type LearningState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; progress: Progress; meta: Meta }

function reportSaveError(error: unknown) {
  console.error('Failed to save progress', error)
}

export function useLearning() {
  const [state, setState] = useState<LearningState>({ status: 'loading' })

  useEffect(() => {
    loadAll()
      .then(({ progress, meta }) => setState({ status: 'ready', progress, meta }))
      .catch((error: unknown) => setState({ status: 'error', error: String(error) }))
  }, [])

  const grade = useCallback(
    (wordId: string, rating: Grade) => {
      if (state.status !== 'ready') return
      const now = new Date()
      const today = dayKey(now)
      const previous = state.progress[wordId]
      const progress = { ...state.progress, [wordId]: gradeCard(previous, rating, now) }
      const todayStats = state.meta.days[today] ?? { reviewed: 0, learned: 0 }
      const meta: Meta = {
        ...state.meta,
        days: {
          ...state.meta.days,
          [today]: {
            reviewed: todayStats.reviewed + 1,
            learned: todayStats.learned + (previous ? 0 : 1),
          },
        },
      }
      setState({ status: 'ready', progress, meta })
      saveCard(progress, wordId).catch(reportSaveError)
      saveMeta(meta).catch(reportSaveError)
    },
    [state]
  )

  const updateMeta = useCallback(
    (patch: Partial<Meta>) => {
      if (state.status !== 'ready') return
      const meta = { ...state.meta, ...patch }
      setState({ ...state, meta })
      saveMeta(meta).catch(reportSaveError)
    },
    [state]
  )

  return { state, grade, updateMeta }
}
