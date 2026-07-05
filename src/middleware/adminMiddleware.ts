import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware"; // AuthRequest interface එක ආයෙත් පාවිච්චි කරන්න පුළුවන්

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // ඉස්සෙල්ලාම බලනවා user ඉන්නවද කියලා, ඊට පස්සේ role එක admin ද කියලා
  if (req.user && req.user.role === 'ADMIN') {
    next(); // හරි නම් පස්සට යන්න දෙන්න
  } else {
    // නැත්නම් 403 Forbidden Error එකක් දෙන්න
    res.status(403).json({ message: "Access Denied: You are not an admin" });
  }
};