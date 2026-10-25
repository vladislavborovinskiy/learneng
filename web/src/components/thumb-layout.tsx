import type { ReactNode } from 'react'

type ThumbLayoutProps = {
  header?: ReactNode
  children: ReactNode
  actions: ReactNode
}

export function ThumbLayout({ header, children, actions }: ThumbLayoutProps) {
  return (
    <div className="mx-auto flex h-(--tg-viewport-stable-height,100dvh) max-w-md flex-col">
      {header && <header className="px-4 pt-3">{header}</header>}
      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {children}
      </main>
      <div className="flex flex-col gap-3 px-4 pb-[max(2.5rem,calc(env(safe-area-inset-bottom)+1.5rem))]">
        {actions}
      </div>
    </div>
  )
}
