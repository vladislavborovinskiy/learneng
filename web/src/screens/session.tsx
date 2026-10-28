import { useState } from 'react'
import type { Grade } from 'ts-fsrs'
import { ProgressHeader } from '@/components/progress-header'
import { Choice } from '@/exercises/choice'
import { FeedbackPanel } from '@/exercises/feedback-panel'
import { Tiles } from '@/exercises/tiles'
import { Typing } from '@/exercises/typing'
import { WordIntro } from '@/exercises/word-intro'
import { wordsById } from '@/lib/content'
import {
  buildExercise,
  exerciseType,
  gradeByResult,
  isMistake,
  shuffle,
  type AnswerResult,
  type Exercise,
  type ExerciseType,
} from '@/lib/exercises'
import { buildLesson, type LessonItem } from '@/lib/scheduler'
import type { Meta, Progress } from '@/lib/storage'
import { haptic, useBackButton } from '@/lib/telegram'
import { SessionSummary } from '@/screens/session-summary'

type SessionProps = {
  progress: Progress
  meta: Meta
  grade: (wordId: string, rating: Grade) => void
  markKnown: (wordIds: string[]) => void
  recordAnswer: (type: ExerciseType, isCorrect: boolean) => void
  onComplete: () => void
  onNextLesson: () => void
  onExit: () => void
}

const REQUEUE_GAP = 4

const hapticByResult = {
  correct: 'success',
  hinted: 'success',
  typo: 'warning',
  wrong: 'error',
  forgot: 'warning',
} as const satisfies Record<AnswerResult, Parameters<typeof haptic>[0]>

function exerciseFor(item: LessonItem | undefined, progress: Progress) {
  if (!item || item.intro) return null
  return buildExercise(wordsById.get(item.wordId)!, progress[item.wordId])
}

export function Session({
  progress,
  meta,
  grade,
  markKnown,
  recordAnswer,
  onComplete,
  onNextLesson,
  onExit,
}: SessionProps) {
  const [queue, setQueue] = useState<LessonItem[]>(() => buildLesson(progress))
  const [index, setIndex] = useState(0)
  const [exercise, setExercise] = useState<Exercise | null>(() => exerciseFor(queue[0], progress))
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [results, setResults] = useState<AnswerResult[]>([])
  const [learned, setLearned] = useState(0)
  const [introduced, setIntroduced] = useState<string[]>([])
  const [finalRoundAdded, setFinalRoundAdded] = useState(false)

  useBackButton(onExit)

  const item = queue[index]

  if (!item) {
    return (
      <SessionSummary
        results={results}
        learned={learned}
        meta={meta}
        onNextLesson={onNextLesson}
        onDone={onExit}
      />
    )
  }

  const word = wordsById.get(item.wordId)!

  const advance = () => {
    const nextIndex = index + 1
    let nextQueue = queue
    if (nextIndex >= queue.length && !finalRoundAdded && introduced.length > 0) {
      nextQueue = [...queue, ...shuffle(introduced).map((wordId) => ({ wordId, intro: false }))]
      setQueue(nextQueue)
      setFinalRoundAdded(true)
    }
    if (nextIndex >= nextQueue.length) onComplete()
    setIndex(nextIndex)
    setExercise(exerciseFor(nextQueue[nextIndex], progress))
    setResult(null)
  }

  const handleKnown = () => {
    markKnown([item.wordId])
    setLearned(learned + 1)
    advance()
  }

  const handleIntroNext = () => {
    setExercise(buildExercise(word, progress[item.wordId]))
    setLearned(learned + 1)
    setIntroduced([...introduced, item.wordId])
  }

  const handleAnswer = (answer: AnswerResult) => {
    grade(item.wordId, gradeByResult[answer])
    if (exercise) recordAnswer(exerciseType(exercise), !isMistake(answer))
    setResult(answer)
    setResults([...results, answer])
    haptic(hapticByResult[answer])
    if (isMistake(answer)) {
      const retry = { wordId: item.wordId, intro: false }
      setQueue(queue.toSpliced(index + REQUEUE_GAP, 0, retry))
    }
  }

  const header = <ProgressHeader value={(index / queue.length) * 100} onClose={onExit} />

  if (!exercise) {
    return <WordIntro word={word} header={header} onNext={handleIntroNext} onKnown={handleKnown} />
  }

  const props = {
    header,
    feedback: result && <FeedbackPanel result={result} exercise={exercise} onContinue={advance} />,
    onAnswer: handleAnswer,
  }

  switch (exercise.kind) {
    case 'choice':
      return <Choice key={index} {...props} exercise={exercise} />
    case 'tiles':
      return <Tiles key={index} {...props} exercise={exercise} />
    case 'typing':
      return <Typing key={index} {...props} exercise={exercise} />
  }
}
