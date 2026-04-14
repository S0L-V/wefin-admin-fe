export interface ClusterItem {
  clusterId: number
  title: string
  summary: string
  thumbnailUrl: string | null
  publishedAt: string
  sourceCount: number
  sources: ClusterSource[]
  relatedStocks: StockTag[]
  marketTags: string[]
  isRead: boolean
}

export interface ClusterSource {
  publisherName: string
  url: string
}

export interface StockTag {
  code: string
  name: string
}

export interface ClusterFeedResponse {
  items: ClusterItem[]
  hasNext: boolean
  nextCursor: string | null
}

export interface ClusterArticleSource {
  articleId: number
  title: string
  publisherName: string
  url: string
}

export interface ClusterSummarySection {
  sectionOrder: number
  heading: string
  body: string
  sourceCount: number
  sources: ClusterArticleSource[]
}

export interface ClusterDetail {
  clusterId: number
  title: string
  summary: string
  thumbnailUrl: string | null
  publishedAt: string
  sourceCount: number
  sources: ClusterArticleSource[]
  relatedStocks: StockTag[]
  marketTags: string[]
  isRead: boolean
  sections: ClusterSummarySection[]
}

export type ClusterTab = 'ALL' | 'FINANCE' | 'TECH' | 'INDUSTRY' | 'ENERGY' | 'BIO' | 'CRYPTO'
export type ClusterSort = 'publishedAt' | 'updatedAt'
