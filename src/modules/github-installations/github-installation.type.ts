export interface GitHubInstallation {
  id: string;
  userId: string;
  installationId: bigint;
  accountLogin: string | null;
  suspendedAt: Date | null;
}

