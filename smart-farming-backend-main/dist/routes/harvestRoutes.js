"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const harvestController_1 = require("../controllers/harvestController");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware"); // Authentication middleware එක
// පරණ එක වෙනුවට
// import { getDashboardStats } from "../controllers/dashboardController";
const router = express_1.default.Router();
router.post("/add", authMiddleware_1.protect, harvestController_1.createHarvest);
router.get("/crop/:cropId", authMiddleware_1.protect, harvestController_1.getHarvestsByCrop);
// GET /api/harvests/stats (මේ route එකට තමයි අපි dashboard දත්ත යවන්නේ)
// router.get("/stats", protect, getDashboardStats);
router.get("/admin/all", authMiddleware_1.protect, adminMiddleware_1.isAdmin, harvestController_1.getAllHarvests);
router.put("/:id", authMiddleware_1.protect, harvestController_1.updateHarvest); // Edit සඳහා
router.delete("/:id", authMiddleware_1.protect, harvestController_1.deleteHarvest);
exports.default = router;
