import { Fire } from 'pixelarticons/react/Fire.js'
import { Gear } from 'pixelarticons/react/Gear.js'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { getStats } from '@/lib/scheduler'
import { cn } from '@/lib/utils'

type HomeProps = {
  stats: ReturnType<typeof getStats>
  levelTestDone: boolean
  extraNewCount: number
  onStartSession: () => void
  onStartExtra: () => void
  onStartLevelTest: () => void
  onOpenSettings: () => void
}

export function Home({
  stats,
  levelTestDone,
  extraNewCount,
  onStartSession,
  onStartExtra,
  onStartLevelTest,
  onOpenSettings,
}: HomeProps) {
  const hasWork = stats.due + stats.newToday > 0

  return (
    <ThumbLayout
      header={
        <div className="flex items-center justify-between">
          <h1 className="font-pixel text-2xl font-bold text-primary">LearnEng</h1>
          <div
            className={cn(
              'flex items-center gap-1 font-pixel text-xl',
              stats.streak > 0 ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Fire className="size-6" />
            {stats.streak}
          </div>
        </div>
      }
      actions={
        <div className="flex gap-3">
          <Button variant="outline" size="icon-lg" aria-label="Настройки" onClick={onOpenSettings}>
            <Gear className="size-7" />
          </Button>
          {!levelTestDone && (
            <Button variant="outline" size="lg" onClick={onStartLevelTest}>
              Тест
            </Button>
          )}
          {hasWork ? (
            <Button size="lg" className="flex-1" onClick={onStartSession}>
              Старт
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              disabled={stats.unseen === 0}
              onClick={onStartExtra}
            >
              {stats.unseen === 0 ? 'Всё выучено' : `Ещё ${extraNewCount} слов`}
            </Button>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'повторить', value: stats.due },
          { label: 'новых слов', value: stats.newToday },
        ].map(({ label, value }) => (
          <Card key={label} className="stripes">
            <CardContent>
              <div className="font-pixel text-5xl font-bold text-primary">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Выучено {stats.learned} / {stats.total}
          </CardTitle>
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

      {!levelTestDone && (
        <p className="text-sm text-muted-foreground">
          Пройди тест уровня: отметь знакомые слова, и они не попадут в изучение как новые.
        </p>
      )}
    </ThumbLayout>
  )
}
