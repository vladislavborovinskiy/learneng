import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { isTelegram } from '@/lib/telegram'

export function ProgressHeader({ value, onClose }: { value: number; onClose: () => void }) {
  return (
    <div className="flex items-center gap-3">
      {!isTelegram && (
        <Button variant="ghost" size="icon-sm" aria-label="Закрыть" onClick={onClose}>
          <XIcon weight="bold" />
        </Button>
      )}
      <Progress value={value} className="flex-1" />
    </div>
  )
}
