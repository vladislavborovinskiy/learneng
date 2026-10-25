import { Progress as ProgressPrimitive } from '@base-ui/react/progress'
import { cn } from 'cn'

function Progress({
  className,
  value,
  segments = 12,
  ...props
}: ProgressPrimitive.Root.Props & { segments?: number }) {
  const filled = Math.round(((value ?? 0) / 100) * segments)
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn('flex w-full gap-1', className)}
      {...props}
    >
      {Array.from({ length: segments }, (_, index) => (
        <div
          key={index}
          data-slot="progress-segment"
          className={cn('h-2.5 flex-1', index < filled ? 'bg-primary' : 'bg-foreground/10')}
        />
      ))}
    </ProgressPrimitive.Root>
  )
}

export { Progress }
