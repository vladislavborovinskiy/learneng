import { Volume2 } from 'pixelarticons/react/Volume2.js'
import { Button } from '@/components/ui/button'
import { speak } from '@/lib/speech'

export function SpeakButton({ text }: { text: string }) {
  return (
    <Button variant="outline" size="icon-lg" aria-label="Озвучить" onClick={() => speak(text)}>
      <Volume2 className="size-7" />
    </Button>
  )
}
