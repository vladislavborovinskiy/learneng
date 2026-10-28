import { LightbulbIcon } from '@phosphor-icons/react/dist/csr/Lightbulb'
import { useState, type ReactNode } from 'react'
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
import { cn } from '@/lib/utils'

type TilesProps = {
  exercise: TilesExercise
  header: ReactNode
  feedback: ReactNode
  onAnswer: (result: AnswerResult) => void
}

const tileClassName = 'rounded-[10px] border-2 px-3 py-2 text-base transition-colors'
const MISSES_BEFORE_HIGHLIGHT = 2

export function Tiles({ exercise, header, feedback, onAnswer }: TilesProps) {
  const [placed, setPlaced] = useState<number[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [misses, setMisses] = useState(0)
  const [shake, setShake] = useState({ index: -1, count: 0 })
  const [hinted, setHinted] = useState(false)
  const { sentence, tiles, answer } = exercise
  const highlighted = misses >= MISSES_BEFORE_HIGHLIGHT ? nextTileIndex(tiles, placed, answer) : -1
  const canHint = answer.length - placed.length > 1

  const place = (index: number, isHint: boolean) => {
    const nextPlaced = [...placed, index]
    setPlaced(nextPlaced)
    setMisses(0)
    if (nextPlaced.length === answer.length) {
      onAnswer(withHint(tilesResult(mistakes), hinted || isHint))
    }
  }

  const tap = (index: number) => {
    if (isSameTile(tiles[index], answer[placed.length])) return place(index, false)
    setMistakes(mistakes + 1)
    setMisses(misses + 1)
    setShake({ index, count: shake.count + 1 })
  }

  const takeHint = () => {
    setHinted(true)
    place(nextTileIndex(tiles, placed, answer), true)
  }

  return (
    <ThumbLayout
      header={header}
      actions={
        feedback ?? (
          <>
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
                      'border-border active:bg-foreground/10',
                      shake.index === index && 'animate-shake',
                      index === highlighted && 'border-primary text-primary',
                      isUsed && 'border-dashed border-muted-foreground text-transparent'
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
                <Button variant="outline" size="icon-lg" aria-label="Подсказка" onClick={takeHint}>
                  <LightbulbIcon weight="bold" className="size-6" />
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => onAnswer('forgot')}
              >
                Не помню
              </Button>
            </div>
          </>
        )
      }
    >
      <ScreenLabel>Собери предложение</ScreenLabel>
      <p className="text-xl">{sentence.ru}</p>
      <div className="flex min-h-24 flex-wrap content-start gap-2 border-b-2 border-dashed pb-3">
        {placed.map((index) => (
          <span key={index} className={cn(tileClassName, 'border-primary')}>
            {tiles[index]}
          </span>
        ))}
      </div>
    </ThumbLayout>
  )
}
