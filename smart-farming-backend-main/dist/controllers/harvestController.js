"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHarvest = exports.updateHarvest = exports.getAllHarvests = exports.getHarvestsByCrop = exports.createHarvest = void 0;
const Harvest_1 = __importDefault(require("../models/Harvest"));
// අලුත් අස්වැන්නක් ඇතුළත් කිරීම
const createHarvest = async (req, res) => {
    try {
        const { crop, quantity, sellingPrice, date } = req.body;
        const newHarvest = new Harvest_1.default({
            crop,
            quantity,
            sellingPrice,
            date,
            user: req.user?.id // 🌟 මෙතැනදී User ID එක අනිවාර්යයෙන්ම දාන්න ඕනේ
        });
        const savedHarvest = await newHarvest.save();
        res.status(201).json(savedHarvest);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding harvest", error });
    }
};
exports.createHarvest = createHarvest;
// බෝගයකට අදාළ අස්වනු ලබාගැනීම
const getHarvestsByCrop = async (req, res) => {
    try {
        const { cropId } = req.params;
        console.log("Looking for harvests with crop:", cropId, "and user:", req.user?.id);
        const harvests = await Harvest_1.default.find({ crop: cropId, user: req.user?.id });
        console.log("Database response:", harvests); // 🌟 මේක පේනවද බලන්න
        res.status(200).json(harvests);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching harvests", error });
    }
};
exports.getHarvestsByCrop = getHarvestsByCrop;
// Admin සඳහා සියලුම Harvests ලබා ගැනීමට
const getAllHarvests = async (req, res) => {
    try {
        // populate('user') මගින් farmer ගේ නම සහ 'crop' මගින් බෝගයේ නම ලබා ගනී
        const harvests = await Harvest_1.default.find().populate('user', 'name').populate('crop', 'name');
        res.status(200).json(harvests);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching all harvests", error });
    }
};
exports.getAllHarvests = getAllHarvests;
const updateHarvest = async (req, res) => {
    try {
        const updatedHarvest = await Harvest_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedHarvest);
    }
    catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};
exports.updateHarvest = updateHarvest;
const deleteHarvest = async (req, res) => {
    try {
        await Harvest_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};
exports.deleteHarvest = deleteHarvest;
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
