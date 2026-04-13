import { useTriggerBatch } from '../model/useTriggerBatch'
import type { BatchEnv, BatchItem } from '../config'

type Props = {
  env: BatchEnv
  item: BatchItem
}

export function BatchButton({ env, item }: Props) {
  const mutation = useTriggerBatch()

  const handleClick = () => {
    if (mutation.isPending) return
    const confirmMsg =
      env === 'prod'
        ? `[PROD] '${item.label}' 배치를 정말 실행하시겠습니까?`
        : null
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
        <p className="text-xs text-green-600">
          ✓ 성공 (status {mutation.data.status})
        </p>
      )}
      {mutation.isError && (
        <p className="break-all text-xs text-red-600">✗ {mutation.error.message}</p>
      )}
    </div>
  )
}
