import { Request, Response } from 'express';
import User from '../models/User';
import Expense from '../models/Expense';
import Crop from '../models/Crop';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addUser = async (req: Request, res: Response) => {
    const { name, email, role, status } = req.body;
    try {
        const newUser = new User({ name, email, role, status: status || 'Active' });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
export const deleteUser = async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// userController.ts තුළ

// 1. Profile එක ගන්න (මේක Admin සහ Farmer දෙන්නටම වැඩ)
export const getUserProfile = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // 1. ගණන් කිරීම් ටික
        const usersCount = await User.countDocuments();
        const farmersCount = await User.countDocuments({ role: 'FARMER' });
        const cropsCount = await Crop.countDocuments();
        
        // 2. Expense එකතුව (Total Expenses) Database එකෙන් ලබා ගැනීම
        // aggregate භාවිතා කරන්නේ සියලුම amount එකතු කිරීමටයි
        const expensesStats = await Expense.aggregate([
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
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching stats: " + error.message });
    }
};