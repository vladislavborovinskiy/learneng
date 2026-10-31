import { FireIcon } from '@phosphor-icons/react/dist/csr/Fire'
import { GearSixIcon } from '@phosphor-icons/react/dist/csr/GearSix'
import { lazy, Suspense, useState } from 'react'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useStrings } from '@/lib/i18n'
import type { getStats } from '@/lib/scheduler'
import { cn } from '@/lib/utils'

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
  const t = useStrings()
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(new Set())

  return (
    <ThumbLayout
      actions={
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="icon-lg"
            aria-label={t.home.settings}
            onClick={onOpenSettings}
          >
            <GearSixIcon weight="bold" />
          </Button>
          {!levelTestDone && (
            <Button variant="outline" size="lg" onClick={onStartLevelTest}>
              {t.home.test}
            </Button>
          )}
          <Button size="lg" className="flex-1" onClick={onStartLesson}>
            {t.home.lesson}
          </Button>
        </div>
      }
    >
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-7xl leading-none font-light tracking-[-0.04em] tabular-nums">
            {stats.learned}
          </span>
          <span className="flex-1 text-muted-foreground">{t.home.ofWords(stats.total)}</span>
          <div
            className={cn(
              'glass flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs tabular-nums',
              stats.streak > 0 ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            <FireIcon weight="fill" className="size-3.5" />
            {stats.streak}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Progress value={(stats.learned / stats.total) * 100} />
          <span className="self-end font-mono text-xs text-muted-foreground">
            {t.home.today(stats.learnedToday)}
          </span>
        </div>
        <Suspense fallback={<div className="h-36" />}>
          <PaceChart data={stats.paceSeries} />
        </Suspense>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          {
            label: t.home.accuracyWeek,
            value: stats.accuracyWeek === null ? '—' : `${stats.accuracyWeek}%`,
          },
          { label: t.home.reviewsToday, value: stats.reviewedToday },
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
        <section
          aria-label={t.home.hardWords}
          className="glass flex flex-col gap-3 rounded-3xl p-5"
        >
          {stats.hardWords.map(({ id, en, ru }) => (
            <button
              key={id}
              type="button"
              className="flex items-baseline justify-between gap-3 text-left"
              aria-pressed={revealed.has(id)}
              onClick={() => setRevealed(new Set(revealed).add(id))}
            >
              <span className="shrink-0 font-medium">{en}</span>
              <span
                className={cn(
                  'min-w-0 text-right text-sm text-muted-foreground transition-[filter]',
                  !revealed.has(id) && 'blur-[3.5px]'
                )}
              >
                {ru}
              </span>
            </button>
          ))}
        </section>
      )}

      {stats.isNewWordsPaused && (
        <p className="glass rounded-3xl px-4 py-3 text-sm text-muted-foreground">
          {t.home.newWordsPaused}
        </p>
      )}
    </ThumbLayout>
  )
}
