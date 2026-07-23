import { Request, Response } from "express";
import { ProjectCreationSchema, ProjectDeletionSchema } from "./project.schema";
import {
  createProjectService,
  deleteProjectService,
  showAllProjectsForUserService,
  showProjectService,
} from "./project.service";
import { requestParseFailureMessage } from "../../constants/constants";
import { success } from "zod";
import { ApiError } from "../../utils/apiError";
import { getParam } from "../../utils/param";

export const createProject = async (req: Request, res: Response) => {
  try {
    const result = ProjectCreationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: "fail",
        message: requestParseFailureMessage,
      });
    }
    const ownerId = req.user?.id;
    if (!ownerId) {
      return res.status(400).json({
        status: "fail",
        message: requestParseFailureMessage,
      });
    }
    const creationResult = await createProjectService(result.data, ownerId);
    return res.status(201).json({
      status: "success",
      data: creationResult,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data or database error",
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const result = ProjectDeletionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: "fail",
        message: requestParseFailureMessage,
      });
    }
    const deletionResult = await deleteProjectService(result.data);
    return res.status(201).json({
      status: "success",
      data: deletionResult,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data or database error",
    });
  }
};

export const showAllProjectsForUser = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;
    if (!id) {
      return;
    }
    const projects = await showAllProjectsForUserService(id);

    return res.status(201).json({
      success: true,
      data: projects,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data or database error",
    });
  }
};

export const showProject = async (req: Request, res: Response) => {
  try {
    const projectId = getParam(req.params, "id");
    if (!projectId) {
      throw new ApiError(400, "Project ID is required");
    }
    const projectData = await showProjectService(projectId);
    if (!projectData) {
      throw new ApiError(400, "Project with id not found");
    }
    return res.status(200).json({
      success: true,
      data: projectData,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data or database error",
    });
  }
};
