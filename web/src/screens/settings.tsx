import { useState } from 'react'
import { ThumbLayout } from '@/components/thumb-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { exportBackup, importBackup, type Meta, type Progress } from '@/lib/storage'
import { useBackButton } from '@/lib/telegram'

type SettingsProps = {
  progress: Progress
  meta: Meta
  onRetakeLevelTest: () => void
  onExit: () => void
}

export function Settings({ progress, meta, onRetakeLevelTest, onExit }: SettingsProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const [backup, setBackup] = useState('')
  const [confirmImport, setConfirmImport] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  useBackButton(onExit)

  const copyBackup = () => {
    navigator.clipboard
      .writeText(exportBackup(progress, meta))
      .then(() => setCopyStatus('Скопировано. Сохрани это в «Избранном» Telegram'))
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

  return (
    <ThumbLayout
      header={<h1 className="font-display text-2xl font-black">Настройки</h1>}
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
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={onRetakeLevelTest}>
              Тест заново
            </Button>
            <Button size="lg" className="flex-1" onClick={onExit}>
              Готово
            </Button>
          </div>
        </>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Резервная копия</CardTitle>
          <CardDescription>
            Прогресс хранится в Telegram. «Скопировать» кладёт копию в буфер обмена — сохрани её
            себе в «Избранное». Чтобы восстановить, вставь копию ниже и нажми «Восстановить».
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Textarea
            value={backup}
            onChange={(event) => {
              setBackup(event.target.value)
              setConfirmImport(false)
              setImportError(null)
            }}
            placeholder="Вставь сюда скопированный прогресс"
            className="h-24 text-xs"
          />
          {copyStatus && <p className="text-sm text-muted-foreground">{copyStatus}</p>}
          {confirmImport && (
            <p className="text-sm text-primary">
              Текущий прогресс сотрётся. Нажми «Точно?», чтобы восстановить копию.
            </p>
          )}
          {importError && <p className="text-sm text-destructive">{importError}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Тест уровня</CardTitle>
          <CardDescription>
            «Тест заново» не сотрёт выученные слова, а только добавит новые известные.
          </CardDescription>
        </CardHeader>
      </Card>
    </ThumbLayout>
  )
}
