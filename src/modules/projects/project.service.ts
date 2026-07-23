import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { CreateProjectInput, DeleteProjectInput } from "./project.schema";
import { showAllProjectsForUser } from "./project.controller";

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

export const showAllProjectsForUserService = async (
  userId: string,
  options = {},
) => {
  const { limit = 20, page = 1 } = options as any;

  return await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    // include: {

    //   runs: {
    //     take: 3,
    //     orderBy: { createdAt: "desc" },
    //     select: { id: true, status: true, createdAt: true },
    //   },
    // },
    skip: (page - 1) * limit,
    take: limit,
  });
};
export const showProjectService = async (projectId: string) => {
  return await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      runs: {
        take: 3,
        orderBy: { createdAt: "desc" },
      },
      environmentSpecs: {
        take: 3,
      },
      scenarios: {
        take: 3,
      },
    },
  });
};
