import { Badge } from './Badge'

const STATUS_VARIANT: Record<string, string> = {
  // CrawlStatus
  PENDING: 'warning',
  SUCCESS: 'success',
  FAILED: 'error',
  SKIPPED: 'neutral',
  // EmbeddingStatus / TaggingStatus
  PROCESSING: 'info',
  // RelevanceStatus
  FINANCIAL: 'success',
  IRRELEVANT: 'neutral',
  // ClusterStatus
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  // SummaryStatus
  GENERATED: 'success',
  STALE: 'warning',
  // ClusterType
  STOCK: 'info',
  SECTOR: 'warning',
  TOPIC: 'success',
  GENERAL: 'neutral',
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = STATUS_VARIANT[status] ?? 'neutral'
  return <Badge variant={variant}>{status}</Badge>
}
