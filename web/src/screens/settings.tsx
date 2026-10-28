import { useCallback, useState } from 'react'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { ExerciseType } from '@/lib/exercises'
import {
  exportBackup,
  importBackup,
  type AnswerStats,
  type Meta,
  type Progress,
} from '@/lib/storage'
import { useBackButton } from '@/lib/telegram'

type SettingsProps = {
  progress: Progress
  meta: Meta
  stats: AnswerStats
  onRetakeLevelTest: () => void
  onExit: () => void
}

const exerciseNames: Record<ExerciseType, string> = {
  'en-ru': 'Перевод EN→RU',
  'ru-en': 'Перевод RU→EN',
  'cloze': 'Вставь слово',
  'chunks': 'Собери из кусков',
  'tiles': 'Собери из слов',
  'typing': 'Напиши слово',
}

export function Settings({ progress, meta, stats, onRetakeLevelTest, onExit }: SettingsProps) {
  const [backupOpen, setBackupOpen] = useState(false)
  const [confirmRetake, setConfirmRetake] = useState(false)
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const [backup, setBackup] = useState('')
  const [confirmImport, setConfirmImport] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const closeBackup = useCallback(() => {
    setBackupOpen(false)
    setConfirmImport(false)
    setCopyStatus(null)
    setImportError(null)
  }, [])

  useBackButton(backupOpen ? closeBackup : onExit)

  const copyBackup = () => {
    navigator.clipboard
      .writeText(exportBackup(progress, meta))
      .then(() => setCopyStatus('Скопировано'))
      .catch(() => setCopyStatus('Не удалось скопировать'))
  }

  const restoreBackup = () => {
    if (!confirmImport) return setConfirmImport(true)
    importBackup(backup.trim())
      .then(() => window.location.reload())
      .catch((error: unknown) => {
        setImportError(error instanceof Error ? error.message : String(error))
        setConfirmImport(false)
      })
  }

  const retakeLevelTest = () => {
    if (!confirmRetake) return setConfirmRetake(true)
    onRetakeLevelTest()
  }

  const accuracy = (Object.keys(exerciseNames) as ExerciseType[])
    .map((type) => {
      const [correct, total] = Object.values(stats).reduce(
        ([correctSum, totalSum], day) => {
          const [dayCorrect, dayTotal] = day[type] ?? [0, 0]
          return [correctSum + dayCorrect, totalSum + dayTotal]
        },
        [0, 0]
      )
      return { type, correct, total }
    })
    .filter(({ total }) => total > 0)

  if (backupOpen) {
    return (
      <ThumbLayout
        header={<h1 className="font-display text-2xl font-black">Резервная копия</h1>}
        actions={
          <>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={copyBackup}>
                Скопировать
              </Button>
              <Button
                variant={confirmImport ? 'destructive' : 'outline'}
                disabled={!backup.trim()}
                onClick={restoreBackup}
              >
                {confirmImport ? 'Точно?' : 'Восстановить'}
              </Button>
            </div>
            <Button size="lg" onClick={closeBackup}>
              Назад
            </Button>
          </>
        }
      >
        <Textarea
          value={backup}
          onChange={(event) => {
            setBackup(event.target.value)
            setConfirmImport(false)
            setImportError(null)
          }}
          placeholder="Вставь сюда копию из файла от бота"
          className="h-32 text-xs"
        />
        {copyStatus && <p className="text-sm text-muted-foreground">{copyStatus}</p>}
        {confirmImport && (
          <p className="text-sm text-primary">
            Текущий прогресс сотрётся. Нажми «Точно?», чтобы восстановить копию.
          </p>
        )}
        {importError && <p className="text-sm text-destructive">{importError}</p>}
      </ThumbLayout>
    )
  }

  return (
    <ThumbLayout
      header={<h1 className="font-display text-2xl font-black">Настройки</h1>}
      actions={
        <>
          <Button
            variant="ghost"
            size="sm"
            className="self-start px-0"
            onClick={() => setBackupOpen(true)}
          >
            Резервная копия →
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={retakeLevelTest}>
              {confirmRetake ? 'Точно?' : 'Тест заново'}
            </Button>
            <Button size="lg" className="flex-1" onClick={onExit}>
              Готово
            </Button>
          </div>
        </>
      }
    >
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        Прогресс хранится на сервере · копия приходит в чат с ботом каждую ночь
      </p>
      {accuracy.length > 0 && (
        <div className="flex flex-col">
          <h2 className="font-display text-lg font-bold">Точность по упражнениям</h2>
          {accuracy.map(({ type, correct, total }) => (
            <div
              key={type}
              className="flex items-baseline justify-between border-b border-foreground/35 py-2.5 last:border-b-0"
            >
              <span className="text-sm text-muted-foreground">{exerciseNames[type]}</span>
              <span className="font-display text-lg font-black tabular-nums">
                {Math.round((correct / total) * 100)}% · {total}
              </span>
            </div>
          ))}
        </div>
      )}
      {confirmRetake && (
        <p className="text-sm text-primary">
          Тест не сотрёт выученные слова, только добавит новые известные. Нажми «Точно?», чтобы
          начать.
        </p>
      )}
    </ThumbLayout>
  )
}
