import { Router } from "express";
import {
  createProject,
  deleteProject,
  showAllProjectsForUser,
  showProject,
} from "./project.controller";
import { verifySession } from "../../middleware/auth.middleware";

const router = Router();
router.post("/create", verifySession, createProject);
router.delete("/delete", verifySession, deleteProject);
router.get("/all", verifySession, showAllProjectsForUser);
router.get("/:id", verifySession, showProject);

export default router;
