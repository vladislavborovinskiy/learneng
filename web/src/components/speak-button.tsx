import { SpeakerHighIcon } from '@phosphor-icons/react/dist/csr/SpeakerHigh'
import { Button } from '@/components/ui/button'
import { speak } from '@/lib/speech'

export function SpeakButton({ text }: { text: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="shrink-0 text-accent-foreground"
      aria-label="Озвучить"
      onClick={() => speak(text)}
    >
      <SpeakerHighIcon className="size-5" />
    </Button>
  )
}
