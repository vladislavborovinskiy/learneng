import { KeyLabel } from '@/components/key-label'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { isMistake, type AnswerResult } from '@/lib/exercises'
import { getStreak } from '@/lib/scheduler'
import type { Meta } from '@/lib/storage'
import { useHotkeys } from '@/lib/use-hotkeys'
import { cn } from '@/lib/utils'

const REPEAT_MISTAKES_ACCURACY = 70

type SessionSummaryProps = {
  results: AnswerResult[]
  learned: number
  meta: Meta
  missed: string[]
  onNextLesson: () => void
  onRepeatMistakes: () => void
  onDone: () => void
}

export function SessionSummary({
  results,
  learned,
  meta,
  missed,
  onNextLesson,
  onRepeatMistakes,
  onDone,
}: SessionSummaryProps) {
  const correct = results.filter((result) => !isMistake(result)).length
  const accuracy = results.length ? Math.round((correct / results.length) * 100) : 100
  const canRepeatMistakes = accuracy < REPEAT_MISTAKES_ACCURACY && missed.length > 0

  useHotkeys({ Enter: canRepeatMistakes ? onRepeatMistakes : onNextLesson })
  const items = [
    { label: 'точность', value: `${accuracy}%` },
    { label: 'ответов', value: results.length },
    { label: 'новых слов', value: learned },
    { label: 'дней подряд', value: getStreak(meta) },
  ]

  return (
    <ThumbLayout
      actions={
        <>
          {canRepeatMistakes && (
            <Button size="lg" onClick={onRepeatMistakes}>
              Повторить ошибки <KeyLabel>Enter</KeyLabel>
            </Button>
          )}
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={onDone}>
              На главную
            </Button>
            <Button
              size="lg"
              variant={canRepeatMistakes ? 'outline' : 'default'}
              className="flex-1"
              onClick={onNextLesson}
            >
              Ещё урок {!canRepeatMistakes && <KeyLabel>Enter</KeyLabel>}
            </Button>
          </div>
        </>
      }
    >
      <h1 className="font-display text-3xl leading-none font-black">Урок пройден</h1>
      {results.length > 0 && (
        <div
          className="grid grid-cols-6 border-t-(length:--line) border-l-(length:--line) border-foreground"
          aria-label={`Верных ответов: ${correct} из ${results.length}`}
        >
          {results.map((result, index) => (
            <div
              key={index}
              className={cn(
                'aspect-square border-r-(length:--line) border-b-(length:--line) border-foreground',
                isMistake(result) ? 'hatch' : 'bg-primary'
              )}
            />
          ))}
        </div>
      )}
      <div className="flex flex-col">
        {items.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-baseline justify-between border-b border-foreground/35 py-2.5 last:border-b-0"
          >
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-display text-2xl font-black tabular-nums">{value}</span>
          </div>
        ))}
      </div>
    </ThumbLayout>
  )
}
