import { LightbulbIcon } from '@phosphor-icons/react/dist/csr/Lightbulb'
import { useState, type ReactNode } from 'react'
import { KeyLabel } from '@/components/key-label'
import { ScreenLabel } from '@/components/screen-label'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import {
  isSameTile,
  nextTileIndex,
  tilesResult,
  withHint,
  type AnswerResult,
  type TilesExercise,
} from '@/lib/exercises'
import { useHotkeys } from '@/lib/use-hotkeys'
import { cn } from '@/lib/utils'

type TilesProps = {
  exercise: TilesExercise
  header: ReactNode
  feedback: ReactNode
  onAnswer: (result: AnswerResult) => void
}

const tileClassName = 'rounded-2xl px-3.5 py-2.5 text-base transition-colors'
const MISSES_BEFORE_HIGHLIGHT = 2

export function Tiles({ exercise, header, feedback, onAnswer }: TilesProps) {
  const [placed, setPlaced] = useState<number[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [misses, setMisses] = useState(0)
  const [shake, setShake] = useState({ index: -1, count: 0 })
  const [hinted, setHinted] = useState(false)
  const [search, setSearch] = useState('')
  const { sentence, tiles, answer } = exercise
  const highlighted = misses >= MISSES_BEFORE_HIGHLIGHT ? nextTileIndex(tiles, placed, answer) : -1
  const canHint = answer.length - placed.length > 1
  const searchMatch = search
    ? tiles.findIndex(
        (tile, index) => !placed.includes(index) && tile.toLowerCase().startsWith(search)
      )
    : -1

  const place = (index: number, isHint: boolean) => {
    const nextPlaced = [...placed, index]
    setPlaced(nextPlaced)
    setMisses(0)
    if (nextPlaced.length === answer.length) {
      onAnswer(withHint(tilesResult(mistakes), hinted || isHint))
    }
  }

  const tap = (index: number) => {
    setSearch('')
    if (isSameTile(tiles[index], answer[placed.length])) return place(index, false)
    setMistakes(mistakes + 1)
    setMisses(misses + 1)
    setShake({ index, count: shake.count + 1 })
  }

  const takeHint = () => {
    setHinted(true)
    setSearch('')
    place(nextTileIndex(tiles, placed, answer), true)
  }

  useHotkeys(
    {
      'Space': () => {
        if (searchMatch !== -1) tap(searchMatch)
      },
      'Backspace': () => setSearch(search.slice(0, -1)),
      'Shift+Enter': () => onAnswer('forgot'),
      ...(canHint && { Tab: takeHint }),
    },
    { enabled: !feedback, onText: (char) => setSearch(search + char) }
  )

  return (
    <ThumbLayout
      header={header}
      actions={
        feedback ?? (
          <>
            {search && (
              <p className="text-center font-mono text-sm text-muted-foreground">
                {search}
                <KeyLabel> · Space</KeyLabel>
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              {tiles.map((tile, index) => {
                const isUsed = placed.includes(index)
                return (
                  <button
                    key={`${index}-${shake.index === index ? shake.count : 0}`}
                    type="button"
                    disabled={isUsed}
                    className={cn(
                      tileClassName,
                      'glass active:glass-strong',
                      shake.index === index && 'animate-shake',
                      index === highlighted && 'tint-success text-success',
                      index === searchMatch && 'bg-primary text-primary-foreground',
                      isUsed && 'bg-glass text-transparent opacity-40'
                    )}
                    onClick={() => tap(index)}
                  >
                    {tile}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3">
              {canHint && (
                <Button
                  variant="outline"
                  size="icon-lg"
                  aria-label="Подсказка"
                  className="flex-col gap-0"
                  onClick={takeHint}
                >
                  <LightbulbIcon weight="bold" className="size-5" />
                  <KeyLabel>Tab</KeyLabel>
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => onAnswer('forgot')}
              >
                Не помню <KeyLabel>⇧Enter</KeyLabel>
              </Button>
            </div>
          </>
        )
      }
    >
      <ScreenLabel>Собери предложение</ScreenLabel>
      <p className="text-xl leading-snug">{sentence.ru}</p>
      <div className="flex min-h-24 flex-wrap content-start gap-2">
        {placed.map((index) => (
          <span key={index} className={cn(tileClassName, 'glass-strong')}>
            {tiles[index]}
          </span>
        ))}
      </div>
    </ThumbLayout>
  )
}
