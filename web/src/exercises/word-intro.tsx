import type { ReactNode } from 'react'
import { ScreenLabel } from '@/components/screen-label'
import { SpeakButton } from '@/components/speak-button'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Word } from '@/lib/content'

type WordIntroProps = {
  word: Word
  header: ReactNode
  onNext: () => void
  onKnown: () => void
}

export function WordIntro({ word, header, onNext, onKnown }: WordIntroProps) {
  const example = word.sentences[0]

  return (
    <ThumbLayout
      header={header}
      actions={
        <div className="flex gap-3">
          <SpeakButton text={word.en} />
          <Button variant="outline" size="lg" onClick={onKnown}>
            Знаю
          </Button>
          <Button size="lg" className="flex-1" onClick={onNext}>
            Дальше
          </Button>
        </div>
      }
    >
      <ScreenLabel>Новое слово</ScreenLabel>
      <Card className="stripes">
        <CardContent className="flex flex-col gap-3">
          <h2 className="font-pixel text-4xl font-bold text-primary">{word.en}</h2>
          <p className="text-xl">{word.ru.join(', ')}</p>
          {word.note && <p className="text-sm text-muted-foreground">{word.note}</p>}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-1">
          <p className="text-lg">{example.en}</p>
          <p className="text-muted-foreground">{example.ru}</p>
        </CardContent>
      </Card>
    </ThumbLayout>
  )
}
