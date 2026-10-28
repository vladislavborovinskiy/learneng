import { readFileSync } from 'node:fs'

const MIN_CHUNKS = 2
const MAX_CHUNKS = 4
const PER_WORD_MAX_WORDS = 3

const path = process.argv[2] ?? new URL('../content/words.json', import.meta.url)
const words = JSON.parse(readFileSync(path, 'utf8'))
const problems = []

function countOccurrences(text, part) {
  let count = 0
  for (let at = text.indexOf(part); at !== -1; at = text.indexOf(part, at + 1)) count++
  return count
}

function checkChunks(chunks, en, form) {
  const wordCount = en.split(' ').length
  const formStart = en.slice(0, en.indexOf(form)).split(' ').length - 1
  const formEnd = formStart + form.split(' ').length - 1
  if (!Array.isArray(chunks)) return 'chunks is not an array'
  if (chunks.some((start) => !Number.isInteger(start) || start < 1 || start >= wordCount)) {
    return `chunk start out of range 1..${wordCount - 1}`
  }
  if (chunks.some((start, index) => index > 0 && start <= chunks[index - 1])) {
    return 'chunk starts are not increasing'
  }
  if (
    wordCount > PER_WORD_MAX_WORDS &&
    chunks.some((start) => start > formStart && start <= formEnd)
  ) {
    return `form "${form}" is split between chunks`
  }
  if (wordCount <= PER_WORD_MAX_WORDS) {
    const perWord = Array.from({ length: wordCount - 1 }, (_, index) => index + 1)
    return chunks.join() === perWord.join() ? null : 'short sentence must be split per word'
  }
  const count = chunks.length + 1
  return count < MIN_CHUNKS || count > MAX_CHUNKS ? `${count} chunks, expected 2–4` : null
}

for (const word of words) {
  word.sentences.forEach((sentence, index) => {
    const where = `${word.id}#${index}`
    const occurrences = countOccurrences(sentence.en, sentence.form)
    if (occurrences !== 1) problems.push(`${where}: form "${sentence.form}" occurs ${occurrences}×`)
    if ('chunks' in sentence) {
      const problem = checkChunks(sentence.chunks, sentence.en, sentence.form)
      if (problem) problems.push(`${where}: ${problem} — ${sentence.en}`)
    }
  })
}

const sentenceCount = words.reduce((sum, word) => sum + word.sentences.length, 0)
const chunked = words.reduce(
  (sum, word) => sum + word.sentences.filter((sentence) => 'chunks' in sentence).length,
  0
)

for (const problem of problems) console.error(problem)
console.log(`${sentenceCount} sentences, ${chunked} with chunks, ${problems.length} problems`)
process.exit(problems.length ? 1 : 0)
