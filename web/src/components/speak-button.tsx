import { SpeakerHighIcon } from '@phosphor-icons/react/dist/csr/SpeakerHigh'
import { Button } from '@/components/ui/button'
import { useStrings } from '@/lib/i18n'
import { speak } from '@/lib/speech'

export function SpeakButton({ text }: { text: string }) {
  const t = useStrings()

  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label={t.common.listen}
      onClick={() => speak(text)}
    >
      <SpeakerHighIcon weight="bold" className="size-5" />
    </Button>
  )
}
