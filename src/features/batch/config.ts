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
  // 뉴스 파이프라인: 수집 → 크롤링 → 임베딩 → 클러스터링 → 병합 → 태깅 → 요약
  {
    id: 'news-collect',
    label: '1. 뉴스 수집',
    description: '외부 뉴스 API에서 기사 메타데이터를 수집한다',
    method: 'POST',
    path: '/api/admin/news/collect',
    group: '뉴스 파이프라인',
  },
  {
    id: 'news-crawl',
    label: '2. 뉴스 크롤링',
    description: '대기 중인 기사의 본문을 크롤링한다',
    method: 'POST',
    path: '/api/admin/news/crawl',
    group: '뉴스 파이프라인',
  },
  {
    id: 'embeddings-generate',
    label: '3. 임베딩 생성',
    description: '미처리 기사 임베딩을 생성한다',
    method: 'POST',
    path: '/api/admin/news/embeddings/generate',
    group: '뉴스 파이프라인',
  },
  {
    id: 'tagging-generate',
    label: '4. 태깅 생성',
    description: '미태깅 기사에 대해 태깅을 수행한다 (클러스터링의 suspicious-score 검증에 사용)',
    method: 'POST',
    path: '/api/admin/news/tagging/generate',
    group: '뉴스 파이프라인',
  },
  {
    id: 'clustering-trigger',
    label: '5. 클러스터링',
    description: '기사 클러스터링을 수행한다 (태깅 결과로 유사도 검증)',
    method: 'POST',
    path: '/api/admin/news/clustering/trigger',
    group: '뉴스 파이프라인',
  },
  {
    id: 'summary-trigger',
    label: '6. AI 요약 생성',
    description: '미요약 기사에 대해 AI 요약을 생성한다',
    method: 'POST',
    path: '/api/admin/news/summary/trigger',
    group: '뉴스 파이프라인',
  },
  {
    id: 'cluster-merge',
    label: '(선택) 클러스터 병합',
    description: '유사 클러스터를 병합해 품질을 보완한다. 필요 시 수동 실행',
    method: 'POST',
    path: '/api/admin/news/clustering/merge',
    group: '뉴스 파이프라인',
  },
  {
    id: 'relevance-rejudge-pending',
    label: '(선택) 관련도 재판정',
    description: '관련도 판정 대기 중인 기사를 재판정한다. 필요 시 수동 실행',
    method: 'POST',
    path: '/api/admin/news/relevance/rejudge/pending',
    group: '뉴스 파이프라인',
  },

  // 시장: 스냅샷 수집 → 동향 생성
  {
    id: 'market-collect',
    label: '1. 시장 스냅샷 수집',
    description: 'KOSPI/NASDAQ/환율 등 시장 지표를 수집한다',
    method: 'POST',
    path: '/api/admin/market/collect',
    group: '시장 파이프라인',
  },
  {
    id: 'market-trend-trigger',
    label: '2. 금융 동향 생성',
    description: '시장 지표 + 최근 24시간 뉴스 클러스터를 종합해 오늘의 금융 동향을 AI로 생성한다',
    method: 'POST',
    path: '/api/admin/market-trends/trigger',
    group: '시장 파이프라인',
  },

  // 게임: 종목 초기화 → 시세 수집 → 뉴스 수집
  {
    id: 'game-init',
    label: '1. 게임 종목 초기화',
    description: 'CSV로부터 게임 종목 마스터를 초기화한다',
    method: 'POST',
    path: '/api/admin/batch/init',
    group: '게임 파이프라인',
  },
  {
    id: 'game-collect',
    label: '2. 게임 일별 시세 수집',
    description: '게임용 일별 시세를 수집한다 (size=320)',
    method: 'POST',
    path: '/api/admin/batch/collect?size=320',
    group: '게임 파이프라인',
  },
  {
    id: 'game-news',
    label: '3. 게임 뉴스 수집',
    description: '게임용 뉴스를 수집한다 (days=150)',
    method: 'POST',
    path: '/api/admin/batch/news?days=150',
    group: '게임 파이프라인',
  },
]
