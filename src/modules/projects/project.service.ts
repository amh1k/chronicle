import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { CreateProjectInput, DeleteProjectInput } from "./project.schema";

export const createProjectService = async (
  input: CreateProjectInput,
  ownerId: string,
) => {
  try {
    return await prisma.project.create({
      data: {
        ownerId: ownerId,
        repositoryFullName: input.repositoryFullName,
        defaultBranch: input.defaultBranch,
        visibility: input.visibility,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(400, err.message);
    }
    throw new ApiError(400, "Project creation failed");
  }
};

export const deleteProjectService = async (input: DeleteProjectInput) => {
  try {
    return await prisma.project.delete({
      where: {
        id: input.id,
      },
    });
  } catch (err) {
    throw new ApiError(500, "Failed to delete project");
  }
};
