import { Request, Response } from "express";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import User from "../models/User";
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body; // role එක අලුතින් ගන්න
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            passwordHash,
            role: role || 'farmer' 
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // user innwada balnne methnin 
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        // password eka match wenawada balnne methnin
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        // token eka hadanne methnin
        // login function එකේ token හදන තැන:
const token = jwt.sign(
    { id: user._id, role: user.role }, // මෙතන role එකත් දාන්න
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
);

res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role } // මෙතනත් role එක යවන්න
});
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};