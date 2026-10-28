import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ThumbLayoutProps = {
  header?: ReactNode
  children: ReactNode
  actions: ReactNode
  followKeyboard?: boolean
}

export function ThumbLayout({ header, children, actions, followKeyboard }: ThumbLayoutProps) {
  return (
    <div
      className={cn(
        'mx-auto flex max-w-md flex-col',
        followKeyboard
          ? 'h-(--tg-viewport-height,100dvh)'
          : 'h-(--tg-viewport-stable-height,100dvh)'
      )}
    >
      {header && <header className="px-5 pt-4">{header}</header>}
      <main className="@container flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
        {children}
      </main>
      <div className="flex flex-col gap-2.5 px-5 pb-[max(2.5rem,calc(env(safe-area-inset-bottom)+1.5rem))]">
        {actions}
      </div>
    </div>
  )
}
