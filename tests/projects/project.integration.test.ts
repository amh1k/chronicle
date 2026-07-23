import { EventEmitter } from "node:events";
import cookieParser from "cookie-parser";
import express from "express";
import { createRequest, createResponse } from "node-mocks-http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import projectRouter from "../../src/modules/projects/project.route";
import { prisma } from "../../src/lib/prisma";
import * as userService from "../../src/modules/users/user.service";

async function runRequest(
  app: express.Express,
  options: Parameters<typeof createRequest>[0],
) {
  const req = createRequest(options);
  const res = createResponse({ eventEmitter: EventEmitter });

  await new Promise<void>((resolve) => {
    res.on("end", resolve);
    (app as any).handle(req, res);
  });

  return res;
}

describe("project module integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a project through the real router and middleware chain", async () => {
    vi.spyOn(userService, "getUserFromSessionToken").mockResolvedValue({
      user: { id: "user_1" },
    } as never);

    vi.spyOn(prisma.project, "create").mockResolvedValue({
      id: "proj_1",
      ownerId: "user_1",
      repositoryFullName: "org/repo",
      defaultBranch: "main",
      visibility: "PUBLIC",
    } as never);

    const app = express();
    app.use(cookieParser());
    app.use(express.json());
    app.use("/api/projects", projectRouter);

    const response = await runRequest(app, {
      method: "POST",
      url: "/api/projects/create",
      cookies: {
        sessionToken: "test-token",
      },
      body: {
        repositoryFullName: "org/repo",
        defaultBranch: "main",
        visibility: "PUBLIC",
      },
    });

    expect(response._getStatusCode()).toBe(201);
    expect(response._getJSONData()).toMatchObject({
      status: "success",
      data: {
        id: "proj_1",
        ownerId: "user_1",
      },
    });
  });

  it("returns projects for the authenticated user via the real route", async () => {
    vi.spyOn(userService, "getUserFromSessionToken").mockResolvedValue({
      user: { id: "user_1" },
    } as never);

    vi.spyOn(prisma.project, "findMany").mockResolvedValue([
      {
        id: "proj_1",
        ownerId: "user_1",
        repositoryFullName: "org/repo",
        defaultBranch: "main",
        visibility: "PUBLIC",
      },
    ] as never);

    const app = express();
    app.use(cookieParser());
    app.use(express.json());
    app.use("/api/projects", projectRouter);

    const response = await runRequest(app, {
      method: "GET",
      url: "/api/projects/all",
      cookies: {
        sessionToken: "test-token",
      },
    });

    expect(response._getStatusCode()).toBe(201);
    expect(response._getJSONData()).toMatchObject({
      success: true,
      data: [{ id: "proj_1" }],
    });
  });
});
