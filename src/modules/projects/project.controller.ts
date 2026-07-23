import { Request, Response } from "express";
import { ProjectCreationSchema, ProjectDeletionSchema } from "./project.schema";
import { createProjectService, deleteProjectService } from "./project.service";
import { requestParseFailureMessage } from "../../constants/constants";

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
