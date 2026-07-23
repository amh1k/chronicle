import { Router } from "express";
import { createProject, deleteProject } from "./project.controller";

const router = Router();
router.post("/create", createProject);
router.post("/delete", deleteProject);
