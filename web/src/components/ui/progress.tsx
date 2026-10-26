import { Progress as ProgressPrimitive } from '@base-ui/react/progress'
import { cn } from 'cn'

function Progress({ className, value, ...props }: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn('h-2.5 w-full border-(length:--line) border-foreground', className)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className={cn(
          'hatch-primary h-full border-foreground transition-[width] duration-300',
          (value ?? 0) > 0 && 'border-r-(length:--line)'
        )}
        style={{ width: `${value ?? 0}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
