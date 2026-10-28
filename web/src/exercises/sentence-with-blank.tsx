import type { Sentence } from '@/lib/content'

export function SentenceWithBlank({ sentence, hint }: { sentence: Sentence; hint?: string }) {
  const [before, after] = sentence.en.split(sentence.form)
  return (
    <p className="text-xl leading-relaxed">
      {before}
      <span className="glass mx-1 inline-block min-w-16 rounded-lg px-2 text-center tracking-widest text-muted-foreground">
        {hint ?? ' '}
      </span>
      {after}
    </p>
  )
}
