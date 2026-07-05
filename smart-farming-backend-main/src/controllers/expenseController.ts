import { Request,Response } from "express";
import Expense from "../models/Expense";

export const createExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, amount, category, date, userId } = req.body;

        //userId එකක් frontend එකෙන් එන්නේ නැත්නම් test එකක් විදියට hardcode කරලා බලන්න
        //පසුව එය auth middleware එක හරහා ලබාගන්න
        const finalUserId = userId || "660d1234567890abcdef1234"; 

        const newExpense = new Expense({
            user: finalUserId,
            title,
            amount,
            category,
            date,
        });

        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        console.error("Backend Error:", error); // Terminal එකේ error එක හරියට බලාගන්න මේක උදව් වෙනවා
        res.status(500).json({ message: "Error creating expense", error });
    }
};

export const getExpenses = async(req:Request,res:Response):Promise<void> =>{
    try{
        const {userId} = req.params;
        const expenses = await Expense.find({user : userId}).sort({ date: -1});
        res.status(200).json(expenses);

    }catch (error){
        res.status(500).json({message : "Error fetching expenses",error});
    }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        // new: true වෙනුවට returnDocument: 'after' පාවිච්චි කරන්න
        const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
        
        if (!updatedExpense) {
            res.status(404).json({ message: "Expense not found" });
            return;
        }
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: "Error updating expense", error });
    }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        await Expense.findByIdAndDelete(id);
        
        res.status(200).json({ message: "Expense Deleted Successfully" }); 
    } catch (error) {
        res.status(500).json({ message: "Error deleting expense", error });
    }
};
// Admin සඳහා සියලුම වියදම් ලබාගැනීම
export const getAllExpenses = async (req: Request, res: Response): Promise<void> => {
    try {
        // .populate එකේදී නම පමණක් නොවෙයි, සම්පූර්ණ user object එකම ඉල්ලන්න
        const allExpenses = await Expense.find().populate('user', 'name'); 
        res.status(200).json(allExpenses);
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};