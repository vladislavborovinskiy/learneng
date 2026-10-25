import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function BottomBar({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-10 border-t bg-card px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]',
        className
      )}
    >
      <div className="mx-auto flex max-w-md flex-col gap-3">{children}</div>
    </div>
  )
}
