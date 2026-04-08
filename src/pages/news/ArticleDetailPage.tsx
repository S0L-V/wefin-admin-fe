import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { useArticleDetail } from '@/features/news'
import { Badge, StatusBadge } from '@/shared/ui'

export function ArticleDetailPage() {
  const { articleId } = useParams<{ articleId: string }>()
  const { data: article, isLoading } = useArticleDetail(Number(articleId))

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading...</div>
  }

  if (!article) {
    return (
      <div className="py-12 text-center text-gray-400">
        기사를 찾을 수 없습니다
      </div>
    )
  }

  function formatDateTime(dateStr: string | null) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('ko-KR')
  }

  const TAG_TYPE_VARIANT: Record<string, string> = {
    STOCK: 'info',
    SECTOR: 'warning',
    TOPIC: 'success',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/news/articles"
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{article.title}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <span>{article.publisherName}</span>
            <span>|</span>
            <span>ID: {article.id}</span>
            {article.originalUrl && (
              <>
                <span>|</span>
                <a
                  href={article.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  원문 <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Article Info */}
        <div className="col-span-2 space-y-6">
          {/* Summary */}
          {article.summary && (
            <Section title="AI 요약">
              <p className="text-sm leading-relaxed text-gray-700">
                {article.summary}
              </p>
            </Section>
          )}

          {/* Content */}
          {article.content && (
            <Section title="본문">
              <p className="max-h-80 overflow-auto text-sm leading-relaxed text-gray-700">
                {article.content}
              </p>
            </Section>
          )}

          {/* Tags */}
          {article.tags.length > 0 && (
            <Section title="태그">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={TAG_TYPE_VARIANT[tag.tagType] ?? 'neutral'}
                  >
                    [{tag.tagType}] {tag.tagName}
                  </Badge>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right: Metadata & Pipeline Status */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Section title="기본 정보">
            <InfoGrid>
              <InfoRow label="카테고리" value={article.category ?? '-'} />
              <InfoRow label="마켓" value={article.marketScope ?? '-'} />
              <InfoRow label="언어" value={article.languageCode ?? '-'} />
              <InfoRow label="Dedup Key" value={article.dedupKey ?? '-'} />
              <InfoRow label="Raw ID" value={article.rawNewsArticleId?.toString() ?? '-'} />
              <InfoRow label="발행일" value={formatDateTime(article.publishedAt)} />
              <InfoRow label="수집일" value={formatDateTime(article.collectedAt)} />
            </InfoGrid>
          </Section>

          {/* Pipeline Status */}
          <Section title="파이프라인 상태">
            <div className="space-y-4">
              <PipelineRow
                label="Crawl"
                status={article.crawlStatus}
                retryCount={article.crawlRetryCount}
                attemptedAt={formatDateTime(article.crawlAttemptedAt)}
                errorMessage={article.crawlErrorMessage}
              />
              <PipelineRow
                label="Embedding"
                status={article.embeddingStatus}
                retryCount={article.embeddingRetryCount}
                attemptedAt={formatDateTime(article.embeddingAttemptedAt)}
                errorMessage={article.embeddingErrorMessage}
              />
              <PipelineRow
                label="Tagging"
                status={article.taggingStatus}
                retryCount={article.taggingRetryCount}
                attemptedAt={formatDateTime(article.taggingAttemptedAt)}
                errorMessage={article.taggingErrorMessage}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Relevance
                </span>
                <StatusBadge status={article.relevance} />
              </div>
            </div>
          </Section>
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

function PipelineRow({
  label,
  status,
  retryCount,
  attemptedAt,
  errorMessage,
}: {
  label: string
  status: string
  retryCount: number
  attemptedAt: string
  errorMessage: string | null
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <StatusBadge status={status} />
      </div>
      <div className="text-xs text-gray-400">
        시도: {attemptedAt} / 재시도: {retryCount}회
      </div>
      {errorMessage && (
        <div className="rounded bg-red-50 px-2 py-1 text-xs text-red-600">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
