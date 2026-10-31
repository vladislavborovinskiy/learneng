import type { ReactNode } from 'react'
import { KeyLabel } from '@/components/key-label'
import { ScreenLabel } from '@/components/screen-label'
import { SpeakButton } from '@/components/speak-button'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WordTitle } from '@/components/word-title'
import type { Word } from '@/lib/content'
import { useStrings } from '@/lib/i18n'
import { useHotkeys } from '@/lib/use-hotkeys'

type WordIntroProps = {
  word: Word
  header: ReactNode
  onNext: () => void
  onKnown: () => void
}

export function WordIntro({ word, header, onNext, onKnown }: WordIntroProps) {
  const t = useStrings()
  const example = word.sentences[0]

  useHotkeys({ Enter: onNext })

  return (
    <ThumbLayout
      header={header}
      actions={
        <div className="flex gap-3">
          <SpeakButton text={word.en} />
          <Button variant="outline" size="lg" onClick={onKnown}>
            {t.exercises.know}
          </Button>
          <Button size="lg" className="flex-1" onClick={onNext}>
            {t.common.next} <KeyLabel>Enter</KeyLabel>
          </Button>
        </div>
      }
    >
      <ScreenLabel>{t.exercises.newWord}</ScreenLabel>
      <Card>
        <CardContent className="@container flex flex-col gap-3">
          <WordTitle text={word.en} />
          <p className="text-xl">{word.ru.join(', ')}</p>
          {word.note && <p className="text-sm text-muted-foreground">{word.note}</p>}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-1">
          <p className="text-lg leading-relaxed">{example.en}</p>
          <p className="text-muted-foreground">{example.ru}</p>
        </CardContent>
      </Card>
    </ThumbLayout>
  )
}
