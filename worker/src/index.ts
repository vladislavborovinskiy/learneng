import { verifyInitData } from './auth'
import { sendDailyBackups } from './backup'

export type Env = {
  DB: D1Database
  TELEGRAM_BOT_TOKEN: string
  ALLOWED_USER_IDS: string
  ALLOWED_ORIGIN: string
}

const KEY_PATTERN = /^(p_(0\d|[1-5]\d|6[0-3])|meta)$/
const MAX_VALUE_LENGTH = 64 * 1024

const UPSERT_SQL = `INSERT INTO kv (user_id, key, value, updated_at) VALUES (?, ?, ?, ?)
  ON CONFLICT (user_id, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`

function allowedUserIds(env: Env) {
  return env.ALLOWED_USER_IDS.split(',')
    .map((id) => Number(id.trim()))
    .filter(Number.isInteger)
}

function isValidEntry(key: string, value: unknown): value is string {
  return KEY_PATTERN.test(key) && typeof value === 'string' && value.length <= MAX_VALUE_LENGTH
}

async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>
  } catch {
    return null
  }
}

async function handle(request: Request, env: Env) {
  const authorization = request.headers.get('Authorization') ?? ''
  const userId = authorization.startsWith('tma ')
    ? await verifyInitData(authorization.slice(4), env.TELEGRAM_BOT_TOKEN)
    : null
  if (userId === null || !allowedUserIds(env).includes(userId)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { pathname } = new URL(request.url)
  const [, resource, key] = pathname.split('/')
  if (resource !== 'progress') return Response.json({ error: 'not found' }, { status: 404 })

  if (request.method === 'GET' && key === undefined) {
    const { results } = await env.DB.prepare('SELECT key, value FROM kv WHERE user_id = ?')
      .bind(userId)
      .all<{ key: string; value: string }>()
    return Response.json({
      entries: Object.fromEntries(results.map((row) => [row.key, row.value])),
    })
  }

  if (request.method !== 'PUT') {
    return Response.json({ error: 'method not allowed' }, { status: 405 })
  }
  const body = await readJson(request)
  const now = Date.now()

  if (key !== undefined) {
    if (!isValidEntry(key, body?.value)) {
      return Response.json({ error: 'bad entry' }, { status: 400 })
    }
    await env.DB.prepare(UPSERT_SQL).bind(userId, key, body.value, now).run()
    return new Response(null, { status: 204 })
  }

  const entries = body?.entries
  if (typeof entries !== 'object' || entries === null) {
    return Response.json({ error: 'bad entries' }, { status: 400 })
  }
  const pairs = Object.entries(entries)
  if (!pairs.every(([entryKey, value]) => isValidEntry(entryKey, value))) {
    return Response.json({ error: 'bad entry' }, { status: 400 })
  }
  await env.DB.batch([
    env.DB.prepare('DELETE FROM kv WHERE user_id = ?').bind(userId),
    ...pairs.map(([entryKey, value]) =>
      env.DB.prepare(UPSERT_SQL).bind(userId, entryKey, value, now)
    ),
  ])
  return new Response(null, { status: 204 })
}

function withCors(response: Response, origin: string | null, env: Env) {
  if (origin !== env.ALLOWED_ORIGIN) return response
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', origin)
  headers.set('Vary', 'Origin')
  return new Response(response.body, { status: response.status, headers })
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin')
    if (request.method === 'OPTIONS') {
      const preflight = new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      })
      return withCors(preflight, origin, env)
    }
    return withCors(await handle(request, env), origin, env)
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(sendDailyBackups(env, allowedUserIds(env)))
  },
} satisfies ExportedHandler<Env>
