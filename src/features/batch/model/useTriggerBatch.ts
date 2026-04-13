import { useMutation } from '@tanstack/react-query'

import { triggerBatch, type BatchTriggerResult } from '../api/triggerBatch'
import type { BatchEnv, BatchItem } from '../config'

export function useTriggerBatch() {
  return useMutation<BatchTriggerResult, Error, { env: BatchEnv; item: BatchItem }>({
    mutationFn: ({ env, item }) => triggerBatch(env, item),
  })
}
