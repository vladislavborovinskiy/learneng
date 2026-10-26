import { SpeakButton } from '@/components/speak-button'
import { Button } from '@/components/ui/button'
import type { AnswerResult, Exercise } from '@/lib/exercises'
import { cn } from '@/lib/utils'

type FeedbackPanelProps = {
  result: AnswerResult
  exercise: Exercise
  onContinue: () => void
}

const variants = {
  correct: { title: 'Правильно!', panel: 'rays', stamp: 'bg-background text-foreground' },
  typo: { title: 'Почти! Опечатка', panel: 'rays', stamp: 'bg-background text-foreground' },
  wrong: { title: 'Неправильно', panel: 'hatch', stamp: 'bg-foreground text-background' },
}

export function FeedbackPanel({ result, exercise, onContinue }: FeedbackPanelProps) {
  const { title, panel, stamp } = variants[result]
  const { sentence } = exercise
  const correctAnswer = exercise.kind === 'tiles' ? null : exercise.answer

  return (
    <>
      <div
        className={cn(
          'flex animate-in flex-col border-2 border-foreground fade-in slide-in-from-bottom-2',
          panel
        )}
      >
        <div className="flex flex-col items-start gap-2 p-3 pt-4">
          <span
            className={cn(
              'rounded-[10px] border-2 border-foreground px-3 py-1 font-display text-xl font-black',
              stamp
            )}
          >
            {title}
          </span>
          {result !== 'correct' && correctAnswer && (
            <p className="bg-background px-1 text-sm">
              Ответ: <span className="font-bold text-primary">{correctAnswer}</span>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 border-t-(length:--line) border-foreground bg-background p-3">
          <p>{sentence.en}</p>
          <p className="text-sm text-muted-foreground">{sentence.ru}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SpeakButton text={sentence.en} />
        <Button
          autoFocus
          size="lg"
          variant={result === 'wrong' ? 'outline' : 'default'}
          className="flex-1"
          onClick={onContinue}
        >
          Дальше
        </Button>
      </div>
    </>
  )
}
