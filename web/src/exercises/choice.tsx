import type { ReactNode } from 'react'
import { ScreenLabel } from '@/components/screen-label'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { SentenceWithBlank } from '@/exercises/sentence-with-blank'
import type { AnswerResult, ChoiceExercise } from '@/lib/exercises'

type ChoiceProps = {
  exercise: ChoiceExercise
  header: ReactNode
  feedback: ReactNode
  onAnswer: (result: AnswerResult) => void
}

export function Choice({ exercise, header, feedback, onAnswer }: ChoiceProps) {
  const { mode, word, sentence, options, answer } = exercise

  const prompts = {
    'en-ru': {
      title: 'Как переводится?',
      body: <h2 className="font-pixel text-4xl font-bold text-primary">{word.en}</h2>,
    },
    'ru-en': {
      title: 'Выбери перевод',
      body: <h2 className="text-2xl font-semibold">{word.ru.join(', ')}</h2>,
    },
    'cloze': {
      title: 'Вставь слово',
      body: (
        <div className="flex flex-col gap-2">
          <SentenceWithBlank sentence={sentence} />
          <p className="text-muted-foreground">{sentence.ru}</p>
        </div>
      ),
    },
  }

  return (
    <ThumbLayout
      header={header}
      actions={
        feedback ?? (
          <div className="grid grid-cols-2 gap-3">
            {options.map((option) => (
              <Button
                key={option}
                variant="outline"
                className="h-auto min-h-16 px-3 py-2 font-sans text-base font-normal whitespace-normal"
                onClick={() => onAnswer(option === answer ? 'correct' : 'wrong')}
              >
                {option}
              </Button>
            ))}
          </div>
        )
      }
    >
      <ScreenLabel>{prompts[mode].title}</ScreenLabel>
      {prompts[mode].body}
    </ThumbLayout>
  )
}
