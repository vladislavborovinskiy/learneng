import { LightbulbIcon } from '@phosphor-icons/react/dist/csr/Lightbulb'
import { useState, type ReactNode } from 'react'
import { ScreenLabel } from '@/components/screen-label'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import {
  checkTiles,
  hintTiles,
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

const tileClassName =
  'rounded-[10px] border-2 px-3 py-2 text-base transition-colors active:bg-foreground/10'

export function Tiles({ exercise, header, feedback, onAnswer }: TilesProps) {
  const [selected, setSelected] = useState<number[]>([])
  const [hinted, setHinted] = useState(false)
  const { sentence, tiles, answer } = exercise
  const isComplete = checkTiles(
    selected.map((index) => tiles[index]),
    answer
  )

  const check = () => {
    onAnswer(withHint(isComplete ? 'correct' : 'wrong', hinted))
  }

  const takeHint = () => {
    setSelected(hintTiles(tiles, selected, answer))
    setHinted(true)
  }

  return (
    <ThumbLayout
      header={header}
      actions={
        feedback ?? (
          <>
            <div className="flex flex-wrap justify-center gap-2">
              {tiles.map((tile, index) => {
                const isUsed = selected.includes(index)
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isUsed}
                    className={cn(
                      tileClassName,
                      'border-border',
                      isUsed && 'border-dashed border-muted-foreground text-transparent'
                    )}
                    onClick={() => setSelected([...selected, index])}
                  >
                    {tile}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3">
              {!isComplete && (
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
            <Button size="lg" disabled={selected.length === 0} onClick={check}>
              Проверить
            </Button>
          </>
        )
      }
    >
      <ScreenLabel>Собери предложение</ScreenLabel>
      <p className="text-xl">{sentence.ru}</p>
      <div
        className={cn(
          'flex min-h-24 flex-wrap content-start gap-2 border-b-2 border-dashed pb-3',
          feedback && 'pointer-events-none'
        )}
      >
        {selected.map((index) => (
          <button
            key={index}
            type="button"
            className={cn(tileClassName, 'border-primary')}
            onClick={() => setSelected(selected.filter((other) => other !== index))}
          >
            {tiles[index]}
          </button>
        ))}
      </div>
    </ThumbLayout>
  )
}
