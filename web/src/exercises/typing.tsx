import { LightbulbIcon } from '@phosphor-icons/react/dist/csr/Lightbulb'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ScreenLabel } from '@/components/screen-label'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SentenceWithBlank } from '@/exercises/sentence-with-blank'
import {
  checkTyping,
  maxHintLetters,
  revealedPrefix,
  withHint,
  type AnswerResult,
  type TypingExercise,
} from '@/lib/exercises'

type TypingProps = {
  exercise: TypingExercise
  header: ReactNode
  feedback: ReactNode
  onAnswer: (result: AnswerResult) => void
}

export function Typing({ exercise, header, feedback, onAnswer }: TypingProps) {
  const [value, setValue] = useState('')
  const [letters, setLetters] = useState(1)
  const inputRef = useRef<HTMLInputElement>(null)
  const { word, sentence, answer } = exercise
  const prefix = revealedPrefix(answer, letters)
  const hint = prefix + '_'.repeat(answer.length - prefix.length)
  const canHint = letters < maxHintLetters(answer)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (value.trim()) onAnswer(withHint(checkTyping(prefix + value, answer), letters > 1))
  }

  const takeHint = () => {
    setLetters(letters + 1)
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <ThumbLayout
      header={header}
      actions={
        feedback ?? (
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <label className="flex h-14 items-center border-2 border-input px-3 text-lg transition-colors focus-within:border-ring">
              <span className="whitespace-pre">{prefix}</span>
              <Input
                ref={inputRef}
                autoFocus
                value={value}
                onChange={(event) => setValue(event.target.value)}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="done"
                className="h-full border-0 px-0 text-lg"
                aria-label="Ответ"
              />
            </label>
            <div className="flex gap-3">
              {canHint && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  aria-label="Подсказка"
                  onClick={takeHint}
                >
                  <LightbulbIcon weight="bold" className="size-6" />
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => onAnswer('forgot')}
              >
                Не помню
              </Button>
            </div>
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
