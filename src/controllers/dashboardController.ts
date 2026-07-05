import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Harvest from "../models/Harvest";
import Crop from "../models/Crop";
import Expense from "../models/Expense";
import mongoose from "mongoose";

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role; // Middleware එකෙන් එන role එක

    // 1. Admin නම් filter එකක් නැහැ (මුළු පද්ධතියේම දත්ත), 
    //    Farmer නම් එයාගේ User ID එකට අදාළ දත්ත විතරයි.
    const filter = role === 'admin' ? {} : { user: userId };
    const userObjectId = role === 'admin' ? null : new mongoose.Types.ObjectId(userId);

    // 2. දත්ත ලබාගැනීම
    const [totalCrops, totalHarvests, expenses, earnings] = await Promise.all([
      Crop.countDocuments(filter),
      Harvest.countDocuments(filter),
      role === 'admin' 
        ? Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
        : Expense.aggregate([{ $match: { user: userObjectId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      role === 'admin' 
        ? Harvest.aggregate([{ $group: { _id: null, total: { $sum: "$sellingPrice" } } }])
        : Harvest.aggregate([{ $match: { user: userObjectId } }, { $group: { _id: null, total: { $sum: "$sellingPrice" } } }])
    ]);

    // 3. Response යැවීම
    res.status(200).json({
      totalCrops,
      totalHarvests,
      totalExpenses: expenses[0]?.total || 0,
      totalEarnings: earnings[0]?.total || 0,
      profit: (earnings[0]?.total || 0) - (expenses[0]?.total || 0)
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};
export const getChartData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    
    // Admin නම් match එක හිස්, නැත්නම් user ට අදාළ දත්ත විතරයි
    const matchQuery = role === 'admin' ? {} : { user: new mongoose.Types.ObjectId(userId) };

    const [expenses, earnings] = await Promise.all([
      Expense.aggregate([
        { $match: matchQuery },
        { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } }},
        { $sort: { "_id": 1 } }
      ]),
      Harvest.aggregate([
        { $match: matchQuery },
        { $group: { _id: { $month: "$date" }, total: { $sum: "$sellingPrice" } }},
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
  } catch (error) {
    console.error("Chart Data Error:", error);
    return res.status(500).json({ message: "Error fetching chart data" });
  }
};