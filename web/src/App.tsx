import { useCallback, useState } from 'react'
import { getStats } from '@/lib/scheduler'
import { useLearning } from '@/lib/use-learning'
import { Home } from '@/screens/home'
import { LevelTest } from '@/screens/level-test'
import { Session } from '@/screens/session'
import { Settings } from '@/screens/settings'

type Screen = 'home' | 'session' | 'level-test' | 'settings'

const EXTRA_NEW_WORDS = 5

export function App() {
  const { state, grade, markKnown, updateMeta } = useLearning()
  const [screen, setScreen] = useState<Screen>('home')
  const [extraNew, setExtraNew] = useState(0)
  const goHome = useCallback(() => setScreen('home'), [])
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
        progress={state.progress}
        meta={state.meta}
        extraNew={extraNew}
        grade={grade}
        markKnown={markKnown}
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
        updateMeta={updateMeta}
        onRetakeLevelTest={() => setScreen('level-test')}
        onExit={goHome}
      />
    )
  }

  return (
    <Home
      stats={getStats(state.progress, state.meta)}
      levelTestDone={state.meta.levelTestDone}
      extraNewCount={EXTRA_NEW_WORDS}
      onStartSession={() => {
        setExtraNew(0)
        setScreen('session')
      }}
      onStartExtra={() => {
        setExtraNew(EXTRA_NEW_WORDS)
        setScreen('session')
      }}
      onStartLevelTest={() => setScreen('level-test')}
      onOpenSettings={() => setScreen('settings')}
    />
  )
}
