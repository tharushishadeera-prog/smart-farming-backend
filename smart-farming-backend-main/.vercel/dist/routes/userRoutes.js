"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController"); // import එක update කරන්න
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', userController_1.getAllUsers);
router.post('/add', userController_1.addUser);
router.delete('/delete/:id', userController_1.deleteUser); // Delete Route
router.put('/update/:id', userController_1.updateUser); // Update Route
router.get("/profile", authMiddleware_1.protect, userController_1.getUserProfile);
exports.default = router;
