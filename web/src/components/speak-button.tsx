import { SpeakerHighIcon } from '@phosphor-icons/react/dist/csr/SpeakerHigh'
import { Button } from '@/components/ui/button'
import { speak } from '@/lib/speech'

export function SpeakButton({ text }: { text: string }) {
  return (
    <Button variant="outline" size="icon-lg" aria-label="Озвучить" onClick={() => speak(text)}>
      <SpeakerHighIcon weight="bold" className="size-6" />
    </Button>
  )
}
