import { useEffect, useRef } from 'react'

type HotkeyOptions = {
  enabled?: boolean
  onText?: (char: string) => void
}

function textFromCode(code: string) {
  if (/^Key[A-Z]$/.test(code)) return code.slice(3).toLowerCase()
  if (/^Digit\d$/.test(code)) return code.slice(5)
  return null
}

export function useHotkeys(
  bindings: Record<string, () => void>,
  { enabled = true, onText }: HotkeyOptions = {}
) {
  const handlersRef = useRef({ bindings, onText })

  useEffect(() => {
    handlersRef.current = { bindings, onText }
  })

  useEffect(() => {
    if (!enabled) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return
      const { bindings, onText } = handlersRef.current
      const action = bindings[(event.shiftKey ? 'Shift+' : '') + event.code]
      const text = event.shiftKey ? null : textFromCode(event.code)
      const handle = action ?? (onText && text ? () => onText(text) : null)
      if (!handle) return
      event.preventDefault()
      event.stopPropagation()
      handle()
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [enabled])
}
