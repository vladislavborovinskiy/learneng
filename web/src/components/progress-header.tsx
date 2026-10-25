import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function ProgressHeader({ value, onClose }: { value: number; onClose: () => void }) {
  return (
    <header className="flex items-center gap-3 py-2">
      <Button variant="ghost" size="icon" aria-label="Закрыть" onClick={onClose}>
        <XIcon className="size-5" />
      </Button>
      <Progress value={value} className="flex-1" />
    </header>
  )
}
