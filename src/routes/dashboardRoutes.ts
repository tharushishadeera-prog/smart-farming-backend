import express from "express";
import { getDashboardStats, getChartData } from "../controllers/dashboardController";
import { protect } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";

const router = express.Router();

// GET /api/dashboard/stats
router.get("/stats", protect, getDashboardStats);
router.get("/chart", protect, getChartData);
router.get("/stats", protect, isAdmin, getDashboardStats); // Stats API

export default router;