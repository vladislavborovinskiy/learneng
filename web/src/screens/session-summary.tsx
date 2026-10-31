import { KeyLabel } from '@/components/key-label'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { isMistake, type AnswerResult } from '@/lib/exercises'
import { useStrings } from '@/lib/i18n'
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
  const t = useStrings()
  const canRepeatMistakes = accuracy < REPEAT_MISTAKES_ACCURACY && missed.length > 0

  useHotkeys({ Enter: canRepeatMistakes ? onRepeatMistakes : onNextLesson })
  const items = [
    { label: t.summary.accuracy, value: `${accuracy}%` },
    { label: t.summary.answers, value: results.length },
    { label: t.summary.newWords, value: learned },
    { label: t.summary.streak, value: getStreak(meta) },
  ]

  return (
    <ThumbLayout
      actions={
        <>
          {canRepeatMistakes && (
            <Button size="lg" onClick={onRepeatMistakes}>
              {t.summary.repeatMistakes} <KeyLabel>Enter</KeyLabel>
            </Button>
          )}
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={onDone}>
              {t.summary.home}
            </Button>
            <Button
              size="lg"
              variant={canRepeatMistakes ? 'outline' : 'default'}
              className="flex-1"
              onClick={onNextLesson}
            >
              {t.summary.nextLesson} {!canRepeatMistakes && <KeyLabel>Enter</KeyLabel>}
            </Button>
          </div>
        </>
      }
    >
      <h1 className="text-3xl leading-none font-light tracking-[-0.02em]">{t.summary.title}</h1>
      {results.length > 0 && (
        <div
          className="grid grid-cols-8 gap-1.5"
          aria-label={t.summary.correctOf(correct, results.length)}
        >
          {results.map((result, index) => (
            <div
              key={index}
              className={cn(
                'aspect-square rounded-lg',
                isMistake(result) ? 'bg-destructive' : 'bg-success'
              )}
            />
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2.5">
        {items.map(({ label, value }) => (
          <div key={label} className="glass flex flex-col gap-2 rounded-3xl p-4">
            <span className="text-3xl leading-none font-light tracking-[-0.03em] tabular-nums">
              {value}
            </span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </ThumbLayout>
  )
}
