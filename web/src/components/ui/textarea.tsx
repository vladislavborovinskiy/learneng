import * as React from 'react'
import { cn } from 'cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'glass flex field-sizing-content min-h-16 w-full rounded-2xl px-4 py-3 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:glass-strong disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
