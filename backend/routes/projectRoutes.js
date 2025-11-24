// backend/routes/projectRoutes.js
import express from "express";
import {
  createProject,
  getPublicProjects,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  recommendSimple
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// public
router.get("/", getPublicProjects);

// protected routes
router.use(protect);
router.post("/", createProject);
router.get("/me", getMyProjects);

// AI-based recommendations (must be BEFORE "/:id")
router.get("/:id/recommend", recommendSimple);

router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
