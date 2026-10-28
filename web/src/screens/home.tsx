import { FlameIcon } from '@phosphor-icons/react/dist/csr/Flame'
import { GearSixIcon } from '@phosphor-icons/react/dist/csr/GearSix'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PAUSE_NEW_WORDS_AT, type getStats } from '@/lib/scheduler'
import { cn } from '@/lib/utils'

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
          <h1 className="font-display text-2xl font-black">LearnEng</h1>
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-full border-(length:--line) border-foreground px-3 py-1 font-mono text-sm font-bold',
              stats.streak === 0 && 'text-muted-foreground'
            )}
          >
            <FlameIcon weight="fill" className={cn('size-4', stats.streak > 0 && 'text-primary')} />
            {stats.streak} дн.
          </div>
        </div>
      }
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon-lg" aria-label="Настройки" onClick={onOpenSettings}>
            <GearSixIcon weight="bold" className="size-6" />
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
      <div className="flex flex-col gap-3 border-(length:--line) border-foreground p-3">
        <h2 className="font-display text-2xl leading-tight font-black">
          Выучено {stats.learned} из {stats.total}
        </h2>
        <Progress value={(stats.learned / stats.total) * 100} />
        <div className="flex flex-col gap-1 font-mono text-xs tracking-wide text-muted-foreground">
          <span>ещё не начато: {stats.unstarted}</span>
          {stats.unstarted > 0 && (
            <span>
              {stats.finishDate
                ? `при темпе ~${stats.pace.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} в день — до ${stats.finishDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`
                : 'начни урок, чтобы увидеть прогноз'}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 border-(length:--line) border-foreground">
        {[
          { label: 'выучено сегодня', value: stats.learnedToday, accent: true },
          { label: 'уроков сегодня', value: stats.lessonsToday, accent: false },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            className="flex flex-col gap-1 px-3 pt-4 pb-3 not-first:border-l-(length:--line) not-first:border-foreground"
          >
            <span
              className={cn(
                'font-display text-5xl leading-none font-black tabular-nums',
                accent && 'text-primary'
              )}
            >
              {value}
            </span>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {stats.isNewWordsPaused && (
        <p className="hatch border-(length:--line) border-foreground p-3 text-sm">
          Накопилось {stats.due} повторений — новые слова вернутся, когда их станет меньше{' '}
          {PAUSE_NEW_WORDS_AT}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {[
          { label: 'IT-словарь', ...stats.it },
          { label: 'Частотные слова', ...stats.ngsl },
        ].map(({ label, learned, total }) => (
          <div key={label} className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>{label}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {learned} / {total}
              </span>
            </div>
            <Progress value={(learned / total) * 100} />
          </div>
        ))}
      </div>

      {!levelTestDone && (
        <p className="text-sm text-muted-foreground">
          Пройди тест уровня: отметь знакомые слова, и они не попадут в изучение как новые.
        </p>
      )}
    </ThumbLayout>
  )
}
