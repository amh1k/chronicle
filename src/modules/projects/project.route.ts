import { Router } from "express";
import { createProject, deleteProject } from "./project.controller";
import { verifySession } from "../../middleware/auth.middleware";

const router = Router();
router.post("/create", verifySession, createProject);
router.post("/delete", verifySession, deleteProject);

export default router;
