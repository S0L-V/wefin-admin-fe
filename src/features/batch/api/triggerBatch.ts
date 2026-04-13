import axios, { AxiosError } from 'axios'

import { getBatchBaseUrl, type BatchEnv, type BatchItem } from '../config'

export type BatchTriggerResult = {
  status: number
  data: unknown
}

export async function triggerBatch(env: BatchEnv, item: BatchItem): Promise<BatchTriggerResult> {
  const baseUrl = getBatchBaseUrl(env)
  if (env !== 'local' && !baseUrl) {
    throw new Error(`${env.toUpperCase()} API URL이 설정되지 않았습니다 (VITE_${env.toUpperCase()}_API_URL)`)
  }

  try {
    const response = await axios.request({
      method: item.method,
      url: `${baseUrl}${item.path}`,
      timeout: 120_000,
      headers: { 'Content-Type': 'application/json' },
    })
    return { status: response.status, data: response.data }
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? 0
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message
      throw new Error(`[${status || 'NETWORK'}] ${message}`)
    }
    throw error
  }
}
