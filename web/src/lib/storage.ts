import type { Card } from 'ts-fsrs'
import type { ExerciseType } from '@/lib/exercises'
import { isTelegram, webApp } from '@/lib/telegram'

type KeyValueStore = {
  getAll(): Promise<Record<string, string>>
  set(key: string, value: string): Promise<void>
  replaceAll?(entries: Record<string, string>): Promise<void>
}

const LOCAL_PREFIX = 'learneng:'

const localStore: KeyValueStore = {
  async getAll() {
    const entries: Record<string, string> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(LOCAL_PREFIX)) {
        entries[key.slice(LOCAL_PREFIX.length)] = localStorage.getItem(key) ?? ''
      }
    }
    return entries
  },
  async set(key, value) {
    localStorage.setItem(LOCAL_PREFIX + key, value)
  },
}

const cloudStore: KeyValueStore = {
  getAll() {
    return new Promise((resolve, reject) => {
      webApp.CloudStorage.getKeys((keysError, keys) => {
        if (keysError || !keys) return reject(new Error(keysError ?? 'CloudStorage getKeys failed'))
        if (keys.length === 0) return resolve({})
        webApp.CloudStorage.getItems(keys, (itemsError, values) => {
          if (itemsError || !values) {
            return reject(new Error(itemsError ?? 'CloudStorage getItems failed'))
          }
          resolve(values)
        })
      })
    })
  },
  set(key, value) {
    return new Promise((resolve, reject) => {
      webApp.CloudStorage.setItem(key, value, (error) =>
        error ? reject(new Error(error)) : resolve()
      )
    })
  },
}

const apiUrl: string | undefined = import.meta.env.VITE_API_URL
const API_TIMEOUT = 4000

async function apiRequest(path: string, init?: RequestInit) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: { 'Authorization': `tma ${webApp.initData}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(API_TIMEOUT),
  })
  if (!response.ok) throw new Error(`API ${response.status}`)
  return response
}

const apiStore = {
  async getAll() {
    const { entries } = (await (await apiRequest('/progress')).json()) as {
      entries: Record<string, string>
    }
    return entries
  },
  async set(key: string, value: string) {
    await apiRequest(`/progress/${key}`, { method: 'PUT', body: JSON.stringify({ value }) })
  },
  async replaceAll(entries: Record<string, string>) {
    await apiRequest('/progress', { method: 'PUT', body: JSON.stringify({ entries }) })
  },
}

const UNSYNCED_KEY = 'unsynced'

let mirror: Record<string, string> = {}
let unsynced = new Set<string>()

function saveUnsynced() {
  return cloudStore.set(UNSYNCED_KEY, JSON.stringify([...unsynced]))
}

async function flushUnsynced() {
  try {
    for (const key of [...unsynced]) {
      if (key in mirror) await apiStore.set(key, mirror[key])
      unsynced.delete(key)
    }
  } finally {
    await saveUnsynced()
  }
}

const syncedStore: KeyValueStore = {
  async getAll() {
    const local = await cloudStore.getAll()
    mirror = Object.fromEntries(
      Object.entries(local).filter(
        ([key]) => key === META_KEY || key === STATS_KEY || allPackKeys.includes(key)
      )
    )
    unsynced = new Set(local[UNSYNCED_KEY] ? (JSON.parse(local[UNSYNCED_KEY]) as string[]) : [])
    try {
      const remote = await apiStore.getAll()
      if (Object.keys(remote).length === 0 && Object.keys(mirror).length > 0) {
        await apiStore.replaceAll(mirror)
        unsynced.clear()
        await saveUnsynced()
        return local
      }
      const pushed = [...unsynced]
      if (pushed.length) await flushUnsynced()
      for (const key of pushed) if (key in mirror) remote[key] = mirror[key]
      const stale = Object.entries(remote).filter(([key, value]) => mirror[key] !== value)
      mirror = { ...mirror, ...remote }
      await Promise.all(stale.map(([key, value]) => cloudStore.set(key, value))).catch(
        (error: unknown) => console.warn('Failed to refresh CloudStorage mirror', error)
      )
      return remote
    } catch (error) {
      console.warn('Server unavailable, using CloudStorage', error)
      return local
    }
  },
  async set(key, value) {
    await cloudStore.set(key, value)
    mirror[key] = value
    const synced = await apiStore.set(key, value).then(
      () => true,
      () => false
    )
    if (!synced) {
      unsynced.add(key)
      return saveUnsynced()
    }
    const wasUnsynced = unsynced.delete(key)
    if (unsynced.size) return flushUnsynced().catch(() => undefined)
    if (wasUnsynced) return saveUnsynced()
  },
  async replaceAll(entries) {
    await apiStore.replaceAll(entries)
    for (const [key, value] of Object.entries(entries)) await cloudStore.set(key, value)
    mirror = { ...entries }
    unsynced.clear()
    await saveUnsynced()
  },
}

const hasCloudStorage = isTelegram && webApp.isVersionAtLeast('6.9')

const store = hasCloudStorage ? (apiUrl ? syncedStore : cloudStore) : localStore

export type Progress = Record<string, Card>

export type DayStats = {
  reviewed: number
  learned: number
  lessons?: number
}

export type Meta = {
  levelTestDone: boolean
  days: Record<string, DayStats>
}

export type AnswerStats = Record<string, Partial<Record<ExerciseType, [number, number]>>>

export const defaultMeta: Meta = {
  levelTestDone: false,
  days: {},
}

const PACK_COUNT = 64
const PACK_PREFIX = 'p_'
const LEGACY_PACK_PREFIX = 'p:'
const META_KEY = 'meta'
const MAX_STORED_DAYS = 120

type CompactDayStats = [reviewed: number, learned: number, lessons: number]

type StoredMeta = Partial<Omit<Meta, 'days'>> & {
  days?: Record<string, DayStats | CompactDayStats>
  newPerDay?: number
}
const STATS_KEY = 'stats'
const MAX_STATS_DAYS = 30

type CompactCard = [
  due: number,
  stability: number,
  difficulty: number,
  scheduledDays: number,
  learningSteps: number,
  reps: number,
  lapses: number,
  state: number,
  lastReview: number,
]

const MINUTE = 60_000

function packKeyByIndex(index: number) {
  return `${PACK_PREFIX}${String(index).padStart(2, '0')}`
}

function packKey(wordId: string) {
  let hash = 0
  for (const char of wordId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return packKeyByIndex(hash % PACK_COUNT)
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

function compact(card: Card): CompactCard {
  return [
    Math.round(card.due.getTime() / MINUTE),
    round(card.stability),
    round(card.difficulty),
    card.scheduled_days,
    card.learning_steps,
    card.reps,
    card.lapses,
    card.state,
    card.last_review ? Math.round(card.last_review.getTime() / MINUTE) : 0,
  ]
}

function expand([
  due,
  stability,
  difficulty,
  scheduledDays,
  learningSteps,
  reps,
  lapses,
  state,
  lastReview,
]: CompactCard): Card {
  return {
    due: new Date(due * MINUTE),
    stability,
    difficulty,
    elapsed_days: 0,
    scheduled_days: scheduledDays,
    learning_steps: learningSteps,
    reps,
    lapses,
    state,
    last_review: lastReview ? new Date(lastReview * MINUTE) : undefined,
  }
}

export async function loadAll(): Promise<{ progress: Progress; meta: Meta; stats: AnswerStats }> {
  const entries = await store.getAll()
  const progress: Progress = {}

  for (const [key, value] of Object.entries(entries)) {
    if (!key.startsWith(PACK_PREFIX) || !value) continue
    const pack = JSON.parse(value) as Record<string, CompactCard>
    for (const [wordId, card] of Object.entries(pack)) progress[wordId] = expand(card)
  }

  const {
    newPerDay: _legacyNewPerDay,
    days: storedDays = {},
    ...storedMeta
  } = entries[META_KEY] ? (JSON.parse(entries[META_KEY]) as StoredMeta) : {}
  const days = Object.fromEntries(
    Object.entries(storedDays).map(([day, stats]) => [
      day,
      Array.isArray(stats) ? { reviewed: stats[0], learned: stats[1], lessons: stats[2] } : stats,
    ])
  )
  const stats = entries[STATS_KEY] ? (JSON.parse(entries[STATS_KEY]) as AnswerStats) : {}
  return { progress, meta: { ...defaultMeta, ...storedMeta, days }, stats }
}

const allPackKeys = Array.from({ length: PACK_COUNT }, (_, index) => packKeyByIndex(index))

function serializePacks(progress: Progress, keys: Iterable<string>) {
  const packs = new Map<string, Record<string, CompactCard>>([...keys].map((key) => [key, {}]))
  for (const [id, card] of Object.entries(progress)) {
    const pack = packs.get(packKey(id))
    if (pack) pack[id] = compact(card)
  }
  return [...packs].map(([key, pack]) => [key, JSON.stringify(pack)] as const)
}

function serializeMeta(meta: Meta) {
  const recentDays = Object.keys(meta.days).sort().slice(-MAX_STORED_DAYS)
  const days = Object.fromEntries(
    recentDays.map((day) => {
      const { reviewed, learned, lessons = 0 } = meta.days[day]
      return [day, [reviewed, learned, lessons] satisfies CompactDayStats]
    })
  )
  return JSON.stringify({ ...meta, days })
}

export async function saveCards(progress: Progress, wordIds: string[]) {
  for (const [key, value] of serializePacks(progress, new Set(wordIds.map(packKey)))) {
    await store.set(key, value)
  }
}

export function saveMeta(meta: Meta) {
  return store.set(META_KEY, serializeMeta(meta))
}

export function saveStats(stats: AnswerStats) {
  const recentDays = Object.keys(stats).sort().slice(-MAX_STATS_DAYS)
  return store.set(
    STATS_KEY,
    JSON.stringify(Object.fromEntries(recentDays.map((day) => [day, stats[day]])))
  )
}

export function exportBackup(progress: Progress, meta: Meta) {
  const packs = serializePacks(progress, allPackKeys).filter(([, value]) => value !== '{}')
  return JSON.stringify(Object.fromEntries([...packs, [META_KEY, serializeMeta(meta)]]))
}

export async function importBackup(backup: string) {
  const entries: unknown = JSON.parse(backup)
  if (typeof entries !== 'object' || entries === null || !(META_KEY in entries)) {
    throw new Error('Это не резервная копия LearnEng')
  }
  const values = Object.fromEntries(
    Object.entries(entries).map(([key, value]) => [
      key.replace(LEGACY_PACK_PREFIX, PACK_PREFIX),
      value,
    ])
  )
  for (const [key, value] of Object.entries(values)) {
    if (key !== META_KEY && !allPackKeys.includes(key)) throw new Error(`Неизвестный ключ ${key}`)
    if (typeof value !== 'string') throw new Error(`Повреждённое значение ${key}`)
    JSON.parse(value)
  }
  const restored: Record<string, string> = Object.fromEntries([
    ...allPackKeys.map((key) => [key, (values[key] as string | undefined) ?? '{}']),
    [META_KEY, values[META_KEY] as string],
  ])
  if (store.replaceAll) return store.replaceAll(restored)
  for (const [key, value] of Object.entries(restored)) await store.set(key, value)
}
