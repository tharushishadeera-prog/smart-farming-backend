"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _cropController_1 = require("../controllers/ cropController");
// import { protect } from "../middleware/authMiddleware";
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, _cropController_1.addCrop);
router.get("/", authMiddleware_1.protect, _cropController_1.getMyCrops);
router.put("/:id", authMiddleware_1.protect, _cropController_1.updateCrop);
router.delete("/:id", authMiddleware_1.protect, _cropController_1.deleteCrop);
router.get("/admin/all", authMiddleware_1.protect, adminMiddleware_1.isAdmin, _cropController_1.getMyCrops);
exports.default = router;
