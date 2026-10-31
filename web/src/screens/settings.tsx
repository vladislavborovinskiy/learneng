import { FloppyDiskIcon } from '@phosphor-icons/react/dist/csr/FloppyDisk'
import { useCallback, useState } from 'react'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { ExerciseType } from '@/lib/exercises'
import { strings, useStrings, type Language } from '@/lib/i18n'
import {
  BackupError,
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
  onLanguageChange: (language: Language) => void
  onExit: () => void
}

const languages = Object.keys(strings) as Language[]

export function Settings({
  progress,
  meta,
  stats,
  onRetakeLevelTest,
  onLanguageChange,
  onExit,
}: SettingsProps) {
  const t = useStrings()
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
      .then(() => setCopyStatus(t.backup.copied))
      .catch(() => setCopyStatus(t.backup.copyFailed))
  }

  const restoreBackup = () => {
    if (!confirmImport) return setConfirmImport(true)
    importBackup(backup.trim())
      .then(() => window.location.reload())
      .catch((error: unknown) => {
        setImportError(
          error instanceof BackupError
            ? t.backup.errors[error.reason](error.key)
            : error instanceof Error
              ? error.message
              : String(error)
        )
        setConfirmImport(false)
      })
  }

  const retakeLevelTest = () => {
    if (!confirmRetake) return setConfirmRetake(true)
    onRetakeLevelTest()
  }

  const accuracy = (Object.keys(t.settings.exerciseNames) as ExerciseType[])
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
        actions={
          <>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={copyBackup}>
                {t.backup.copy}
              </Button>
              <Button
                variant={confirmImport ? 'destructive' : 'outline'}
                disabled={!backup.trim()}
                onClick={restoreBackup}
              >
                {confirmImport ? t.settings.sure : t.backup.restore}
              </Button>
            </div>
            <Button size="lg" onClick={closeBackup}>
              {t.backup.back}
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
          placeholder={t.backup.placeholder}
          className="h-32 text-xs"
        />
        {copyStatus && <p className="text-sm text-muted-foreground">{copyStatus}</p>}
        {confirmImport && <p className="text-sm text-destructive">{t.backup.restoreWarning}</p>}
        {importError && <p className="text-sm text-destructive">{importError}</p>}
      </ThumbLayout>
    )
  }

  return (
    <ThumbLayout
      header={
        <Tabs
          value={meta.language}
          onValueChange={(language: Language) => onLanguageChange(language)}
        >
          <TabsList aria-label={t.settings.language}>
            {languages.map((language) => (
              <TabsTrigger key={language} value={language}>
                {language.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      }
      actions={
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="icon-lg"
            aria-label={t.settings.backup}
            onClick={() => setBackupOpen(true)}
          >
            <FloppyDiskIcon weight="bold" />
          </Button>
          <Button variant="outline" size="lg" onClick={retakeLevelTest}>
            {confirmRetake ? t.settings.sure : t.settings.retakeTest}
          </Button>
          <Button size="lg" className="flex-1" onClick={onExit}>
            {t.settings.done}
          </Button>
        </div>
      }
    >
      {accuracy.length > 0 && (
        <div className="glass mt-6 flex flex-col gap-3 rounded-3xl p-5">
          {accuracy.map(({ type, correct, total }) => (
            <div key={type} className="flex items-baseline gap-4">
              <span className="flex-1 text-sm text-muted-foreground">
                {t.settings.exerciseNames[type]}
              </span>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {correct}/{total}
              </span>
              <span className="w-10 text-right font-mono text-sm tabular-nums">
                {Math.round((correct / total) * 100)}%
              </span>
            </div>
          ))}
          <span className="text-xs text-muted-foreground">{t.settings.accuracy30}</span>
        </div>
      )}
      {confirmRetake && <p className="text-sm text-destructive">{t.settings.retakeWarning}</p>}
    </ThumbLayout>
  )
}
