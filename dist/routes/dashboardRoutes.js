"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = express_1.default.Router();
// GET /api/dashboard/stats
router.get("/stats", authMiddleware_1.protect, dashboardController_1.getDashboardStats);
router.get("/chart", authMiddleware_1.protect, dashboardController_1.getChartData);
router.get("/stats", authMiddleware_1.protect, adminMiddleware_1.isAdmin, dashboardController_1.getDashboardStats); // Stats API
exports.default = router;
