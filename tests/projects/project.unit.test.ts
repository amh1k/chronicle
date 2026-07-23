import { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/lib/prisma";
import { ApiError } from "../../src/utils/apiError";
import {
  createProject,
  deleteProject,
  showAllProjectsForUser,
  showProject,
} from "../../src/modules/projects/project.controller";
import {
  createProjectService,
  deleteProjectService,
  showAllProjectsForUserService,
  showProjectService,
} from "../../src/modules/projects/project.service";

function mockResponse() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("project module unit tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a project for the authenticated user", async () => {
    const createSpy = vi.spyOn(prisma.project, "create").mockResolvedValue({
      id: "proj_1",
      ownerId: "user_1",
      repositoryFullName: "org/repo",
      defaultBranch: "main",
      visibility: "PUBLIC",
    } as never);

    const result = await createProjectService(
      {
        repositoryFullName: "org/repo",
        defaultBranch: "main",
        visibility: "PUBLIC",
      },
      "user_1",
    );

    expect(createSpy).toHaveBeenCalledWith({
      data: {
        ownerId: "user_1",
        repositoryFullName: "org/repo",
        defaultBranch: "main",
        visibility: "PUBLIC",
      },
    });
    expect(result).toMatchObject({ id: "proj_1", ownerId: "user_1" });
  });

  it("maps create errors to ApiError", async () => {
    vi.spyOn(prisma.project, "create").mockRejectedValue(new Error("db down"));

    await expect(
      createProjectService(
        {
          repositoryFullName: "org/repo",
          defaultBranch: "main",
          visibility: "PUBLIC",
        },
        "user_1",
      ),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("deletes a project by id", async () => {
    const deleteSpy = vi.spyOn(prisma.project, "delete").mockResolvedValue({
      id: "proj_1",
      ownerId: "user_1",
      repositoryFullName: "org/repo",
      defaultBranch: "main",
      visibility: "PUBLIC",
    } as never);

    const result = await deleteProjectService({ id: "proj_1" });

    expect(deleteSpy).toHaveBeenCalledWith({ where: { id: "proj_1" } });
    expect(result).toMatchObject({ id: "proj_1" });
  });

  it("lists a user's projects with pagination defaults", async () => {
    const findManySpy = vi.spyOn(prisma.project, "findMany").mockResolvedValue([]);

    await showAllProjectsForUserService("user_1");

    expect(findManySpy).toHaveBeenCalledWith({
      where: { ownerId: "user_1" },
      skip: 0,
      take: 20,
    });
  });

  it("loads a project with recent runs and related records", async () => {
    const findUniqueSpy = vi.spyOn(prisma.project, "findUnique").mockResolvedValue(null);

    await showProjectService("proj_1");

    expect(findUniqueSpy).toHaveBeenCalledWith({
      where: { id: "proj_1" },
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
  });

  it("returns 201 when creating a project through the controller", async () => {
    vi.spyOn(prisma.project, "create").mockResolvedValue({
      id: "proj_1",
      ownerId: "user_1",
      repositoryFullName: "org/repo",
      defaultBranch: "main",
      visibility: "PUBLIC",
    } as never);

    const req = {
      body: {
        repositoryFullName: "org/repo",
        defaultBranch: "main",
        visibility: "PUBLIC",
      },
      user: { id: "user_1" },
    } as Partial<Request> as Request;
    const res = mockResponse();

    await createProject(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
      }),
    );
  });

  it("returns 400 when project creation payload is invalid", async () => {
    const req = {
      body: {
        repositoryFullName: "",
        defaultBranch: "main",
        visibility: "PUBLIC",
      },
      user: { id: "user_1" },
    } as Partial<Request> as Request;
    const res = mockResponse();

    await createProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
      }),
    );
  });

  it("returns 201 when deleting a project through the controller", async () => {
    vi.spyOn(prisma.project, "delete").mockResolvedValue({
      id: "proj_1",
      ownerId: "user_1",
      repositoryFullName: "org/repo",
      defaultBranch: "main",
      visibility: "PUBLIC",
    } as never);

    const req = {
      body: { id: "proj_1" },
    } as Partial<Request> as Request;
    const res = mockResponse();

    await deleteProject(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
      }),
    );
  });

  it("returns 200 when showing a project through the controller", async () => {
    vi.spyOn(prisma.project, "findUnique").mockResolvedValue({
      id: "proj_1",
      ownerId: "user_1",
      repositoryFullName: "org/repo",
      defaultBranch: "main",
      visibility: "PUBLIC",
      runs: [],
      environmentSpecs: [],
      scenarios: [],
    } as never);

    const req = {
      params: { id: "proj_1" },
    } as Partial<Request> as Request;
    const res = mockResponse();

    await showProject(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      }),
    );
  });

  it("returns 201 when listing projects through the controller", async () => {
    vi.spyOn(prisma.project, "findMany").mockResolvedValue([] as never);

    const req = {
      user: { id: "user_1" },
    } as Partial<Request> as Request;
    const res = mockResponse();

    await showAllProjectsForUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      }),
    );
  });
});
