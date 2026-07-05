import express from "express";
import { getWeatherData } from "../controllers/weatherController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// GET /api/weather/data
router.get("/data", protect, getWeatherData);

export default router;