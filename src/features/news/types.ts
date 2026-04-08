export type CrawlStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'SKIPPED'
export type EmbeddingStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED'
export type TaggingStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED'
export type RelevanceStatus = 'PENDING' | 'FINANCIAL' | 'IRRELEVANT'

export interface NewsArticle {
  id: number
  title: string
  publisherName: string
  category: string | null
  marketScope: string | null
  originalUrl: string
  thumbnailUrl: string | null
  publishedAt: string | null
  collectedAt: string
  crawlStatus: CrawlStatus
  embeddingStatus: EmbeddingStatus
  taggingStatus: TaggingStatus
  relevance: RelevanceStatus
  crawlRetryCount: number
  embeddingRetryCount: number
  taggingRetryCount: number
}

export interface NewsArticleDetail extends NewsArticle {
  rawNewsArticleId: number | null
  summary: string | null
  content: string | null
  languageCode: string | null
  dedupKey: string | null
  crawlAttemptedAt: string | null
  crawlErrorMessage: string | null
  embeddingAttemptedAt: string | null
  embeddingErrorMessage: string | null
  taggingAttemptedAt: string | null
  taggingErrorMessage: string | null
  tags: NewsArticleTag[]
}

export interface NewsArticleTag {
  id: number
  tagType: 'STOCK' | 'SECTOR' | 'TOPIC'
  tagCode: string
  tagName: string
}

export interface ArticleListFilter {
  crawlStatus?: CrawlStatus | ''
  embeddingStatus?: EmbeddingStatus | ''
  taggingStatus?: TaggingStatus | ''
  relevance?: RelevanceStatus | ''
  search?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}
