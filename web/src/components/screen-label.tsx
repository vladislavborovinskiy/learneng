import type { ReactNode } from 'react'

export function ScreenLabel({ children }: { children: ReactNode }) {
  return (
    <p className="self-start rounded-[10px] border-2 border-foreground px-2.5 py-1 font-display text-sm font-bold">
      {children}
    </p>
  )
}
