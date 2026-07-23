export interface Outbox {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: unknown;
  publishedAt: Date | null;
}

