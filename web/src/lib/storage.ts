import type { Card } from 'ts-fsrs'
import { isTelegram, webApp } from '@/lib/telegram'

type KeyValueStore = {
  getAll(): Promise<Record<string, string>>
  set(key: string, value: string): Promise<void>
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

const store = isTelegram && webApp.isVersionAtLeast('6.9') ? cloudStore : localStore

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

export const defaultMeta: Meta = {
  levelTestDone: false,
  days: {},
}

const PACK_COUNT = 64
const PACK_PREFIX = 'p_'
const LEGACY_PACK_PREFIX = 'p:'
const META_KEY = 'meta'
const MAX_STORED_DAYS = 120

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

export async function loadAll(): Promise<{ progress: Progress; meta: Meta }> {
  const entries = await store.getAll()
  const progress: Progress = {}

  for (const [key, value] of Object.entries(entries)) {
    if (!key.startsWith(PACK_PREFIX) || !value) continue
    const pack = JSON.parse(value) as Record<string, CompactCard>
    for (const [wordId, card] of Object.entries(pack)) progress[wordId] = expand(card)
  }

  const { newPerDay: _legacyNewPerDay, ...storedMeta } = entries[META_KEY]
    ? (JSON.parse(entries[META_KEY]) as Partial<Meta> & { newPerDay?: number })
    : {}
  return { progress, meta: { ...defaultMeta, ...storedMeta } }
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
  const days = Object.fromEntries(recentDays.map((day) => [day, meta.days[day]]))
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
  for (const key of allPackKeys) await store.set(key, (values[key] as string | undefined) ?? '{}')
  await store.set(META_KEY, values[META_KEY] as string)
}
