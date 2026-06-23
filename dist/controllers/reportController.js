"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarmerReport = exports.getIncomeReport = exports.getHarvestReport = exports.getExpenseReport = exports.getCropReport = void 0;
const Crop_1 = __importDefault(require("../models/Crop"));
const Expense_1 = __importDefault(require("../models/Expense"));
const Harvest_1 = __importDefault(require("../models/Harvest"));
const User_1 = __importDefault(require("../models/User"));
// 1. Crop Report
const getCropReport = async (req, res) => {
    const crops = await Crop_1.default.find();
    res.json(crops);
};
exports.getCropReport = getCropReport;
// 2. Expense Report
const getExpenseReport = async (req, res) => {
    const expenses = await Expense_1.default.find();
    res.json(expenses);
};
exports.getExpenseReport = getExpenseReport;
// 3. Harvest Report
const getHarvestReport = async (req, res) => {
    // .populate('user') සහ .populate('crop') මගින් ගොවියාගේ සහ බෝගයේ නම ගන්නවා
    const harvests = await Harvest_1.default.find().populate('user', 'name').populate('crop', 'name');
    res.json(harvests);
};
exports.getHarvestReport = getHarvestReport;
// 4. Income Report
const getIncomeReport = async (req, res) => {
    // අස්වනු අලෙවියෙන් ලැබුණු මුදල් (Harvest එකේ sellingPrice එක)
    const income = await Harvest_1.default.find();
    const formattedIncome = income.map(h => ({ amount: h.sellingPrice }));
    res.json(formattedIncome);
};
exports.getIncomeReport = getIncomeReport;
// 5. Farmer Report
const getFarmerReport = async (req, res) => {
    // role: 'farmer' ලෙස ඉන්න අයව විතරක් පෙන්නන්න
    const farmers = await User_1.default.find({ role: 'farmer' });
    res.json(farmers);
};
exports.getFarmerReport = getFarmerReport;
