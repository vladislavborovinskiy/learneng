import { CheckCircleIcon } from '@phosphor-icons/react/dist/csr/CheckCircle'
import { WarningCircleIcon } from '@phosphor-icons/react/dist/csr/WarningCircle'
import { XCircleIcon } from '@phosphor-icons/react/dist/csr/XCircle'
import { BottomBar } from '@/components/bottom-bar'
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
  correct: {
    title: 'Правильно!',
    Icon: CheckCircleIcon,
    tone: 'text-success',
    panel: 'bg-[color-mix(in_oklch,var(--success)_12%,var(--card))]',
  },
  typo: {
    title: 'Почти! Есть опечатка',
    Icon: WarningCircleIcon,
    tone: 'text-orange-500',
    panel: 'bg-[color-mix(in_oklch,orange_12%,var(--card))]',
  },
  wrong: {
    title: 'Неправильно',
    Icon: XCircleIcon,
    tone: 'text-destructive',
    panel: 'bg-[color-mix(in_oklch,var(--destructive)_12%,var(--card))]',
  },
}

export function FeedbackPanel({ result, exercise, onContinue }: FeedbackPanelProps) {
  const { title, Icon, tone, panel } = variants[result]
  const { sentence } = exercise
  const correctAnswer = exercise.kind === 'tiles' ? null : exercise.answer

  return (
    <BottomBar className={cn('z-20 animate-in border-t-0 slide-in-from-bottom', panel)}>
      <div className={cn('flex items-center gap-2 text-lg font-semibold', tone)}>
        <Icon weight="fill" className="size-7" />
        {title}
      </div>
      {result !== 'correct' && correctAnswer && (
        <p>
          Ответ: <span className="font-semibold">{correctAnswer}</span>
        </p>
      )}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-base">{sentence.en}</p>
          <p className="text-sm text-muted-foreground">{sentence.ru}</p>
        </div>
        <SpeakButton text={sentence.en} />
      </div>
      <Button
        autoFocus
        className={cn(
          'h-12 text-base',
          result === 'wrong' && 'bg-destructive text-white hover:bg-destructive/80'
        )}
        onClick={onContinue}
      >
        Продолжить
      </Button>
    </BottomBar>
  )
}
