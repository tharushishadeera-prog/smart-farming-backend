"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAI = exports.getAIAdvice = void 0;
const Crop_1 = __importDefault(require("../models/Crop"));
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAIAdvice = async (req, res) => {
    try {
        const userId = req.user?.id;
        // Database එකෙන් අදාළ User ගේ අවසාන වගාව සොයාගන්න
        const latestCrop = await Crop_1.default.findOne({ user: userId }).sort({ createdAt: -1 });
        if (!latestCrop) {
            return res.json({ advice: "can't find crop" });
        }
        // සරල AI Logic එක (Moisture අගය අනුව)
        let advice = "";
        const moisture = latestCrop.moisture || 0;
        if (moisture < 30) {
            advice = "Soil moisture is very low! Please irrigate your crops immediately.";
        }
        else if (moisture >= 30 && moisture <= 60) {
            advice = "Soil moisture is optimal. Continue with regular monitoring.";
        }
        else {
            advice = "Soil moisture is high. Ensure proper drainage to prevent root rot.";
        }
        res.status(200).json({ advice });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching AI advice" });
    }
};
exports.getAIAdvice = getAIAdvice;
console.log("API KEY:", process.env.GEMINI_API_KEY);
// Chatbot සඳහා අලුත් function එක
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const chatWithAI = async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({
            message: "Please provide a message."
        });
    }
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });
        const prompt = `
You are a professional Smart Farming AI Assistant.

Provide clear, practical, and concise farming advice in English.

Farmer Question:
${message}
`;
        const result = await model.generateContent(prompt);
        const reply = result.response.text();
        res.status(200).json({
            reply
        });
    }
    catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({
            message: "The AI service is temporarily unavailable."
        });
    }
};
exports.chatWithAI = chatWithAI;
