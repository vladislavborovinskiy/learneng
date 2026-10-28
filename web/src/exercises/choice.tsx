import type { ReactNode } from 'react'
import { KeyLabel } from '@/components/key-label'
import { ScreenLabel } from '@/components/screen-label'
import { ThumbLayout } from '@/components/thumb-layout'
import { WordTitle } from '@/components/word-title'
import { Button } from '@/components/ui/button'
import { SentenceWithBlank } from '@/exercises/sentence-with-blank'
import type { AnswerResult, ChoiceExercise } from '@/lib/exercises'
import { useHotkeys } from '@/lib/use-hotkeys'

type ChoiceProps = {
  exercise: ChoiceExercise
  header: ReactNode
  feedback: ReactNode
  onAnswer: (result: AnswerResult) => void
}

export function Choice({ exercise, header, feedback, onAnswer }: ChoiceProps) {
  const { mode, word, sentence, options, answer } = exercise
  const choose = (option: string) => onAnswer(option === answer ? 'correct' : 'wrong')

  useHotkeys(
    {
      ...Object.fromEntries(
        options.flatMap((option, index) => [
          [`Digit${index + 1}`, () => choose(option)],
          [`Numpad${index + 1}`, () => choose(option)],
        ])
      ),
      'Shift+Enter': () => onAnswer('forgot'),
    },
    { enabled: !feedback }
  )

  const prompts = {
    'en-ru': {
      title: 'Как переводится?',
      body: <WordTitle text={word.en} />,
    },
    'ru-en': {
      title: 'Выбери перевод',
      body: <h2 className="text-2xl leading-snug font-light">{word.ru.join(', ')}</h2>,
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
          <div className="flex flex-col gap-2">
            {options.map((option, index) => (
              <Button
                key={option}
                variant="outline"
                className="h-auto min-h-13 justify-start gap-3 rounded-[18px] px-3 py-2 text-left text-base font-normal whitespace-normal"
                onClick={() => choose(option)}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-glass-strong font-mono text-xs text-muted-foreground">
                  {index + 1}
                </span>
                {option}
              </Button>
            ))}
            <Button variant="outline" size="lg" onClick={() => onAnswer('forgot')}>
              Не помню <KeyLabel>⇧Enter</KeyLabel>
            </Button>
          </div>
        )
      }
    >
      <ScreenLabel>{prompts[mode].title}</ScreenLabel>
      {prompts[mode].body}
    </ThumbLayout>
  )
}
