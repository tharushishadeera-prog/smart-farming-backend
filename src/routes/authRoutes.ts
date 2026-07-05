import express from "express";
import { register, login } from "../controllers/authController";

const router = express.Router();

// http://localhost:5000/api/auth/register
router.post("/register", register);

// http://localhost:5000/api/auth/login
router.post("/login", login);

export default router;