import { FlameIcon } from '@phosphor-icons/react/dist/csr/Flame'
import { GearSixIcon } from '@phosphor-icons/react/dist/csr/GearSix'
import { lazy, Suspense } from 'react'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { getStats } from '@/lib/scheduler'
import { cn } from '@/lib/utils'

const MAX_LAPSE_DOTS = 3

const PaceChart = lazy(() =>
  import('@/components/pace-chart').then((module) => ({ default: module.PaceChart }))
)

type HomeProps = {
  stats: ReturnType<typeof getStats>
  levelTestDone: boolean
  onStartLesson: () => void
  onStartLevelTest: () => void
  onOpenSettings: () => void
}

export function Home({
  stats,
  levelTestDone,
  onStartLesson,
  onStartLevelTest,
  onOpenSettings,
}: HomeProps) {
  return (
    <ThumbLayout
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium">LearnEng</h1>
          <div
            className={cn(
              'glass flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs tabular-nums',
              stats.streak > 0 ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            <FlameIcon weight="fill" className="size-3.5" />
            {stats.streak}
          </div>
        </div>
      }
      actions={
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="icon-lg" aria-label="Настройки" onClick={onOpenSettings}>
            <GearSixIcon weight="bold" />
          </Button>
          {!levelTestDone && (
            <Button variant="outline" size="lg" onClick={onStartLevelTest}>
              Тест
            </Button>
          )}
          <Button size="lg" className="flex-1" onClick={onStartLesson}>
            Урок
          </Button>
        </div>
      }
    >
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-7xl leading-none font-light tracking-[-0.04em] tabular-nums">
            {stats.learned}
          </span>
          <span className="text-muted-foreground">из {stats.total} слов</span>
        </div>
        <Progress value={(stats.learned / stats.total) * 100} />
        <span className="font-mono text-xs text-muted-foreground">
          сегодня +{stats.learnedToday}
        </span>
        <Suspense fallback={<div className="h-36" />}>
          <PaceChart data={stats.paceSeries} />
        </Suspense>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          {
            label: 'точность · 7 дн',
            value: stats.accuracyWeek === null ? '—' : `${stats.accuracyWeek}%`,
          },
          { label: 'повторений сегодня', value: stats.reviewedToday },
        ].map(({ label, value }) => (
          <div key={label} className="glass flex flex-col gap-2 rounded-3xl p-4">
            <span className="text-3xl leading-none font-light tracking-[-0.03em] tabular-nums">
              {value}
            </span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {stats.hardWords.length > 0 && (
        <section aria-label="Трудные слова" className="glass flex flex-col gap-3 rounded-3xl p-5">
          {stats.hardWords.map(({ id, en, ru, lapses }) => (
            <div key={id} className="flex items-center gap-3">
              <span className="font-medium">{en}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{ru}</span>
              <span className="flex gap-1" aria-label={`Забыто ${lapses} раз`}>
                {Array.from({ length: Math.min(lapses, MAX_LAPSE_DOTS) }, (_, index) => (
                  <span key={index} className="size-1.5 rounded-full bg-destructive" />
                ))}
              </span>
            </div>
          ))}
        </section>
      )}

      {stats.isNewWordsPaused && (
        <p className="glass rounded-3xl px-4 py-3 text-sm text-muted-foreground">
          Новые слова на паузе — сначала повторения
        </p>
      )}
    </ThumbLayout>
  )
}
