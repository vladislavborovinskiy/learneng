export function KeyLabel({ children }: { children: string }) {
  return (
    <kbd className="hidden font-mono text-[10px] font-normal tracking-wide opacity-70 pointer-fine:inline">
      {children}
    </kbd>
  )
}
