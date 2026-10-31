import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type ThumbLayoutProps = {
  header?: ReactNode
  children: ReactNode
  actions: ReactNode
  followKeyboard?: boolean
}

export function ThumbLayout({ header, children, actions, followKeyboard }: ThumbLayoutProps) {
  const actionsRef = useRef<HTMLDivElement>(null)
  const [actionsHeight, setActionsHeight] = useState(0)

  useLayoutEffect(() => {
    const element = actionsRef.current
    if (!element) return
    const observer = new ResizeObserver(() => setActionsHeight(element.offsetHeight))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={cn(
        'relative mx-auto flex max-w-md flex-col',
        followKeyboard
          ? 'h-(--tg-viewport-height,100dvh)'
          : 'h-(--tg-viewport-stable-height,100dvh)'
      )}
    >
      {header && <header className="px-5 pt-4">{header}</header>}
      <main
        style={{ paddingBottom: actionsHeight }}
        className="@container flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pt-4"
      >
        {children}
      </main>
      <div
        ref={actionsRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2.5 bg-linear-to-t from-background/80 via-background/60 to-transparent px-5 pt-10 pb-[max(2.5rem,calc(env(safe-area-inset-bottom)+1.5rem))] *:pointer-events-auto"
      >
        {actions}
      </div>
    </div>
  )
}
