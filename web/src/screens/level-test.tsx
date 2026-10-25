import { useState } from 'react'
import levelTest from '@content/level_test.json'
import { BottomBar } from '@/components/bottom-bar'
import { ProgressHeader } from '@/components/progress-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { words } from '@/lib/content'
import { shuffle } from '@/lib/exercises'
import { useBackButton } from '@/lib/telegram'

type LevelTestProps = {
  markKnown: (wordIds: string[]) => void
  onFinish: () => void
  onExit: () => void
}

type TestItem = {
  en: string
  rank: number | null
}

const FIRST_BAND_KNOWN_THRESHOLD = 0.85
const MAX_RELIABLE_FALSE_ALARM_RATE = 1 / 3

export function LevelTest({ markKnown, onFinish, onExit }: LevelTestProps) {
  const [items] = useState<TestItem[]>(() =>
    shuffle([...levelTest.words, ...levelTest.pseudo.map((en) => ({ en, rank: null }))])
  )
  const [known, setKnown] = useState<TestItem[]>([])
  const [index, setIndex] = useState(0)

  useBackButton(onExit)

  if (index < items.length) {
    const answer = (isKnown: boolean) => {
      if (isKnown) setKnown([...known, items[index]])
      setIndex(index + 1)
    }

    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 p-4 pb-32">
        <ProgressHeader value={(index / items.length) * 100} onClose={onExit} />
        <p className="text-sm font-medium text-accent-foreground">Знаешь это слово?</p>
        <div className="grid flex-1 place-items-center">
          <h2 className="text-4xl font-semibold">{items[index].en}</h2>
        </div>
        <BottomBar>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 text-base" onClick={() => answer(false)}>
              Не знаю
            </Button>
            <Button className="h-12 text-base" onClick={() => answer(true)}>
              Знаю
            </Button>
          </div>
        </BottomBar>
      </main>
    )
  }

  const falseAlarms = known.filter((item) => item.rank === null).length
  const falseAlarmRate = falseAlarms / levelTest.pseudo.length
  const isReliable = falseAlarmRate <= MAX_RELIABLE_FALSE_ALARM_RATE
  const bands = levelTest.bands.map(([from, to]) => {
    const bandWords = levelTest.words.filter((word) => word.rank >= from && word.rank <= to)
    const hits = known.filter((item) => item.rank !== null && item.rank >= from && item.rank <= to)
    const hitRate = hits.length / bandWords.length
    const score =
      falseAlarmRate >= 1 ? 0 : Math.max(0, (hitRate - falseAlarmRate) / (1 - falseAlarmRate))
    return { from, to, score }
  })
  const estimate = Math.round(
    bands.reduce((sum, band) => sum + band.score * (band.to - band.from + 1), 0)
  )
  const totalWords = levelTest.bands.at(-1)![1]

  const save = () => {
    const knownIds = new Set(known.map((item) => item.en.toLowerCase()))
    const firstBand = bands[0]
    const deckIds = words
      .filter(
        (word) =>
          knownIds.has(word.id) ||
          (firstBand.score >= FIRST_BAND_KNOWN_THRESHOLD &&
            word.source === 'ngsl' &&
            (word.rank ?? Infinity) <= firstBand.to)
      )
      .map((word) => word.id)
    markKnown(deckIds)
    onFinish()
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 p-4 pb-32">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">≈ {estimate} слов</CardTitle>
          <CardDescription>
            из {totalWords} самых частых слов английского ты знаешь примерно столько
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {bands.map(({ from, to, score }) => (
            <div key={from} className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>
                  Слова {from}–{to}
                </span>
                <span className="text-muted-foreground">{Math.round(score * 100)}%</span>
              </div>
              <Progress value={score * 100} />
            </div>
          ))}
          {falseAlarms > 0 && isReliable && (
            <p className="text-sm text-muted-foreground">
              Ты отметил несуществующих слов: {falseAlarms} из {levelTest.pseudo.length}. Оценка
              скорректирована с учётом этого.
            </p>
          )}
          {!isReliable && (
            <p className="text-sm text-destructive">
              Ты отметил несуществующих слов: {falseAlarms} из {levelTest.pseudo.length}. Результат
              ненадёжный, поэтому слова не будут помечены как известные. Попробуй пройти тест ещё
              раз и отмечай «Знаю», только если точно помнишь перевод.
            </p>
          )}
        </CardContent>
      </Card>
      <BottomBar>
        {isReliable ? (
          <Button className="h-12 text-base" onClick={save}>
            Сохранить результат
          </Button>
        ) : (
          <Button variant="outline" className="h-12 text-base" onClick={onExit}>
            Пройти позже
          </Button>
        )}
      </BottomBar>
    </main>
  )
}
