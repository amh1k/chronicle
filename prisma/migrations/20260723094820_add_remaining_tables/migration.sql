-- CreateTable
CREATE TABLE "github_installations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "installationId" BIGINT NOT NULL,
    "accountLogin" TEXT,
    "suspendedAt" TIMESTAMP(3),

    CONSTRAINT "github_installations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "repositoryFullName" TEXT NOT NULL,
    "defaultBranch" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environment_specs" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "objectKey" TEXT NOT NULL,
    "schemaVersion" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,

    CONSTRAINT "environment_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "objectKey" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "runs" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "requestedCommit" TEXT,
    "resolvedCommit" TEXT,
    "status" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "run_attempts" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "runnerId" TEXT,
    "leaseToken" TEXT NOT NULL,
    "leaseExpiresAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "run_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "runner_nodes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "runtimeVersion" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "lastHeartbeatAt" TIMESTAMP(3) NOT NULL,
    "draining" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "runner_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artifacts" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "sha256" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,

    CONSTRAINT "artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox" (
    "id" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "github_installations_installationId_key" ON "github_installations"("installationId");

-- CreateIndex
CREATE INDEX "github_installations_userId_idx" ON "github_installations"("userId");

-- CreateIndex
CREATE INDEX "projects_ownerId_idx" ON "projects"("ownerId");

-- CreateIndex
CREATE INDEX "projects_repositoryFullName_idx" ON "projects"("repositoryFullName");

-- CreateIndex
CREATE INDEX "environment_specs_projectId_idx" ON "environment_specs"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "environment_specs_projectId_version_key" ON "environment_specs"("projectId", "version");

-- CreateIndex
CREATE INDEX "scenarios_projectId_idx" ON "scenarios"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "scenarios_projectId_name_version_key" ON "scenarios"("projectId", "name", "version");

-- CreateIndex
CREATE INDEX "runs_projectId_status_createdAt_idx" ON "runs"("projectId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "runs_resolvedCommit_idx" ON "runs"("resolvedCommit");

-- CreateIndex
CREATE INDEX "runs_requestedById_idx" ON "runs"("requestedById");

-- CreateIndex
CREATE UNIQUE INDEX "run_attempts_leaseToken_key" ON "run_attempts"("leaseToken");

-- CreateIndex
CREATE INDEX "run_attempts_runId_idx" ON "run_attempts"("runId");

-- CreateIndex
CREATE INDEX "run_attempts_leaseExpiresAt_idx" ON "run_attempts"("leaseExpiresAt");

-- CreateIndex
CREATE INDEX "run_attempts_runnerId_idx" ON "run_attempts"("runnerId");

-- CreateIndex
CREATE INDEX "runner_nodes_lastHeartbeatAt_idx" ON "runner_nodes"("lastHeartbeatAt");

-- CreateIndex
CREATE INDEX "artifacts_attemptId_kind_idx" ON "artifacts"("attemptId", "kind");

-- CreateIndex
CREATE INDEX "outbox_published_at_idx" ON "outbox"("publishedAt");

-- AddForeignKey
ALTER TABLE "github_installations" ADD CONSTRAINT "github_installations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_specs" ADD CONSTRAINT "environment_specs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runs" ADD CONSTRAINT "runs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runs" ADD CONSTRAINT "runs_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run_attempts" ADD CONSTRAINT "run_attempts_runId_fkey" FOREIGN KEY ("runId") REFERENCES "runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run_attempts" ADD CONSTRAINT "run_attempts_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "runner_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "run_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
