"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.getUserProfile = exports.updateUser = exports.deleteUser = exports.addUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const Expense_1 = __importDefault(require("../models/Expense"));
const Crop_1 = __importDefault(require("../models/Crop"));
// 1. සියලුම පරිශීලකයින් (Users) ලබා ගැනීම
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllUsers = getAllUsers;
// 2. අලුත් පරිශීලකයෙකු එක් කිරීම
const addUser = async (req, res) => {
    const { name, email, role, status } = req.body;
    try {
        const newUser = new User_1.default({ name, email, role, status: status || 'Active' });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.addUser = addUser;
// 3. පරිශීලකයෙකු මකා දැමීම (Delete)
const deleteUser = async (req, res) => {
    try {
        await User_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteUser = deleteUser;
// 4. පරිශීලක තොරතුරු යාවත්කාලීන කිරීම (Update/Edit)
const updateUser = async (req, res) => {
    try {
        const updatedUser = await User_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateUser = updateUser;
// userController.ts තුළ
// 1. Profile එක ගන්න (මේක Admin සහ Farmer දෙන්නටම වැඩ)
const getUserProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id).select('-password');
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserProfile = getUserProfile;
const getDashboardStats = async (req, res) => {
    try {
        // 1. ගණන් කිරීම් ටික
        const usersCount = await User_1.default.countDocuments();
        const farmersCount = await User_1.default.countDocuments({ role: 'FARMER' });
        const cropsCount = await Crop_1.default.countDocuments();
        // 2. Expense එකතුව (Total Expenses) Database එකෙන් ලබා ගැනීම
        // aggregate භාවිතා කරන්නේ සියලුම amount එකතු කිරීමටයි
        const expensesStats = await Expense_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: "$amount" }
                }
            }
        ]);
        const totalEarnings = expensesStats.length > 0 ? expensesStats[0].totalExpenses : 0;
        // 3. ප්‍රතිඵලය යැවීම
        res.status(200).json({
            users: usersCount,
            farmers: farmersCount,
            crops: cropsCount,
            earnings: totalEarnings
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching stats: " + error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
