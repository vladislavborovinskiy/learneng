import { useState } from 'react'
import { SpeakButton } from '@/components/speak-button'
import { Button } from '@/components/ui/button'
import { SentenceWithBlank } from '@/exercises/sentence-with-blank'
import type { AnswerResult, ChoiceExercise } from '@/lib/exercises'
import { cn } from '@/lib/utils'

type ChoiceProps = {
  exercise: ChoiceExercise
  onAnswer: (result: AnswerResult) => void
}

export function Choice({ exercise, onAnswer }: ChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const { mode, word, sentence, options, answer } = exercise

  const prompts = {
    'en-ru': {
      title: 'Как переводится?',
      body: (
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-semibold">{word.en}</h2>
          <SpeakButton text={word.en} />
        </div>
      ),
    },
    'ru-en': {
      title: 'Выбери перевод',
      body: <h2 className="text-2xl font-semibold">{word.ru.join(', ')}</h2>,
    },
    'cloze': {
      title: 'Вставь пропущенное слово',
      body: (
        <div className="flex flex-col gap-2">
          <SentenceWithBlank sentence={sentence} />
          <p className="text-muted-foreground">{sentence.ru}</p>
        </div>
      ),
    },
  }

  const choose = (option: string) => {
    setSelected(option)
    onAnswer(option === answer ? 'correct' : 'wrong')
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm font-medium text-accent-foreground">{prompts[mode].title}</p>
      {prompts[mode].body}
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <Button
            key={option}
            variant="outline"
            className={cn(
              'h-auto min-h-12 justify-start border-2 bg-card py-3 text-left text-base whitespace-normal',
              selected && 'pointer-events-none',
              selected && option === answer && 'border-success bg-success/10',
              selected === option && option !== answer && 'border-destructive bg-destructive/10'
            )}
            onClick={() => choose(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  )
}
