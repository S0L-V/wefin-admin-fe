import { useMemo, useState } from 'react'

import { BATCH_ENV_LABELS, BATCH_ITEMS, type BatchEnv, type BatchItem } from '../config'
import { BatchButton } from './BatchButton'

const ENVS: BatchEnv[] = ['local', 'dev', 'prod']

export function BatchPanel() {
  const [env, setEnv] = useState<BatchEnv>('local')

  const groups = useMemo(() => {
    const map = new Map<string, BatchItem[]>()
    for (const item of BATCH_ITEMS) {
      const list = map.get(item.group) ?? []
      list.push(item)
      map.set(item.group, list)
    }
    return Array.from(map.entries())
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">배치 관리</h1>
        <p className="mt-1 text-sm text-gray-600">
          환경을 선택한 뒤 실행할 배치 버튼을 눌러주세요.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">대상 환경:</span>
        <div className="inline-flex rounded-md border border-gray-200 bg-white p-0.5">
          {ENVS.map((value) => {
            const active = env === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setEnv(value)}
                className={`rounded px-3 py-1.5 text-sm font-semibold transition-colors ${
                  active
                    ? value === 'prod'
                      ? 'bg-red-600 text-white'
                      : value === 'dev'
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {BATCH_ENV_LABELS[value]}
              </button>
            )
          })}
        </div>
        {env === 'prod' && (
          <span className="text-xs font-semibold text-red-600">
            ⚠ Production 환경입니다. 신중히 실행하세요.
          </span>
        )}
      </div>

      <div className="space-y-6">
        {groups.map(([groupName, items]) => (
          <section key={groupName} className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-bold text-gray-900">{groupName}</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <BatchButton key={item.id} env={env} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
