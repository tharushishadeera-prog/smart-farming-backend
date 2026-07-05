"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // role එක අලුතින් ගන්න
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUser = new User_1.default({
            name,
            email,
            passwordHash,
            role: role || 'farmer'
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // user innwada balnne methnin 
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        // password eka match wenawada balnne methnin
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        // token eka hadanne methnin
        // login function එකේ token හදන තැන:
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, // මෙතන role එකත් දාන්න
        process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role } // මෙතනත් role එක යවන්න
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
exports.login = login;
