import express from "express";
import { createExpense,getExpenses,updateExpense,deleteExpense,getAllExpenses } from "../controllers/expenseController";
import { protect } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";

// const router = express.Router();

// router.post("/add",createExpense);
// router.get("/user/:userId",getExpenses);
// router.put("/update/:id",updateExpense);
// router.delete("/delete/:id",deleteExpense);

// router.delete("/:id", protect, deleteExpense);
// router.get("/admin/all", protect, isAdmin, getAllExpenses);
const router = express.Router();

// ආරක්ෂිත රවුට්ස් (admin/user)
router.get("/admin/all", protect, isAdmin, getAllExpenses);
router.get("/user/:userId", protect, getExpenses);

// මූලික රවුට්ස් (මේවා එකපාරටම හදාගන්න)
router.post("/", protect, createExpense); // /api/expenses/
router.put("/:id", protect, updateExpense); // /api/expenses/:id
router.delete("/:id", protect, deleteExpense); // /api/expenses/:id



export default router;

