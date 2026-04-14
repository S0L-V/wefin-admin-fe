import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { useClusterDetail } from '@/features/cluster'
import { Badge } from '@/shared/ui'

export function ClusterDetailPage() {
  const { clusterId } = useParams<{ clusterId: string }>()
  const { data: cluster, isLoading } = useClusterDetail(Number(clusterId))

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading...</div>
  }

  if (!cluster) {
    return (
      <div className="py-12 text-center text-gray-400">
        클러스터를 찾을 수 없습니다
      </div>
    )
  }

  function formatDateTime(dateStr: string | null) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('ko-KR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/news/clusters"
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{cluster.title}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <span>ID: {cluster.clusterId}</span>
            <span>|</span>
            <span>출처 {cluster.sourceCount}건</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Summary & Sections */}
        <div className="col-span-2 space-y-6">
          {/* Summary */}
          {cluster.summary && (
            <Section title="클러스터 요약">
              <p className="text-sm leading-relaxed text-gray-700">
                {cluster.summary}
              </p>
            </Section>
          )}

          {/* Summary Sections */}
          {cluster.sections.length > 0 && (
            <Section title="요약 섹션">
              <div className="space-y-4">
                {cluster.sections.map((section) => (
                  <div
                    key={section.sectionOrder}
                    className="rounded-md border border-gray-100 p-3"
                  >
                    <h4 className="mb-1 text-sm font-semibold text-gray-800">
                      {section.sectionOrder + 1}. {section.heading}
                    </h4>
                    <p className="mb-2 text-sm leading-relaxed text-gray-600">
                      {section.body}
                    </p>
                    {section.sources.length > 0 && (
                      <div className="border-t border-gray-100 pt-2">
                        <span className="text-xs font-medium text-gray-400">
                          출처 ({section.sourceCount})
                        </span>
                        <ul className="mt-1 space-y-0.5">
                          {section.sources.map((src) => (
                            <li
                              key={src.articleId}
                              className="flex items-center gap-1 text-xs text-gray-500"
                            >
                              <span className="text-gray-400">
                                [{src.publisherName}]
                              </span>
                              <Link
                                to={`/news/articles/${src.articleId}`}
                                className="text-blue-500 hover:underline"
                              >
                                {src.title}
                              </Link>
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-gray-500"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Source Articles */}
          <Section title={`출처 기사 (${cluster.sources.length})`}>
            <div className="overflow-hidden rounded-md border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 font-medium text-gray-500">기사 ID</th>
                    <th className="px-3 py-2 font-medium text-gray-500">제목</th>
                    <th className="px-3 py-2 font-medium text-gray-500">언론사</th>
                    <th className="px-3 py-2 font-medium text-gray-500">원문</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cluster.sources.map((article) => (
                    <tr
                      key={article.articleId}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 text-gray-500">
                        {article.articleId}
                      </td>
                      <td className="max-w-xs truncate px-3 py-2">
                        <Link
                          to={`/news/articles/${article.articleId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {article.title}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {article.publisherName}
                      </td>
                      <td className="px-3 py-2">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                        >
                          원문 <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        {/* Right: Metadata */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Section title="기본 정보">
            <InfoGrid>
              <InfoRow label="출처 수" value={String(cluster.sourceCount)} />
              <InfoRow label="발행일" value={formatDateTime(cluster.publishedAt)} />
            </InfoGrid>
          </Section>

          {/* Related Stocks */}
          {cluster.relatedStocks.length > 0 && (
            <Section title="관련 종목">
              <div className="flex flex-wrap gap-2">
                {cluster.relatedStocks.map((stock) => (
                  <Badge key={stock.code} variant="info">
                    {stock.name} ({stock.code})
                  </Badge>
                ))}
              </div>
            </Section>
          )}

          {/* Market Tags */}
          {cluster.marketTags.length > 0 && (
            <Section title="마켓 태그">
              <div className="flex flex-wrap gap-2">
                {cluster.marketTags.map((tag) => (
                  <Badge key={tag} variant="success">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Section>
          )}

          {/* Thumbnail */}
          {cluster.thumbnailUrl && (
            <Section title="썸네일">
              <img
                src={cluster.thumbnailUrl}
                alt="Cluster thumbnail"
                className="w-full rounded-md"
              />
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  )
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <dl className="space-y-2">{children}</dl>
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-medium text-gray-900">
        {value}
      </dd>
    </div>
  )
}
