import { LightbulbIcon } from '@phosphor-icons/react/dist/csr/Lightbulb'
import { useRef, useState, type ReactNode } from 'react'
import { KeyLabel } from '@/components/key-label'
import { ScreenLabel } from '@/components/screen-label'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { SentenceWithBlank } from '@/exercises/sentence-with-blank'
import {
  checkTyping,
  maxHintLetters,
  revealedPrefix,
  withHint,
  type AnswerResult,
  type TypingExercise,
} from '@/lib/exercises'
import { useHotkeys } from '@/lib/use-hotkeys'

type TypingProps = {
  exercise: TypingExercise
  header: ReactNode
  feedback: ReactNode
  onAnswer: (result: AnswerResult) => void
}

export function Typing({ exercise, header, feedback, onAnswer }: TypingProps) {
  const [value, setValue] = useState('')
  const [letters, setLetters] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { word, sentence, answer } = exercise
  const prefix = revealedPrefix(answer, letters)
  const [before, after] = sentence.en.split(sentence.form)
  const canHint = letters < maxHintLetters(answer)
  const placeholder = '_'.repeat(answer.length - prefix.length)

  const check = () => {
    if (value.trim()) onAnswer(withHint(checkTyping(prefix + value, answer), letters > 0))
  }

  const takeHint = () => {
    setLetters(letters + 1)
    setValue('')
    inputRef.current?.focus()
  }

  useHotkeys(
    {
      'Enter': check,
      'Shift+Enter': () => onAnswer('forgot'),
      ...(canHint && { Tab: takeHint }),
    },
    { enabled: !feedback }
  )

  return (
    <ThumbLayout
      header={header}
      followKeyboard
      actions={
        feedback ?? (
          <div className="flex gap-2.5">
            {canHint && (
              <Button
                variant="outline"
                size="icon-lg"
                aria-label="Подсказка"
                className="flex-col gap-0"
                onClick={takeHint}
              >
                <LightbulbIcon weight="bold" />
                <KeyLabel>Tab</KeyLabel>
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={() => onAnswer('forgot')}>
              Не помню <KeyLabel>⇧Enter</KeyLabel>
            </Button>
            <Button size="lg" className="flex-1" disabled={!value.trim()} onClick={check}>
              Проверить <KeyLabel>Enter</KeyLabel>
            </Button>
          </div>
        )
      }
    >
      <ScreenLabel>Напиши по-английски</ScreenLabel>
      <h2 className="text-2xl leading-snug font-light">{word.ru.join(', ')}</h2>
      <div className="flex flex-col gap-2">
        {feedback ? (
          <SentenceWithBlank sentence={sentence} />
        ) : (
          <p className="text-xl leading-relaxed">
            {before}
            <label className="glass mx-1 inline-flex items-baseline rounded-lg px-2 focus-within:glass-strong">
              <span className="whitespace-pre">{prefix}</span>
              <span className="inline-grid">
                <span
                  aria-hidden
                  className="invisible col-start-1 row-start-1 tracking-widest whitespace-pre"
                >
                  {placeholder}
                </span>
                <span
                  aria-hidden
                  className="invisible col-start-1 row-start-1 tracking-wide whitespace-pre"
                >
                  {value}
                </span>
                <input
                  ref={inputRef}
                  autoFocus
                  size={1}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  placeholder={placeholder}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  aria-label="Ответ"
                  className="col-start-1 row-start-1 w-full min-w-0 bg-transparent tracking-wide outline-none placeholder:tracking-widest placeholder:text-muted-foreground"
                />
              </span>
            </label>
            {after}
          </p>
        )}
        <p className="text-muted-foreground">{sentence.ru}</p>
      </div>
    </ThumbLayout>
  )
}
