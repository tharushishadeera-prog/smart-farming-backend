import { Response } from "express"; // 🌟 Request වෙනුවට Response පමණක්
import { AuthRequest } from "../middleware/authMiddleware"; // 🌟 ඔබේ AuthRequest එක import කරන්න
import Harvest from "../models/Harvest";
import Crop from "../models/Crop";
import Expense from "../models/Expense";
import mongoose from "mongoose";

// අලුත් අස්වැන්නක් ඇතුළත් කිරීම
export const createHarvest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { crop, quantity, sellingPrice, date } = req.body;

    const newHarvest = new Harvest({
      crop,
      quantity,
      sellingPrice,
      date,
      user: req.user?.id // 🌟 මෙතැනදී User ID එක අනිවාර්යයෙන්ම දාන්න ඕනේ
    });

    const savedHarvest = await newHarvest.save();
    res.status(201).json(savedHarvest);
  } catch (error) {
    res.status(500).json({ message: "Error adding harvest", error });
  }
};

// බෝගයකට අදාළ අස්වනු ලබාගැනීම
export const getHarvestsByCrop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cropId } = req.params;
    console.log("Looking for harvests with crop:", cropId, "and user:", req.user?.id);
    
    const harvests = await Harvest.find({ crop: cropId, user: req.user?.id });
    
    console.log("Database response:", harvests); // 🌟 මේක පේනවද බලන්න
    res.status(200).json(harvests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching harvests", error });
  }
};
// Admin සඳහා සියලුම Harvests ලබා ගැනීමට
export const getAllHarvests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // populate('user') මගින් farmer ගේ නම සහ 'crop' මගින් බෝගයේ නම ලබා ගනී
    const harvests = await Harvest.find().populate('user', 'name').populate('crop', 'name');
    res.status(200).json(harvests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all harvests", error });
  }
};
export const updateHarvest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updatedHarvest = await Harvest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedHarvest);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteHarvest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Harvest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// // 🌟 dashboard statistics ගන්න අලුත් function එක
// export const getDashboardStats = async (req: any, res: any) => {
//   try {
//     const userId = req.user.id; // ලොග් වෙලා ඉන්න Farmer ගේ ID එක

//     // 1. Total Crops count එක
//     const totalCrops = await Crop.countDocuments({ user: userId });

//     // 2. Total Expenses එකතු කිරීම
//     const expenses = await Expense.aggregate([
//       { $match: { user: new mongoose.Types.ObjectId(userId) } },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);

//     // 3. Total Harvests count එක
//     const totalHarvests = await Harvest.countDocuments({ user: userId });

//     // 4. Total Earnings (Harvest එකේ විකුණුම් මිල)
//     const earnings = await Harvest.aggregate([
//       { $match: { user: new mongoose.Types.ObjectId(userId) } },
//       { $group: { _id: null, total: { $sum: "$sellingPrice" } } }
//     ]);

//     // දත්ත Frontend එකට යැවීම
//     res.status(200).json({
//       totalCrops,
//       totalHarvests,
//       totalExpenses: expenses[0]?.total || 0,
//       totalEarnings: earnings[0]?.total || 0
//     });
//   } catch (error) {
//     console.error("Stats Error:", error);
//     res.status(500).json({ message: "Error fetching dashboard stats" });
//   }
// };