import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'

import type { PopularTag, TagFilterType } from './types'

export function usePopularTags(type: TagFilterType, limit: number) {
  return useQuery<PopularTag[]>({
    queryKey: ['popular-tags', type, limit],
    queryFn: async () => {
      const { data } = await apiClient.get('/news/tags/popular', {
        params: { type, limit },
      })
      return data.data
    },
  })
}
