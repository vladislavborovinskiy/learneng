import { useState } from 'react'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { exportBackup, importBackup, type Meta, type Progress } from '@/lib/storage'
import { useBackButton } from '@/lib/telegram'

type SettingsProps = {
  progress: Progress
  meta: Meta
  updateMeta: (patch: Partial<Meta>) => void
  onRetakeLevelTest: () => void
  onExit: () => void
}

const NEW_PER_DAY_OPTIONS = [5, 10, 15, 20]

export function Settings({ progress, meta, updateMeta, onRetakeLevelTest, onExit }: SettingsProps) {
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
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-3 p-4">
      <header className="flex items-center justify-between py-2">
        <h1 className="text-xl font-semibold">Настройки</h1>
        <Button variant="ghost" size="icon" aria-label="Закрыть" onClick={onExit}>
          <XIcon className="size-5" />
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Новых слов в день</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-2">
          {NEW_PER_DAY_OPTIONS.map((count) => (
            <Button
              key={count}
              variant={meta.newPerDay === count ? 'default' : 'outline'}
              className="h-11 text-base"
              onClick={() => updateMeta({ newPerDay: count })}
            >
              {count}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Резервная копия</CardTitle>
          <CardDescription>
            Прогресс хранится в Telegram. Копию можно сохранить себе в «Избранное» и восстановить
            при необходимости.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button variant="outline" className="h-11" onClick={copyBackup}>
            Скопировать прогресс
          </Button>
          {copyStatus && <p className="text-sm text-muted-foreground">{copyStatus}</p>}
          <Textarea
            value={backup}
            onChange={(event) => {
              setBackup(event.target.value)
              setConfirmImport(false)
              setImportError(null)
            }}
            placeholder="Вставь сюда скопированный прогресс"
            className="h-24 bg-card font-mono text-xs"
          />
          <Button
            variant={confirmImport ? 'destructive' : 'outline'}
            className="h-11"
            disabled={!backup.trim()}
            onClick={restoreBackup}
          >
            {confirmImport ? 'Текущий прогресс сотрётся. Точно?' : 'Восстановить'}
          </Button>
          {importError && <p className="text-sm text-destructive">{importError}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Тест уровня</CardTitle>
          <CardDescription>
            Уже выученные слова останутся, тест только добавит новые известные
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="h-11 w-full" onClick={onRetakeLevelTest}>
            Пройти заново
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
