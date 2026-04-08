import type {
  NewsArticle,
  NewsArticleDetail,
  NewsArticleTag,
  PageResponse,
} from './types'

const publishers = ['한국경제', '매일경제', 'Bloomberg', 'CNBC', '조선일보', 'Reuters']
const categories = ['ECONOMY', 'POLITICS', 'IT_SCIENCE', 'GLOBAL', 'SOCIETY']
const crawlStatuses = ['PENDING', 'SUCCESS', 'FAILED', 'SKIPPED'] as const
const embeddingStatuses = ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'] as const
const taggingStatuses = ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'] as const
const relevanceStatuses = ['PENDING', 'FINANCIAL', 'IRRELEVANT'] as const

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

function generateArticle(id: number): NewsArticle {
  return {
    id,
    title: `[Mock] 뉴스 기사 제목 ${id} - ${randomFrom(categories)} 관련 뉴스`,
    publisherName: randomFrom(publishers),
    category: randomFrom(categories),
    marketScope: Math.random() > 0.5 ? 'KR' : 'US',
    originalUrl: `https://example.com/article/${id}`,
    thumbnailUrl: null,
    publishedAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
    collectedAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
    crawlStatus: randomFrom(crawlStatuses),
    embeddingStatus: randomFrom(embeddingStatuses),
    taggingStatus: randomFrom(taggingStatuses),
    relevance: randomFrom(relevanceStatuses),
    crawlRetryCount: Math.floor(Math.random() * 3),
    embeddingRetryCount: Math.floor(Math.random() * 3),
    taggingRetryCount: Math.floor(Math.random() * 3),
  }
}

const MOCK_ARTICLES: NewsArticle[] = Array.from({ length: 87 }, (_, i) =>
  generateArticle(i + 1),
)

export function getMockArticles(
  page: number,
  size: number,
  filters: {
    crawlStatus?: string
    embeddingStatus?: string
    taggingStatus?: string
    relevance?: string
    search?: string
  },
): PageResponse<NewsArticle> {
  let filtered = MOCK_ARTICLES

  if (filters.crawlStatus) {
    filtered = filtered.filter((a) => a.crawlStatus === filters.crawlStatus)
  }
  if (filters.embeddingStatus) {
    filtered = filtered.filter((a) => a.embeddingStatus === filters.embeddingStatus)
  }
  if (filters.taggingStatus) {
    filtered = filtered.filter((a) => a.taggingStatus === filters.taggingStatus)
  }
  if (filters.relevance) {
    filtered = filtered.filter((a) => a.relevance === filters.relevance)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.publisherName.toLowerCase().includes(q),
    )
  }

  const start = page * size
  const content = filtered.slice(start, start + size)

  return {
    content,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
    page,
    size,
  }
}

export function getMockArticleDetail(id: number): NewsArticleDetail | null {
  const article = MOCK_ARTICLES.find((a) => a.id === id)
  if (!article) return null

  const tags: NewsArticleTag[] = [
    { id: 1, tagType: 'TOPIC', tagCode: 'AI', tagName: '인공지능' },
    { id: 2, tagType: 'SECTOR', tagCode: 'TECH', tagName: '기술' },
    { id: 3, tagType: 'STOCK', tagCode: '005930', tagName: '삼성전자' },
  ]

  return {
    ...article,
    rawNewsArticleId: article.id + 1000,
    summary: `이 기사는 ${article.category} 카테고리의 ${article.publisherName} 기사입니다. AI가 생성한 요약 텍스트가 여기에 표시됩니다.`,
    content:
      '기사 본문 내용이 여기에 표시됩니다. 실제 환경에서는 크롤링된 전체 기사 내용이 포함됩니다. '.repeat(
        5,
      ),
    languageCode: 'ko',
    dedupKey: `dedup-${article.id}`,
    crawlAttemptedAt: article.collectedAt,
    crawlErrorMessage:
      article.crawlStatus === 'FAILED' ? 'Connection timeout' : null,
    embeddingAttemptedAt:
      article.embeddingStatus !== 'PENDING' ? article.collectedAt : null,
    embeddingErrorMessage:
      article.embeddingStatus === 'FAILED' ? 'Token limit exceeded' : null,
    taggingAttemptedAt:
      article.taggingStatus !== 'PENDING' ? article.collectedAt : null,
    taggingErrorMessage:
      article.taggingStatus === 'FAILED' ? 'OpenAI rate limit' : null,
    tags,
  }
}
