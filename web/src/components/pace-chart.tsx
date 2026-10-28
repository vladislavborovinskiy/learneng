import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart'
import { SHORT_MONTHS } from '@/lib/scheduler'

type PacePoint = { day: string; learned: number }

const chartConfig = {
  learned: { label: 'Новые слова', color: 'var(--success)' },
} satisfies ChartConfig

const axisTick = { fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }

function formatDay(day: string) {
  const [, month, date] = day.split('-').map(Number)
  return `${date} ${SHORT_MONTHS[month - 1]}`
}

type TooltipProps = {
  active?: boolean
  payload?: { payload: PacePoint }[]
}

function PaceTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const { day, learned } = payload[0].payload
  return (
    <div className="glass-strong rounded-xl px-3 py-1.5 font-mono text-xs text-foreground">
      {formatDay(day)} · +{learned}
    </div>
  )
}

export function PaceChart({ data }: { data: PacePoint[] }) {
  const ticks = [data[0].day, data[Math.floor(data.length / 2)].day, data[data.length - 1].day]
  const lastIndex = data.length - 1

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-36 w-full [&_*]:outline-none">
      <AreaChart
        data={data}
        margin={{ top: 8, right: 20, bottom: 0, left: 0 }}
        accessibilityLayer={false}
      >
        <defs>
          <linearGradient id="pace-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-learned)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--color-learned)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--track)" strokeWidth={1} />
        <XAxis
          dataKey="day"
          ticks={ticks}
          tickFormatter={formatDay}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={axisTick}
          interval="preserveStartEnd"
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          width={24}
          tickCount={3}
          tick={axisTick}
        />
        <ChartTooltip cursor={{ stroke: 'var(--track)' }} content={<PaceTooltip />} />
        <Area
          type="monotone"
          dataKey="learned"
          stroke="var(--color-learned)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#pace-fill)"
          isAnimationActive={false}
          dot={({ index, cx, cy }) =>
            index === lastIndex ? (
              <circle key="today" cx={cx} cy={cy} r={4} fill="var(--color-learned)" />
            ) : (
              <g key={index} />
            )
          }
          activeDot={{
            r: 4,
            fill: 'var(--color-learned)',
            stroke: 'var(--background)',
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
