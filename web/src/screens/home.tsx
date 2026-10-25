import { FireIcon } from '@phosphor-icons/react/dist/csr/Fire'
import { GearSixIcon } from '@phosphor-icons/react/dist/csr/GearSix'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { getStats } from '@/lib/scheduler'

type HomeProps = {
  stats: ReturnType<typeof getStats>
  levelTestDone: boolean
  onStartSession: () => void
  onStartLevelTest: () => void
  onOpenSettings: () => void
}

export function Home({
  stats,
  levelTestDone,
  onStartSession,
  onStartLevelTest,
  onOpenSettings,
}: HomeProps) {
  const hasWork = stats.due + stats.newToday > 0

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-3 p-4">
      <header className="flex items-center justify-between py-2">
        <h1 className="text-xl font-semibold">LearnEng</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm font-medium">
            <FireIcon
              weight={stats.streak > 0 ? 'fill' : 'regular'}
              className={
                stats.streak > 0 ? 'size-5 text-orange-500' : 'size-5 text-muted-foreground'
              }
            />
            {stats.streak}
          </div>
          <Button variant="ghost" size="icon" aria-label="Настройки" onClick={onOpenSettings}>
            <GearSixIcon className="size-5" />
          </Button>
        </div>
      </header>

      {!levelTestDone && (
        <Card>
          <CardHeader>
            <CardTitle>Тест уровня</CardTitle>
            <CardDescription>
              5 минут: отметь знакомые слова, и они не попадут в изучение как новые
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="h-11 w-full" onClick={onStartLevelTest}>
              Пройти тест
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Сегодня</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-3">
              <div className="text-2xl font-semibold">{stats.due}</div>
              <div className="text-sm text-muted-foreground">на повторение</div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-2xl font-semibold">{stats.newToday}</div>
              <div className="text-sm text-muted-foreground">новых слов</div>
            </div>
          </div>
          <Button className="h-11 w-full text-base" disabled={!hasWork} onClick={onStartSession}>
            {hasWork ? 'Начать занятие' : 'На сегодня всё'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Прогресс</CardTitle>
          <CardDescription>
            Выучено {stats.learned} из {stats.total}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {[
            { label: 'IT-словарь', ...stats.it },
            { label: 'Частотные слова', ...stats.ngsl },
          ].map(({ label, learned, total }) => (
            <div key={label} className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span className="text-muted-foreground">
                  {learned} / {total}
                </span>
              </div>
              <Progress value={(learned / total) * 100} />
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}
