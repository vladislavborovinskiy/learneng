import { Check } from 'pixelarticons/react/Check.js'
import { Close } from 'pixelarticons/react/Close.js'
import { Zap } from 'pixelarticons/react/Zap.js'
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
  correct: { title: 'Правильно!', Icon: Check, tone: 'text-success border-success' },
  typo: { title: 'Почти! Опечатка', Icon: Zap, tone: 'text-warning border-warning' },
  wrong: { title: 'Неправильно', Icon: Close, tone: 'text-destructive border-destructive' },
}

export function FeedbackPanel({ result, exercise, onContinue }: FeedbackPanelProps) {
  const { title, Icon, tone } = variants[result]
  const { sentence } = exercise
  const correctAnswer = exercise.kind === 'tiles' ? null : exercise.answer

  return (
    <>
      <div
        className={cn(
          'pixel-corners flex animate-in flex-col gap-2 border-(length:--pixel) bg-card p-3 fade-in slide-in-from-bottom-2',
          tone
        )}
      >
        <div className="flex items-center gap-2 font-pixel text-xl font-bold">
          <Icon className="size-6" />
          {title}
        </div>
        {result !== 'correct' && correctAnswer && (
          <p className="text-foreground">
            Ответ: <span className="font-semibold text-primary">{correctAnswer}</span>
          </p>
        )}
        <p className="text-foreground">{sentence.en}</p>
        <p className="text-sm text-muted-foreground">{sentence.ru}</p>
      </div>
      <div className="flex gap-3">
        <SpeakButton text={sentence.en} />
        <Button
          autoFocus
          size="lg"
          variant={result === 'wrong' ? 'destructive' : 'default'}
          className="flex-1"
          onClick={onContinue}
        >
          Дальше
        </Button>
      </div>
    </>
  )
}
