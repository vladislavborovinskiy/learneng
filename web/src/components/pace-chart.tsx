import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart'
import { useStrings, type Strings } from '@/lib/i18n'

type PacePoint = { day: string; learned: number }

const axisTick = { fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }

function formatDay(day: string, t: Strings) {
  const [, month, date] = day.split('-').map(Number)
  return t.formatDay(date, t.months[month - 1])
}

type TooltipProps = {
  active?: boolean
  payload?: { payload: PacePoint }[]
}

function PaceTooltip({ active, payload }: TooltipProps) {
  const t = useStrings()
  if (!active || !payload?.length) return null
  const { day, learned } = payload[0].payload
  return (
    <div className="glass-strong rounded-xl px-3 py-1.5 font-mono text-xs text-foreground">
      {formatDay(day, t)} · +{learned}
    </div>
  )
}

export function PaceChart({ data }: { data: PacePoint[] }) {
  const t = useStrings()
  const chartConfig = useMemo(
    () =>
      ({ learned: { label: t.home.chartNewWords, color: 'var(--success)' } }) satisfies ChartConfig,
    [t]
  )
  const ticks = [
    ...new Set([data[0].day, data[Math.floor(data.length / 2)].day, data[data.length - 1].day]),
  ]
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
          tickFormatter={(day: string) => formatDay(day, t)}
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
