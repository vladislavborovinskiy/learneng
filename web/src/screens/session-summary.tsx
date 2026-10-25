import { FireIcon } from '@phosphor-icons/react/dist/csr/Fire'
import { TrophyIcon } from '@phosphor-icons/react/dist/csr/Trophy'
import { BottomBar } from '@/components/bottom-bar'
import { Button } from '@/components/ui/button'
import { getStreak } from '@/lib/scheduler'
import type { Meta } from '@/lib/storage'

type SessionSummaryProps = {
  stats: { answered: number; correct: number; learned: number }
  meta: Meta
  onDone: () => void
}

export function SessionSummary({ stats, meta, onDone }: SessionSummaryProps) {
  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 100
  const items = [
    { label: 'точность', value: `${accuracy}%` },
    { label: 'ответов', value: stats.answered },
    { label: 'новых слов', value: stats.learned },
  ]

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-6 p-4 pb-32 text-center">
      <TrophyIcon weight="fill" className="size-20 text-amber-400" />
      <h1 className="text-2xl font-semibold">Занятие завершено</h1>
      <div className="grid w-full grid-cols-3 gap-3">
        {items.map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-card p-3">
            <div className="text-2xl font-semibold">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-lg font-medium">
        <FireIcon weight="fill" className="size-6 text-orange-500" />
        {getStreak(meta)} дн. подряд
      </div>
      <BottomBar>
        <Button className="h-12 text-base" onClick={onDone}>
          На главную
        </Button>
      </BottomBar>
    </main>
  )
}
