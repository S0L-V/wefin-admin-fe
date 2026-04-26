export type TagFilterType = 'SECTOR' | 'STOCK'

export interface PopularTag {
  code: string
  name: string
  clusterCount: number
}
