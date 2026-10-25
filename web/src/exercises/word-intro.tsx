import { SpeakButton } from '@/components/speak-button'
import { BottomBar } from '@/components/bottom-bar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Word } from '@/lib/content'

type WordIntroProps = {
  word: Word
  onNext: () => void
  onKnown: () => void
}

export function WordIntro({ word, onNext, onKnown }: WordIntroProps) {
  const example = word.sentences[0]

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-accent-foreground">Новое слово</p>
      <Card>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-semibold">{word.en}</h2>
            <SpeakButton text={word.en} />
          </div>
          <p className="text-xl">{word.ru.join(', ')}</p>
          {word.note && <p className="text-sm text-muted-foreground">{word.note}</p>}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-lg">{example.en}</p>
            <SpeakButton text={example.en} />
          </div>
          <p className="text-muted-foreground">{example.ru}</p>
        </CardContent>
      </Card>
      <BottomBar>
        <Button className="h-12 text-base" onClick={onNext}>
          Дальше
        </Button>
        <Button variant="ghost" className="h-10" onClick={onKnown}>
          Уже знаю это слово
        </Button>
      </BottomBar>
    </div>
  )
}
