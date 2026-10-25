import { getStats } from '@/lib/scheduler'
import { useLearning } from '@/lib/use-learning'
import { Home } from '@/screens/home'

export function App() {
  const { state } = useLearning()

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

  return (
    <Home stats={getStats(state.progress, state.meta)} levelTestDone={state.meta.levelTestDone} />
  )
}
