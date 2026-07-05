import { Request, Response } from "express";
import Crop from "../models/Crop";
import Expense from "../models/Expense";
import Harvest from "../models/Harvest";
import User from "../models/User";

// 1. Crop Report
export const getCropReport = async (req: Request, res: Response) => {
    const crops = await Crop.find();
    res.json(crops);
};

// 2. Expense Report
export const getExpenseReport = async (req: Request, res: Response) => {
    const expenses = await Expense.find();
    res.json(expenses);
};

// 3. Harvest Report
export const getHarvestReport = async (req: Request, res: Response) => {
    const harvests = await Harvest.find().populate('user', 'name').populate('crop', 'name');
    res.json(harvests);
};

// 4. Income Report
export const getIncomeReport = async (req: Request, res: Response) => {
    const income = await Harvest.find();
    const formattedIncome = income.map(h => ({ amount: h.sellingPrice }));
    res.json(formattedIncome);
};

// 5. Farmer Report
export const getFarmerReport = async (req: Request, res: Response) => {
    const farmers = await User.find({ role: 'farmer' });
    res.json(farmers);
};