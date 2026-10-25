import { useState, type ReactNode } from 'react'
import { ScreenLabel } from '@/components/screen-label'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { checkTiles, type AnswerResult, type TilesExercise } from '@/lib/exercises'
import { cn } from '@/lib/utils'

type TilesProps = {
  exercise: TilesExercise
  header: ReactNode
  feedback: ReactNode
  onAnswer: (result: AnswerResult) => void
}

const tileClassName =
  'pixel-corners border-(length:--pixel) bg-card px-3 py-2 text-base transition-transform active:translate-y-0.5'

export function Tiles({ exercise, header, feedback, onAnswer }: TilesProps) {
  const [selected, setSelected] = useState<number[]>([])
  const { sentence, tiles, answer } = exercise

  const check = () => {
    const isCorrect = checkTiles(
      selected.map((index) => tiles[index]),
      answer
    )
    onAnswer(isCorrect ? 'correct' : 'wrong')
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
                      isUsed && 'bg-transparent text-transparent'
                    )}
                    onClick={() => setSelected([...selected, index])}
                  >
                    {tile}
                  </button>
                )
              })}
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
          'flex min-h-24 flex-wrap content-start gap-2 border-b-(length:--pixel) border-dashed pb-3',
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
