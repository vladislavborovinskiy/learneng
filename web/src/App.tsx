import { useCallback, useEffect, useState } from 'react'
import { getStats, type LessonItem } from '@/lib/scheduler'
import { haptic } from '@/lib/telegram'
import { useLearning } from '@/lib/use-learning'
import { Home } from '@/screens/home'
import { LevelTest } from '@/screens/level-test'
import { Session } from '@/screens/session'
import { Settings } from '@/screens/settings'

type Screen = 'home' | 'session' | 'level-test' | 'settings'

export function App() {
  const { state, grade, markKnown, completeLesson, updateMeta, recordAnswer } = useLearning()
  const [screen, setScreen] = useState<Screen>('home')
  const [lessonKey, setLessonKey] = useState(0)
  const [mistakeItems, setMistakeItems] = useState<LessonItem[] | null>(null)
  const goHome = useCallback(() => setScreen('home'), [])
  const startLesson = useCallback(() => {
    setMistakeItems(null)
    setLessonKey((key) => key + 1)
    setScreen('session')
  }, [])
  const repeatMistakes = useCallback((wordIds: string[]) => {
    setMistakeItems(wordIds.map((wordId) => ({ wordId, intro: false })))
    setLessonKey((key) => key + 1)
  }, [])
  const finishLevelTest = useCallback(() => {
    updateMeta({ levelTestDone: true })
    setScreen('home')
  }, [updateMeta])
  const isLoading = state.status === 'loading'
  const hasError = state.status === 'error'

  useEffect(() => {
    if (isLoading) return
    const preloader = document.getElementById('preloader')
    if (!preloader) return
    const hide = () => {
      preloader.classList.add('preloader-hidden')
      preloader.addEventListener('transitionend', (event) => {
        if (event.target === preloader) preloader.remove()
      })
    }
    if (hasError) {
      hide()
      return
    }
    const close = document.getElementById('preloader-close')
    const handleClose = () => {
      haptic('success')
      hide()
    }
    close?.addEventListener('click', handleClose, { once: true })
    document.fonts.ready.then(() => preloader.classList.add('preloader-ready'))
    return () => close?.removeEventListener('click', handleClose)
  }, [isLoading, hasError])

  if (isLoading) return null

  if (state.status === 'error') {
    return (
      <div className="grid min-h-svh place-items-center p-4 text-center text-destructive">
        Не удалось загрузить прогресс: {state.error}
      </div>
    )
  }

  if (screen === 'session') {
    return (
      <Session
        key={lessonKey}
        items={mistakeItems ?? undefined}
        progress={state.progress}
        meta={state.meta}
        grade={grade}
        markKnown={markKnown}
        recordAnswer={recordAnswer}
        onComplete={completeLesson}
        onNextLesson={startLesson}
        onRepeatMistakes={repeatMistakes}
        onExit={goHome}
      />
    )
  }

  if (screen === 'level-test') {
    return <LevelTest markKnown={markKnown} onFinish={finishLevelTest} onExit={goHome} />
  }

  if (screen === 'settings') {
    return (
      <Settings
        progress={state.progress}
        meta={state.meta}
        stats={state.stats}
        onRetakeLevelTest={() => setScreen('level-test')}
        onExit={goHome}
      />
    )
  }

  return (
    <Home
      stats={getStats(state.progress, state.meta, state.stats)}
      levelTestDone={state.meta.levelTestDone}
      onStartLesson={startLesson}
      onStartLevelTest={() => setScreen('level-test')}
      onOpenSettings={() => setScreen('settings')}
    />
  )
}
