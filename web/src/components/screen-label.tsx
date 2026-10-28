import type { ReactNode } from 'react'

export function ScreenLabel({ children }: { children: ReactNode }) {
  return (
    <p className="glass self-start rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
      {children}
    </p>
  )
}
