import { KeyLabel } from '@/components/key-label'
import { SpeakButton } from '@/components/speak-button'
import { Button } from '@/components/ui/button'
import type { AnswerResult, Exercise } from '@/lib/exercises'
import { useStrings } from '@/lib/i18n'
import { useHotkeys } from '@/lib/use-hotkeys'
import { cn } from '@/lib/utils'

type FeedbackPanelProps = {
  result: AnswerResult
  exercise: Exercise
  onContinue: () => void
}

const toneByResult = {
  correct: 'text-success',
  hinted: 'text-success',
  typo: 'text-warning',
  forgot: 'text-warning',
  wrong: 'text-destructive',
} satisfies Record<AnswerResult, string>

const tintByResult = {
  correct: 'tint-success',
  hinted: 'tint-success',
  typo: 'tint-warning',
  forgot: 'tint-warning',
  wrong: 'tint-destructive',
} satisfies Record<AnswerResult, string>

export function FeedbackPanel({ result, exercise, onContinue }: FeedbackPanelProps) {
  const t = useStrings()
  const title =
    exercise.kind === 'tiles' && result === 'typo'
      ? t.feedback.tilesTypo
      : t.feedback.titles[result]
  const { word, sentence } = exercise
  const correctAnswer = exercise.kind === 'tiles' ? null : exercise.answer
  const [before, after] = sentence.en.split(sentence.form)
  const tone = toneByResult[result]

  useHotkeys({ Enter: onContinue })

  return (
    <>
      <div
        className={cn(
          'flex animate-in flex-col gap-3 rounded-3xl p-4 fade-in slide-in-from-bottom-2',
          tintByResult[result]
        )}
      >
        <p className={cn('text-lg font-medium', tone)}>{title}</p>
        {result === 'forgot' && (
          <p>
            <span className={cn('font-medium', tone)}>{word.en}</span> — {word.ru.join(', ')}
          </p>
        )}
        {result !== 'correct' && result !== 'forgot' && correctAnswer && (
          <p className="text-sm">
            {t.feedback.answer} <span className={cn('font-medium', tone)}>{correctAnswer}</span>
          </p>
        )}
        <div className="flex flex-col gap-1">
          <p className="leading-relaxed">
            {before}
            <span className={cn('font-medium', tone)}>{sentence.form}</span>
            {after}
          </p>
          <p className="text-sm text-muted-foreground">{sentence.ru}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SpeakButton text={sentence.en} />
        <Button autoFocus size="lg" className="flex-1" onClick={onContinue}>
          {t.common.next} <KeyLabel>Enter</KeyLabel>
        </Button>
      </div>
    </>
  )
}
