import type { ReactNode } from 'react'

export function ScreenLabel({ children }: { children: ReactNode }) {
  return <p className="font-pixel text-sm tracking-wide text-primary uppercase">{children}</p>
}
