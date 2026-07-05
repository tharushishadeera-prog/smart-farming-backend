"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCrop = exports.updateCrop = exports.getMyCrops = exports.addCrop = void 0;
const Crop_1 = __importDefault(require("../models/Crop"));
const addCrop = async (req, res) => {
    try {
        const { name, variety, plantedDate, status, landSize } = req.body;
        const newCrop = new Crop_1.default({
            user: req.user?.id,
            name,
            variety,
            plantedDate,
            status,
            landSize
        });
        const savedCrop = await newCrop.save();
        res.status(201).json(savedCrop);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding crop", error });
    }
};
exports.addCrop = addCrop;
// export const getMyCrops = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     console.log("Fetching crops for User ID:", req.user?.id);
//     const crops = await Crop.find({ user: req.user?.id as string });
//     console.log("Crops found:", crops.length);
//     res.json(crops);
//   } catch (error) {
//     console.error("Error details:", error);
//     res.status(500).json({ message: "Error fetching crops", error });
//   }
// };
const getMyCrops = async (req, res) => {
    try {
        // 1. User ගේ Role එක අනුව filter එක තීරණය කරන්න
        // req.user.role යනු Admin/Farmer ලෙස අර්ථ දක්වා ඇති බව සහතික කරගන්න
        const query = req.user?.role.toLowerCase() === 'admin' ? {} : { user: req.user?.id };
        console.log("Fetching crops. Role:", req.user?.role, "User ID:", req.user?.id);
        // 2. අදාළ query එක හරහා දත්ත ලබාගන්න
        const crops = await Crop_1.default.find(query).populate('user', 'name');
        res.json(crops);
    }
    catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Error fetching crops", error });
    }
};
exports.getMyCrops = getMyCrops;
// update
// UPDATE
const updateCrop = async (req, res) => {
    try {
        const { id } = req.params;
        // Admin නම් user ID එක බලන්නේ නැහැ, නැත්නම් අදාළ user ගේ ID එක බලනවා
        const filter = req.user?.role.toLowerCase() === 'admin'
            ? { id: id }
            : { id: id, user: req.user?.id };
        const updatedCrop = await Crop_1.default.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
        if (!updatedCrop) {
            res.status(404).json({ message: "Crop not found or unauthorized" });
            return;
        }
        res.json(updatedCrop);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating crop", error });
    }
};
exports.updateCrop = updateCrop;
// DELETE
const deleteCrop = async (req, res) => {
    try {
        const { id } = req.params;
        // Admin නම් user ID එක බලන්නේ නැහැ
        const filter = req.user?.role.toLowerCase() === 'admin'
            ? { id: id }
            : { id: id, user: req.user?.id };
        const deletedCrop = await Crop_1.default.findOneAndDelete(filter);
        if (!deletedCrop) {
            res.status(404).json({ message: "Crop not found or unauthorized" });
            return;
        }
        res.json({ message: "Crop deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting crop", error });
    }
};
exports.deleteCrop = deleteCrop;
