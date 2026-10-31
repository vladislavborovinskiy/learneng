import { useState } from 'react'
import levelTest from '@content/level_test.json'
import { ProgressHeader } from '@/components/progress-header'
import { ScreenLabel } from '@/components/screen-label'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { WordTitle } from '@/components/word-title'
import { words } from '@/lib/content'
import { shuffle } from '@/lib/exercises'
import { useStrings } from '@/lib/i18n'
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
  const t = useStrings()
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
      <ThumbLayout
        header={<ProgressHeader value={(index / items.length) * 100} onClose={onExit} />}
        actions={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={() => answer(false)}>
              {t.levelTest.dontKnow}
            </Button>
            <Button size="lg" onClick={() => answer(true)}>
              {t.levelTest.know}
            </Button>
          </div>
        }
      >
        <ScreenLabel>{t.levelTest.question}</ScreenLabel>
        <Card className="flex-1 justify-center">
          <CardContent className="@container text-center">
            <WordTitle text={items[index].en} />
          </CardContent>
        </Card>
      </ThumbLayout>
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
    <ThumbLayout
      actions={
        isReliable ? (
          <Button size="lg" onClick={save}>
            {t.levelTest.save}
          </Button>
        ) : (
          <Button variant="outline" size="lg" onClick={onExit}>
            {t.levelTest.later}
          </Button>
        )
      }
    >
      <ScreenLabel>{t.levelTest.result}</ScreenLabel>
      <div>
        <div className="text-5xl font-light tracking-[-0.03em] tabular-nums">≈ {estimate}</div>
        <p className="text-sm text-muted-foreground">{t.levelTest.youKnow(totalWords)}</p>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4">
          {bands.map(({ from, to, score }) => (
            <div key={from} className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>{t.levelTest.band(from, to)}</span>
                <span className="text-muted-foreground">{Math.round(score * 100)}%</span>
              </div>
              <Progress value={score * 100} />
            </div>
          ))}
        </CardContent>
      </Card>
      {falseAlarms > 0 && isReliable && (
        <p className="text-sm text-muted-foreground">
          {t.levelTest.adjusted(falseAlarms, levelTest.pseudo.length)}
        </p>
      )}
      {!isReliable && (
        <p className="text-sm text-destructive">
          {t.levelTest.unreliable(falseAlarms, levelTest.pseudo.length)}
        </p>
      )}
    </ThumbLayout>
  )
}
