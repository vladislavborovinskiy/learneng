import wordsJson from '@content/words.json'

export type PartOfSpeech =
  'noun' | 'verb' | 'adj' | 'adv' | 'prep' | 'conj' | 'pron' | 'det' | 'phrase' | 'phrasal-verb'

export type Sentence = {
  en: string
  ru: string
  form: string
  chunks: number[]
  parts?: [string, string]
}

export type Word = {
  id: string
  en: string
  ru: string[]
  pos: PartOfSpeech
  source: 'it' | 'ngsl' | 'phrasal'
  topic: string | null
  rank?: number
  note: string | null
  sentences: Sentence[]
}

export const words = wordsJson as Word[]

export const wordsById = new Map(words.map((word) => [word.id, word]))

export const itWordsOrder = words.filter((word) => word.source === 'it')

function byRank(source: Word['source']) {
  return words
    .filter((word) => word.source === source)
    .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
}

export const ngslWordsOrder = byRank('ngsl')

export const phrasalOrder = byRank('phrasal')
