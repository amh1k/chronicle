import { Request, Response } from "express";
import { ProjectCreationSchema } from "./project.schema";
import { createProjectService } from "./project.service";

export const createProject = async (req: Request, res: Response) => {
  try {
    const result = ProjectCreationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error.flatten());
    }
    const creationResult = await createProjectService(result.data);
  } catch (err) {}
};

export const deleteProject = async (req: Request, res: Response) => {};
