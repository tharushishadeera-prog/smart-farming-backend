"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartData = exports.getDashboardStats = void 0;
const Harvest_1 = __importDefault(require("../models/Harvest"));
const Crop_1 = __importDefault(require("../models/Crop"));
const Expense_1 = __importDefault(require("../models/Expense"));
const mongoose_1 = __importDefault(require("mongoose"));
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role; // Middleware එකෙන් එන role එක
        // 1. Admin නම් filter එකක් නැහැ (මුළු පද්ධතියේම දත්ත), 
        //    Farmer නම් එයාගේ User ID එකට අදාළ දත්ත විතරයි.
        const filter = role === 'admin' ? {} : { user: userId };
        const userObjectId = role === 'admin' ? null : new mongoose_1.default.Types.ObjectId(userId);
        // 2. දත්ත ලබාගැනීම
        const [totalCrops, totalHarvests, expenses, earnings] = await Promise.all([
            Crop_1.default.countDocuments(filter),
            Harvest_1.default.countDocuments(filter),
            role === 'admin'
                ? Expense_1.default.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
                : Expense_1.default.aggregate([{ $match: { user: userObjectId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
            role === 'admin'
                ? Harvest_1.default.aggregate([{ $group: { _id: null, total: { $sum: "$sellingPrice" } } }])
                : Harvest_1.default.aggregate([{ $match: { user: userObjectId } }, { $group: { _id: null, total: { $sum: "$sellingPrice" } } }])
        ]);
        // 3. Response යැවීම
        res.status(200).json({
            totalCrops,
            totalHarvests,
            totalExpenses: expenses[0]?.total || 0,
            totalEarnings: earnings[0]?.total || 0,
            profit: (earnings[0]?.total || 0) - (expenses[0]?.total || 0)
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats", error });
    }
};
exports.getDashboardStats = getDashboardStats;
const getChartData = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        // Admin නම් match එක හිස්, නැත්නම් user ට අදාළ දත්ත විතරයි
        const matchQuery = role === 'admin' ? {} : { user: new mongoose_1.default.Types.ObjectId(userId) };
        const [expenses, earnings] = await Promise.all([
            Expense_1.default.aggregate([
                { $match: matchQuery },
                { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } },
                { $sort: { "_id": 1 } }
            ]),
            Harvest_1.default.aggregate([
                { $match: matchQuery },
                { $group: { _id: { $month: "$date" }, total: { $sum: "$sellingPrice" } } },
                { $sort: { "_id": 1 } }
            ])
        ]);
        // මාස 12ට දත්ත format කිරීම (වැදගත්: e._id පාවිච්චි කරන්න)
        const chartData = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const exp = expenses.find(e => e._id?.month === month || e._id === month);
            const earn = earnings.find(e => e._id?.month === month || e._id === month);
            return {
                month: `Month ${month}`,
                expenses: exp ? exp.total : 0,
                earnings: earn ? earn.total : 0
            };
        });
        return res.status(200).json(chartData);
    }
    catch (error) {
        console.error("Chart Data Error:", error);
        return res.status(500).json({ message: "Error fetching chart data" });
    }
};
exports.getChartData = getChartData;
