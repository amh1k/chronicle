export interface Artifact {
  id: string;
  attemptId: string;
  kind: string;
  objectKey: string;
  sizeBytes: bigint;
  sha256: string;
  contentType: string;
}

