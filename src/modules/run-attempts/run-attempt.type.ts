export interface RunAttempt {
  id: string;
  runId: string;
  runnerId: string | null;
  leaseToken: string;
  leaseExpiresAt: Date | null;
  status: string;
  startedAt: Date | null;
  endedAt: Date | null;
}

