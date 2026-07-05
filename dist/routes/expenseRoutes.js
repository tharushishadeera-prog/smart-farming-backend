"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseController_1 = require("../controllers/expenseController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
// const router = express.Router();
// router.post("/add",createExpense);
// router.get("/user/:userId",getExpenses);
// router.put("/update/:id",updateExpense);
// router.delete("/delete/:id",deleteExpense);
// router.delete("/:id", protect, deleteExpense);
// router.get("/admin/all", protect, isAdmin, getAllExpenses);
const router = express_1.default.Router();
// ආරක්ෂිත රවුට්ස් (admin/user)
router.get("/admin/all", authMiddleware_1.protect, adminMiddleware_1.isAdmin, expenseController_1.getAllExpenses);
router.get("/user/:userId", authMiddleware_1.protect, expenseController_1.getExpenses);
// මූලික රවුට්ස් (මේවා එකපාරටම හදාගන්න)
router.post("/", authMiddleware_1.protect, expenseController_1.createExpense); // /api/expenses/
router.put("/:id", authMiddleware_1.protect, expenseController_1.updateExpense); // /api/expenses/:id
router.delete("/:id", authMiddleware_1.protect, expenseController_1.deleteExpense); // /api/expenses/:id
exports.default = router;
