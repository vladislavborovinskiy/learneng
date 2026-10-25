import { useState } from 'react'
import { BottomBar } from '@/components/bottom-bar'
import { Button } from '@/components/ui/button'
import { checkTiles, type AnswerResult, type TilesExercise } from '@/lib/exercises'
import { cn } from '@/lib/utils'

type TilesProps = {
  exercise: TilesExercise
  onAnswer: (result: AnswerResult) => void
}

const tileClassName =
  'rounded-xl border-2 bg-card px-3 py-2 text-base shadow-[0_2px_0_var(--border)] transition-transform active:translate-y-0.5'

export function Tiles({ exercise, onAnswer }: TilesProps) {
  const [selected, setSelected] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const { sentence, tiles, answer } = exercise

  const check = () => {
    setChecked(true)
    onAnswer(
      checkTiles(
        selected.map((index) => tiles[index]),
        answer
      )
        ? 'correct'
        : 'wrong'
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm font-medium text-accent-foreground">Собери предложение</p>
      <p className="text-xl">{sentence.ru}</p>
      <div
        className={cn(
          'flex min-h-28 flex-wrap content-start gap-2 border-y py-3',
          checked && 'pointer-events-none'
        )}
      >
        {selected.map((index) => (
          <button
            key={index}
            type="button"
            className={tileClassName}
            onClick={() => setSelected(selected.filter((other) => other !== index))}
          >
            {tiles[index]}
          </button>
        ))}
      </div>
      <div className={cn('flex flex-wrap justify-center gap-2', checked && 'pointer-events-none')}>
        {tiles.map((tile, index) => {
          const isUsed = selected.includes(index)
          return (
            <button
              key={index}
              type="button"
              disabled={isUsed}
              className={cn(tileClassName, isUsed && 'bg-muted text-transparent shadow-none')}
              onClick={() => setSelected([...selected, index])}
            >
              {tile}
            </button>
          )
        })}
      </div>
      <BottomBar>
        <Button className="h-12 text-base" disabled={selected.length === 0} onClick={check}>
          Проверить
        </Button>
      </BottomBar>
    </div>
  )
}
