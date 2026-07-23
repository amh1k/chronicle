export interface Run {
  id: string;
  projectId: string;
  requestedCommit: string | null;
  resolvedCommit: string | null;
  status: string;
  requestedById: string;
  createdAt: Date;
}

