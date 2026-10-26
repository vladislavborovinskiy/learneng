import { useState, type FormEvent, type ReactNode } from 'react'
import { ScreenLabel } from '@/components/screen-label'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SentenceWithBlank } from '@/exercises/sentence-with-blank'
import { checkTyping, type AnswerResult, type TypingExercise } from '@/lib/exercises'

type TypingProps = {
  exercise: TypingExercise
  header: ReactNode
  feedback: ReactNode
  onAnswer: (result: AnswerResult) => void
}

export function Typing({ exercise, header, feedback, onAnswer }: TypingProps) {
  const [value, setValue] = useState('')
  const { word, sentence, answer } = exercise
  const hint = answer[0] + '_'.repeat(answer.length - 1)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (value.trim()) onAnswer(checkTyping(value, answer))
  }

  return (
    <ThumbLayout
      header={header}
      actions={
        feedback ?? (
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <Input
              autoFocus
              value={value}
              onChange={(event) => setValue(event.target.value)}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="done"
              className="h-14 text-lg"
              placeholder="Ответ"
            />
            <Button type="submit" size="lg" disabled={!value.trim()}>
              Проверить
            </Button>
          </form>
        )
      }
    >
      <ScreenLabel>Напиши по-английски</ScreenLabel>
      <h2 className="font-display text-2xl leading-tight font-bold">{word.ru.join(', ')}</h2>
      <div className="flex flex-col gap-2">
        <SentenceWithBlank sentence={sentence} hint={feedback ? undefined : hint} />
        <p className="text-muted-foreground">{sentence.ru}</p>
      </div>
    </ThumbLayout>
  )
}
