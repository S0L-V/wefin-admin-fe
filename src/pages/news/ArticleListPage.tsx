import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useArticleList } from '@/features/news'
import type { ArticleListFilter } from '@/features/news'
import { StatusBadge } from '@/shared/ui'

const PAGE_SIZE = 20

const CRAWL_OPTIONS = ['', 'PENDING', 'SUCCESS', 'FAILED', 'SKIPPED'] as const
const EMBEDDING_OPTIONS = ['', 'PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'] as const
const TAGGING_OPTIONS = ['', 'PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'] as const
const RELEVANCE_OPTIONS = ['', 'PENDING', 'FINANCIAL', 'IRRELEVANT'] as const

export function ArticleListPage() {
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState<ArticleListFilter>({})
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useArticleList(page, PAGE_SIZE, filters)

  function handleFilterChange(key: keyof ArticleListFilter, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
    setPage(0)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, search: searchInput || undefined }))
    setPage(0)
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
      <h1 className="text-2xl font-bold text-gray-900">기사 관리</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="제목, 언론사 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            검색
          </button>
        </form>

        <div className="h-6 w-px bg-gray-200" />

        <FilterSelect
          label="Crawl"
          value={filters.crawlStatus ?? ''}
          options={CRAWL_OPTIONS}
          onChange={(v) => handleFilterChange('crawlStatus', v)}
        />
        <FilterSelect
          label="Embedding"
          value={filters.embeddingStatus ?? ''}
          options={EMBEDDING_OPTIONS}
          onChange={(v) => handleFilterChange('embeddingStatus', v)}
        />
        <FilterSelect
          label="Tagging"
          value={filters.taggingStatus ?? ''}
          options={TAGGING_OPTIONS}
          onChange={(v) => handleFilterChange('taggingStatus', v)}
        />
        <FilterSelect
          label="Relevance"
          value={filters.relevance ?? ''}
          options={RELEVANCE_OPTIONS}
          onChange={(v) => handleFilterChange('relevance', v)}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">ID</th>
              <th className="px-4 py-3 font-medium text-gray-600">제목</th>
              <th className="px-4 py-3 font-medium text-gray-600">언론사</th>
              <th className="px-4 py-3 font-medium text-gray-600">카테고리</th>
              <th className="px-4 py-3 font-medium text-gray-600">Crawl</th>
              <th className="px-4 py-3 font-medium text-gray-600">Embedding</th>
              <th className="px-4 py-3 font-medium text-gray-600">Tagging</th>
              <th className="px-4 py-3 font-medium text-gray-600">Relevance</th>
              <th className="px-4 py-3 font-medium text-gray-600">수집일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : data?.content.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              data?.content.map((article) => (
                <tr
                  key={article.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-500">{article.id}</td>
                  <td className="max-w-xs truncate px-4 py-3">
                    <Link
                      to={`/news/articles/${article.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {article.publisherName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {article.category ?? '-'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={article.crawlStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={article.embeddingStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={article.taggingStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={article.relevance} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(article.collectedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <span className="text-sm text-gray-600">
              총 {data.totalElements}건 / {data.totalPages}페이지
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {page + 1} / {data.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages - 1, p + 1))
                }
                disabled={page >= data.totalPages - 1}
                className="rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 py-1.5 pl-2 pr-7 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="">전체</option>
        {options.filter(Boolean).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
