"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const weatherController_1 = require("../controllers/weatherController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// GET /api/weather/data
router.get("/data", authMiddleware_1.protect, weatherController_1.getWeatherData);
exports.default = router;
