import { ArrowDownUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useClusterList } from '@/features/cluster'
import type { ClusterSort, ClusterTab } from '@/features/cluster'
import { Badge } from '@/shared/ui'

const PAGE_SIZE = 20

const TABS: { value: ClusterTab; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'FINANCE', label: '금융' },
  { value: 'TECH', label: '기술' },
  { value: 'INDUSTRY', label: '산업' },
  { value: 'ENERGY', label: '에너지' },
  { value: 'BIO', label: '바이오' },
  { value: 'CRYPTO', label: '암호화폐' },
]

const SORT_OPTIONS: { value: ClusterSort; label: string }[] = [
  { value: 'publishedAt', label: '발행일순' },
  { value: 'updatedAt', label: '수정일순' },
]

export function ClusterListPage() {
  const [tab, setTab] = useState<ClusterTab>('ALL')
  const [sort, setSort] = useState<ClusterSort>('publishedAt')
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null])
  const [pageIndex, setPageIndex] = useState(0)

  const currentCursor = cursorHistory[pageIndex] ?? null
  const { data, isLoading } = useClusterList(tab, PAGE_SIZE, sort, currentCursor)

  function resetPagination() {
    setCursorHistory([null])
    setPageIndex(0)
  }

  function handleTabChange(newTab: ClusterTab) {
    setTab(newTab)
    resetPagination()
  }

  function handleSortChange(newSort: ClusterSort) {
    setSort(newSort)
    resetPagination()
  }

  function handleNext() {
    if (!data?.hasNext || !data.nextCursor) return
    const nextIdx = pageIndex + 1
    setCursorHistory((prev) => {
      const updated = [...prev]
      updated[nextIdx] = data.nextCursor
      return updated
    })
    setPageIndex(nextIdx)
  }

  function handlePrev() {
    if (pageIndex <= 0) return
    setPageIndex((p) => p - 1)
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">클러스터 관리</h1>

      {/* Tab Filter + Sort */}
      <div className="flex items-center justify-between rounded-lg bg-white p-2 shadow-sm">
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => handleTabChange(t.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.value
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <ArrowDownUp className="h-4 w-4 text-gray-400" />
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => handleSortChange(s.value)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                sort === s.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">ID</th>
              <th className="px-4 py-3 font-medium text-gray-600">제목</th>
              <th className="px-4 py-3 font-medium text-gray-600">출처</th>
              <th className="px-4 py-3 font-medium text-gray-600">종목</th>
              <th className="px-4 py-3 font-medium text-gray-600">태그</th>
              <th className="px-4 py-3 font-medium text-gray-600">기사 수</th>
              <th className="px-4 py-3 font-medium text-gray-600">발행일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : !data?.items.length ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              data.items.map((cluster) => (
                <tr
                  key={cluster.clusterId}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-500">{cluster.clusterId}</td>
                  <td className="max-w-xs truncate px-4 py-3">
                    <Link
                      to={`/news/clusters/${cluster.clusterId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {cluster.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {cluster.sources.map((src, i) => (
                        <span key={i} className="text-xs text-gray-500">
                          {src.publisherName}
                          {i < cluster.sources.length - 1 && ','}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {cluster.relatedStocks.map((stock) => (
                        <Badge key={stock.code} variant="info">
                          {stock.name}
                        </Badge>
                      ))}
                      {cluster.relatedStocks.length === 0 && (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {cluster.marketTags.map((tag) => (
                        <Badge key={tag} variant="success">
                          {tag}
                        </Badge>
                      ))}
                      {cluster.marketTags.length === 0 && (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-gray-700">
                    {cluster.sourceCount}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(cluster.publishedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Cursor Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <span className="text-sm text-gray-600">
            페이지 {pageIndex + 1}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={pageIndex === 0}
              className="rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {pageIndex + 1}
            </span>
            <button
              onClick={handleNext}
              disabled={!data?.hasNext}
              className="rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
