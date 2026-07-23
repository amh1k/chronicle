import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { CreateProjectInput } from "./project.schema";

export const createProjectService = async (input: CreateProjectInput) => {
  try {
    const result = await prisma.project.create({
      data: {
        ownerId: input.ownerId,
        repositoryFullName: input.repositoryFullName,
        defaultBranch: input.defaultBranch,
        visibility: input.visibility,
      },
    });
    return result;
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(400, err?.message);
    } else {
      throw new ApiError(400, "Project creation failed for unknown reason");
    }
  }
};

export const deleteProjectService = async () => {};
