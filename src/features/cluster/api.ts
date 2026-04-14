import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import type { ClusterDetail, ClusterFeedResponse, ClusterSort, ClusterTab } from './types'

export function useClusterList(
  tab: ClusterTab,
  size: number,
  sort: ClusterSort,
  cursor?: string | null,
) {
  return useQuery<ClusterFeedResponse>({
    queryKey: ['clusters', tab, size, sort, cursor],
    queryFn: async () => {
      const params: Record<string, string | number> = { size, sort }
      if (tab !== 'ALL') params.tab = tab
      if (cursor) params.cursor = cursor

      const { data } = await apiClient.get('/news/clusters', { params })
      return data.data
    },
  })
}

export function useClusterDetail(clusterId: number) {
  return useQuery<ClusterDetail>({
    queryKey: ['cluster', clusterId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/news/clusters/${clusterId}`)
      return data.data
    },
    enabled: clusterId > 0,
  })
}
