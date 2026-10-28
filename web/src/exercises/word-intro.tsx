import type { ReactNode } from 'react'
import { KeyLabel } from '@/components/key-label'
import { ScreenLabel } from '@/components/screen-label'
import { SpeakButton } from '@/components/speak-button'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Word } from '@/lib/content'
import { useHotkeys } from '@/lib/use-hotkeys'

type WordIntroProps = {
  word: Word
  header: ReactNode
  onNext: () => void
  onKnown: () => void
}

export function WordIntro({ word, header, onNext, onKnown }: WordIntroProps) {
  const example = word.sentences[0]

  useHotkeys({ Enter: onNext })

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
            Дальше <KeyLabel>Enter</KeyLabel>
          </Button>
        </div>
      }
    >
      <ScreenLabel>Новое слово</ScreenLabel>
      <Card className="halftone">
        <CardContent className="flex flex-col gap-3">
          <h2 className="font-display text-5xl leading-none font-black">{word.en}</h2>
          <p className="text-xl font-medium">{word.ru.join(', ')}</p>
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
