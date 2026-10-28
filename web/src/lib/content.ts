import wordsJson from '@content/words.json'

export type PartOfSpeech =
  'noun' | 'verb' | 'adj' | 'adv' | 'prep' | 'conj' | 'pron' | 'det' | 'phrase'

export type Sentence = {
  en: string
  ru: string
  form: string
  chunks: number[]
}

export type Word = {
  id: string
  en: string
  ru: string[]
  pos: PartOfSpeech
  source: 'it' | 'ngsl'
  topic: string | null
  rank?: number
  note: string | null
  sentences: Sentence[]
}

export const words = wordsJson as Word[]

export const wordsById = new Map(words.map((word) => [word.id, word]))

export const itWordsOrder = words.filter((word) => word.source === 'it')

export const ngslWordsOrder = words
  .filter((word) => word.source === 'ngsl')
  .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
