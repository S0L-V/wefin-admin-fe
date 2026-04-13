export type BatchEnv = 'local' | 'dev' | 'prod'

export const BATCH_ENV_LABELS: Record<BatchEnv, string> = {
  local: 'Local',
  dev: 'Dev',
  prod: 'Prod',
}

export function getBatchBaseUrl(env: BatchEnv): string {
  if (env === 'local') return ''
  if (env === 'dev') return import.meta.env.VITE_DEV_API_URL ?? ''
  return import.meta.env.VITE_PROD_API_URL ?? ''
}

export type BatchItem = {
  id: string
  label: string
  description: string
  method: 'POST'
  path: string
  group: string
}

export const BATCH_ITEMS: BatchItem[] = [
  {
    id: 'news-collect',
    label: '뉴스 수집',
    description: '외부 뉴스 API에서 기사 메타데이터를 수집한다',
    method: 'POST',
    path: '/api/admin/news/collect',
    group: 'News',
  },
  {
    id: 'news-crawl',
    label: '뉴스 크롤링',
    description: '대기 중인 기사의 본문을 크롤링한다',
    method: 'POST',
    path: '/api/admin/news/crawl',
    group: 'News',
  },
  {
    id: 'relevance-rejudge-pending',
    label: '관련도 재판정 (Pending)',
    description: '관련도 판정 대기 중인 기사를 재판정한다',
    method: 'POST',
    path: '/api/admin/news/relevance/rejudge/pending',
    group: 'News',
  },
  {
    id: 'embeddings-generate',
    label: '임베딩 생성',
    description: '미처리 기사 임베딩을 생성한다',
    method: 'POST',
    path: '/api/admin/news/embeddings/generate',
    group: 'News',
  },
  {
    id: 'tagging-generate',
    label: '태깅 생성',
    description: '미태깅 기사에 대해 태깅을 수행한다',
    method: 'POST',
    path: '/api/admin/news/tagging/generate',
    group: 'News',
  },
  {
    id: 'summary-trigger',
    label: 'AI 요약 생성',
    description: '미요약 기사에 대해 AI 요약을 생성한다',
    method: 'POST',
    path: '/api/admin/news/summary/trigger',
    group: 'News',
  },
  {
    id: 'clustering-trigger',
    label: '클러스터링',
    description: '기사 클러스터링을 수행한다',
    method: 'POST',
    path: '/api/admin/news/clustering/trigger',
    group: 'Clustering',
  },
  {
    id: 'cluster-merge',
    label: '클러스터 병합',
    description: '유사 클러스터를 병합한다',
    method: 'POST',
    path: '/api/admin/news/clustering/merge',
    group: 'Clustering',
  },
  {
    id: 'market-collect',
    label: '시장 스냅샷 수집',
    description: 'KOSPI/NASDAQ/환율 등 시장 지표를 수집한다',
    method: 'POST',
    path: '/api/admin/market/collect',
    group: 'Market',
  },
  {
    id: 'game-init',
    label: '게임 종목 초기화',
    description: 'CSV로부터 게임 종목 마스터를 초기화한다',
    method: 'POST',
    path: '/api/admin/batch/init',
    group: 'Game',
  },
  {
    id: 'game-collect',
    label: '게임 일별 시세 수집',
    description: '게임용 일별 시세를 수집한다 (size=320)',
    method: 'POST',
    path: '/api/admin/batch/collect?size=320',
    group: 'Game',
  },
  {
    id: 'game-news',
    label: '게임 뉴스 수집',
    description: '게임용 뉴스를 수집한다 (days=150)',
    method: 'POST',
    path: '/api/admin/batch/news?days=150',
    group: 'Game',
  },
]
