import { Fire } from 'pixelarticons/react/Fire.js'
import { Trophy } from 'pixelarticons/react/Trophy.js'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
    { label: 'новых', value: stats.learned },
  ]

  return (
    <ThumbLayout
      actions={
        <Button size="lg" onClick={onDone}>
          На главную
        </Button>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <Trophy className="size-24 text-primary" />
        <h1 className="font-pixel text-3xl font-bold">Занятие завершено</h1>
        <div className="grid w-full grid-cols-3 gap-3">
          {items.map(({ label, value }) => (
            <Card key={label} size="sm">
              <CardContent>
                <div className="font-pixel text-3xl font-bold text-primary">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center gap-2 font-pixel text-xl text-primary">
          <Fire className="size-7" />
          {getStreak(meta)} дн. подряд
        </div>
      </div>
    </ThumbLayout>
  )
}
