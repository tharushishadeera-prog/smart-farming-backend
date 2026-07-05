"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExpenses = exports.deleteExpense = exports.updateExpense = exports.getExpenses = exports.createExpense = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
const createExpense = async (req, res) => {
    try {
        const { title, amount, category, date, userId } = req.body;
        //userId එකක් frontend එකෙන් එන්නේ නැත්නම් test එකක් විදියට hardcode කරලා බලන්න
        //පසුව එය auth middleware එක හරහා ලබාගන්න
        const finalUserId = userId || "660d1234567890abcdef1234";
        const newExpense = new Expense_1.default({
            user: finalUserId,
            title,
            amount,
            category,
            date,
        });
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    }
    catch (error) {
        console.error("Backend Error:", error); // Terminal එකේ error එක හරියට බලාගන්න මේක උදව් වෙනවා
        res.status(500).json({ message: "Error creating expense", error });
    }
};
exports.createExpense = createExpense;
const getExpenses = async (req, res) => {
    try {
        const { userId } = req.params;
        const expenses = await Expense_1.default.find({ user: userId }).sort({ date: -1 });
        res.status(200).json(expenses);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching expenses", error });
    }
};
exports.getExpenses = getExpenses;
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        // new: true වෙනුවට returnDocument: 'after' පාවිච්චි කරන්න
        const updatedExpense = await Expense_1.default.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
        if (!updatedExpense) {
            res.status(404).json({ message: "Expense not found" });
            return;
        }
        res.status(200).json(updatedExpense);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating expense", error });
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        await Expense_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Expense Deleted Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting expense", error });
    }
};
exports.deleteExpense = deleteExpense;
// Admin සඳහා සියලුම වියදම් ලබාගැනීම
const getAllExpenses = async (req, res) => {
    try {
        // .populate එකේදී නම පමණක් නොවෙයි, සම්පූර්ණ user object එකම ඉල්ලන්න
        const allExpenses = await Expense_1.default.find().populate('user', 'name');
        res.status(200).json(allExpenses);
    }
    catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};
exports.getAllExpenses = getAllExpenses;
