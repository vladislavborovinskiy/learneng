import type { Env } from './index'

const DAY = 24 * 60 * 60 * 1000

type Row = { key: string; value: string; updated_at: number }

async function sendBackup(env: Env, userId: number, now: number) {
  const { results } = await env.DB.prepare(
    'SELECT key, value, updated_at FROM kv WHERE user_id = ?'
  )
    .bind(userId)
    .all<Row>()
  if (!results.some((row) => row.updated_at > now - DAY)) return

  const backup = Object.fromEntries(
    results.filter((row) => row.value !== '{}').map((row) => [row.key, row.value])
  )
  const fileName = `learneng-backup-${new Date(now).toISOString().slice(0, 10)}.json`
  const form = new FormData()
  form.append('chat_id', String(userId))
  form.append(
    'document',
    new File([JSON.stringify(backup)], fileName, { type: 'application/json' })
  )

  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendDocument`,
    { method: 'POST', body: form }
  )
  if (!response.ok) throw new Error(`Telegram ${response.status}: ${await response.text()}`)
}

export async function sendDailyBackups(env: Env, userIds: number[]) {
  const now = Date.now()
  for (const userId of userIds) {
    try {
      await sendBackup(env, userId, now)
    } catch (error) {
      console.error(`Backup for ${userId} failed`, error)
    }
  }
}
