import { useState, type FormEvent } from 'react'
import { BottomBar } from '@/components/bottom-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SentenceWithBlank } from '@/exercises/sentence-with-blank'
import { checkTyping, type AnswerResult, type TypingExercise } from '@/lib/exercises'

type TypingProps = {
  exercise: TypingExercise
  onAnswer: (result: AnswerResult) => void
}

export function Typing({ exercise, onAnswer }: TypingProps) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const { word, sentence, answer } = exercise
  const hint = answer[0] + '_'.repeat(answer.length - 1)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (checked || !value.trim()) return
    setChecked(true)
    onAnswer(checkTyping(value, answer))
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={submit}>
      <p className="text-sm font-medium text-accent-foreground">Напиши слово по-английски</p>
      <h2 className="text-2xl font-semibold">{word.ru.join(', ')}</h2>
      <div className="flex flex-col gap-2">
        <SentenceWithBlank sentence={sentence} hint={hint} />
        <p className="text-muted-foreground">{sentence.ru}</p>
      </div>
      <Input
        autoFocus
        value={value}
        readOnly={checked}
        onChange={(event) => setValue(event.target.value)}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="done"
        className="h-12 bg-card text-lg"
        placeholder="Ответ"
      />
      <BottomBar>
        <Button type="submit" className="h-12 text-base" disabled={!value.trim()}>
          Проверить
        </Button>
      </BottomBar>
    </form>
  )
}
