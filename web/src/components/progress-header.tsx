import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useStrings } from '@/lib/i18n'
import { isTelegram } from '@/lib/telegram'

export function ProgressHeader({ value, onClose }: { value: number; onClose: () => void }) {
  const t = useStrings()

  return (
    <div className="flex items-center gap-3">
      {!isTelegram && (
        <Button variant="outline" size="icon" aria-label={t.common.close} onClick={onClose}>
          <XIcon weight="bold" />
        </Button>
      )}
      <Progress value={value} className="flex-1" />
    </div>
  )
}
