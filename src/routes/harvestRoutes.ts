import express from "express";
import { createHarvest, getHarvestsByCrop, getAllHarvests ,updateHarvest,deleteHarvest} from "../controllers/harvestController";
import { isAdmin } from "../middleware/adminMiddleware";
import { protect } from "../middleware/authMiddleware"; // Authentication middleware එක
// පරණ එක වෙනුවට
// import { getDashboardStats } from "../controllers/dashboardController";


const router = express.Router();

router.post("/add", protect, createHarvest);
router.get("/crop/:cropId", protect, getHarvestsByCrop);
// GET /api/harvests/stats (මේ route එකට තමයි අපි dashboard දත්ත යවන්නේ)
// router.get("/stats", protect, getDashboardStats);


router.get("/admin/all", protect, isAdmin, getAllHarvests);
router.put("/:id", protect, updateHarvest);    // Edit සඳහා
router.delete("/:id", protect, deleteHarvest);

export default router;