import type { CSSProperties } from 'react'

const MAX_SIZE = '3.6rem'
const CHAR_WIDTH_EM = 0.66

export function WordTitle({ text }: { text: string }) {
  const longest = Math.max(...text.split(' ').map((part) => part.length))
  const style = {
    fontSize: `min(${MAX_SIZE}, calc(100cqi / ${longest * CHAR_WIDTH_EM}))`,
  } satisfies CSSProperties

  return (
    <h2
      className="leading-[1.05] font-medium tracking-[-0.03em] text-balance wrap-anywhere"
      style={style}
    >
      {text}
    </h2>
  )
}
