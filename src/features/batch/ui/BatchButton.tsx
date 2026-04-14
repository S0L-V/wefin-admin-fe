import { useEffect, useState } from 'react'

import { loadHistory, saveHistory, type BatchHistoryRecord } from '../model/batchHistory'
import { useTriggerBatch } from '../model/useTriggerBatch'
import type { BatchEnv, BatchItem } from '../config'

type Props = {
  env: BatchEnv
  item: BatchItem
}

export function BatchButton({ env, item }: Props) {
  const mutation = useTriggerBatch()
  const [history, setHistory] = useState<BatchHistoryRecord | null>(() =>
    loadHistory(env, item.id),
  )

  useEffect(() => {
    mutation.reset()
    setHistory(loadHistory(env, item.id))
    // env 전환 시 현재 실행 결과 초기화 + 해당 env의 최신 히스토리 로드
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [env, item.id])

  useEffect(() => {
    function syncFromStorage() {
      setHistory(loadHistory(env, item.id))
    }
    window.addEventListener('batch-history-change', syncFromStorage)
    return () => window.removeEventListener('batch-history-change', syncFromStorage)
  }, [env, item.id])

  useEffect(() => {
    if (mutation.isSuccess) {
      const record: BatchHistoryRecord = {
        executedAt: new Date().toISOString(),
        result: 'success',
        status: mutation.data.status,
      }
      saveHistory(env, item.id, record)
      setHistory(record)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.isSuccess])

  useEffect(() => {
    if (mutation.isError) {
      const record: BatchHistoryRecord = {
        executedAt: new Date().toISOString(),
        result: 'error',
        message: mutation.error.message,
      }
      saveHistory(env, item.id, record)
      setHistory(record)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.isError])

  const handleClick = () => {
    if (mutation.isPending) return
    const confirmMsg =
      env === 'prod' ? `[PROD] '${item.label}' 배치를 정말 실행하시겠습니까?` : null
    if (confirmMsg && !window.confirm(confirmMsg)) return
    mutation.mutate({ env, item })
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-gray-100 bg-gray-50 p-3">
      <div>
        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
        <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
        <p className="mt-1 font-mono text-[11px] text-gray-400">
          {item.method} {item.path}
        </p>
      </div>
      <button
        type="button"
        onClick={handleClick}
        disabled={mutation.isPending}
        className="self-start rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
      >
        {mutation.isPending ? '실행 중...' : '실행'}
      </button>
      {mutation.isSuccess && (
        <p className="text-xs text-green-600">✓ 성공 (status {mutation.data.status})</p>
      )}
      {mutation.isError && (
        <p className="break-all text-xs text-red-600">✗ {mutation.error.message}</p>
      )}
      {history && !mutation.isPending && !mutation.isSuccess && !mutation.isError && (
        <p
          className={`text-[11px] ${
            history.result === 'success' ? 'text-gray-500' : 'text-red-500'
          }`}
        >
          최근 실행: {formatRelative(history.executedAt)}
          {history.result === 'success'
            ? ` · 성공 (status ${history.status ?? '-'})`
            : ` · 실패${history.message ? ` (${truncate(history.message, 60)})` : ''}`}
        </p>
      )}
    </div>
  )
}

function formatRelative(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + '…' : s
}
