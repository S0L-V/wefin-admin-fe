import type { BatchEnv } from '../config'

export type BatchHistoryRecord = {
  executedAt: string
  result: 'success' | 'error'
  status?: number
  message?: string
}

const STORAGE_KEY = 'wefin-admin:batch-history'

type Store = Record<string, BatchHistoryRecord>

function keyOf(env: BatchEnv, itemId: string): string {
  return `${env}:${itemId}`
}

function readStore(): Store {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Store) : {}
  } catch {
    return {}
  }
}

function writeStore(store: Store): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    window.dispatchEvent(new Event('batch-history-change'))
  } catch {
    /* quota/serialize 실패는 무시 — 히스토리 UX는 보조 정보 */
  }
}

export function loadHistory(env: BatchEnv, itemId: string): BatchHistoryRecord | null {
  return readStore()[keyOf(env, itemId)] ?? null
}

export function saveHistory(
  env: BatchEnv,
  itemId: string,
  record: BatchHistoryRecord,
): void {
  const store = readStore()
  store[keyOf(env, itemId)] = record
  writeStore(store)
}
