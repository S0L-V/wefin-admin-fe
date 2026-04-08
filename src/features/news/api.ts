import { useQuery } from '@tanstack/react-query'

import type { ArticleListFilter, NewsArticleDetail, NewsArticle, PageResponse } from './types'
import { getMockArticleDetail, getMockArticles } from './mock'

// TODO: Replace mock with real API calls when admin endpoints are ready
// import { apiClient } from '@/shared/api/client'

export function useArticleList(
  page: number,
  size: number,
  filters: ArticleListFilter,
) {
  return useQuery<PageResponse<NewsArticle>>({
    queryKey: ['articles', page, size, filters],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(getMockArticles(page, size, filters))
        }, 300)
      }),
  })
}

export function useArticleDetail(articleId: number) {
  return useQuery<NewsArticleDetail | null>({
    queryKey: ['article', articleId],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(getMockArticleDetail(articleId))
        }, 200)
      }),
    enabled: articleId > 0,
  })
}
