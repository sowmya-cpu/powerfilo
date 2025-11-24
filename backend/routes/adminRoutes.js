import express from "express";
import {
  getAllProjectsAdmin,
  updateProjectStatus,
  getAllUsersAdmin,
  getAnalytics
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/projects", getAllProjectsAdmin);
router.put("/projects/:id/status", updateProjectStatus);
router.get("/users", getAllUsersAdmin);
router.get("/analytics", getAnalytics);

export default router;
