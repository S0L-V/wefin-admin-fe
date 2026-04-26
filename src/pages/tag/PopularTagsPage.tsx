import { useState } from 'react'

import { usePopularTags } from '@/features/tag'
import type { TagFilterType } from '@/features/tag'

const TYPES: { value: TagFilterType; label: string }[] = [
  { value: 'SECTOR', label: '섹터' },
  { value: 'STOCK', label: '종목' },
]

const LIMIT_OPTIONS = [10, 20, 50, 100]

export function PopularTagsPage() {
  const [type, setType] = useState<TagFilterType>('SECTOR')
  const [limit, setLimit] = useState(20)

  const { data, isLoading } = usePopularTags(type, limit)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">인기 태그</h1>
      <p className="text-sm text-gray-500">
        ACTIVE 클러스터에 등장한 태그를 등장 빈도순으로 보여줍니다
      </p>

      <div className="flex items-center justify-between rounded-lg bg-white p-2 shadow-sm">
        <div className="flex items-center gap-1">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                type === t.value
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 pr-2">
          <label className="text-xs font-medium text-gray-500">상위</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-md border border-gray-300 py-1.5 pl-2 pr-7 text-sm focus:border-blue-500 focus:outline-none"
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}개
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="w-16 px-4 py-3 font-medium text-gray-600">#</th>
              <th className="px-4 py-3 font-medium text-gray-600">코드</th>
              <th className="px-4 py-3 font-medium text-gray-600">이름</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                클러스터 수
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : !data?.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              data.map((tag, idx) => (
                <tr
                  key={`${tag.code}-${idx}`}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3 font-mono text-gray-700">
                    {tag.code}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {tag.name}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-700">
                    {tag.clusterCount.toLocaleString('ko-KR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
