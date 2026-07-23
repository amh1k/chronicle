import * as z from "zod";

const ProjectCreationSchema = z.object({
  ownerId: z.string(),
  respositoryFullName: z
    .string()
    .min(1, "Repository name is required")
    .max(100, "Repository name is too long")
    .regex(/^(?!\.)(?!.*\.$)[A-Za-z0-9._-]+$/, "Invalid repository name"),
  defaultBranch: z
    .string()
    .min(1, "Default branch is required")
    .max(255, "Branch name is too long"),

  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});

const ProjectDeletionSchema = z.object({
  id: z.object(),
});
