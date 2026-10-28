import { useCallback, useState } from 'react'
import { getStats } from '@/lib/scheduler'
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
  const goHome = useCallback(() => setScreen('home'), [])
  const startLesson = useCallback(() => {
    setLessonKey((key) => key + 1)
    setScreen('session')
  }, [])
  const finishLevelTest = useCallback(() => {
    updateMeta({ levelTestDone: true })
    setScreen('home')
  }, [updateMeta])

  if (state.status === 'loading') {
    return <div className="grid min-h-svh place-items-center text-muted-foreground">Загрузка…</div>
  }

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
        progress={state.progress}
        meta={state.meta}
        grade={grade}
        markKnown={markKnown}
        recordAnswer={recordAnswer}
        onComplete={completeLesson}
        onNextLesson={startLesson}
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
      stats={getStats(state.progress, state.meta)}
      levelTestDone={state.meta.levelTestDone}
      onStartLesson={startLesson}
      onStartLevelTest={() => setScreen('level-test')}
      onOpenSettings={() => setScreen('settings')}
    />
  )
}
