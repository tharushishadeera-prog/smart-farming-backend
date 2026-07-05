import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  // user?: { id: string;role: string;};
  user?: { id: string; role: string; };

  
 
  
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

   const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string; role: string };
      req.user = { id: decoded.id,role: decoded.role };
      

      next();
    } catch (error) {
      console.log("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }
};
// export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
//   if (req.user && req.user.role === 'admin') { // ඔයාගේ User model එකේ role එකක් තියෙන්න ඕනේ
//     next();
//   } else {
//     res.status(403).json({ message: "Not authorized as an admin" });
//   }
// };