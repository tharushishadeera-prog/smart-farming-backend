import express from "express";
import { chatWithAI, getAIAdvice } from "../controllers/aiController"; 
import { protect } from "../middleware/authMiddleware"; 

const router = express.Router();

router.post("/chat", protect, chatWithAI);

router.get("/advice", protect, getAIAdvice); 

export default router;