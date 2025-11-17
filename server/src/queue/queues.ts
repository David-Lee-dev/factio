/**
 * Bull 작업 큐 이름 상수 정의
 */
export const QUEUE_NAMES = {
  LLM_EXTRACT: 'llm-extract',
  FACT_CHECK: 'fact-check',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
