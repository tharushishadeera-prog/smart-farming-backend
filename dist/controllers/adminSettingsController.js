"use strict";
// import { Request, Response } from "express";
// import User from "../models/User";
// import bcrypt from "bcryptjs";
// import { AuthRequest } from "../middleware/authMiddleware";
// export const updateAdminProfile = async (req: AuthRequest, res: Response) => {
//     const { name, email } = req.body;
//     // දැන් req.user එක TypeScript මගින් හඳුනාගන්නවා
//     const admin = await User.findById(req.user?._id);
//     if (admin) {
//         admin.name = name || admin.name;
//         admin.email = email || admin.email;
//         await admin.save();
//         res.json({ message: "Profile updated successfully" });
//     } else {
//         res.status(404).json({ message: "Admin not found" });
//     }
// };
// export const updatePassword = async (req: AuthRequest, res: Response) => {
//     const { currentPassword, newPassword } = req.body;
//     try {
//         // 1. දැනට ඉන්න Admin ව හොයාගන්න
//         const admin = await User.findById(req.user?._id);
//         if (!admin) {
//             return res.status(404).json({ message: "Admin not found" });
//         }
//         // 2. දැනට තියෙන password එක පරණ එකත් එක්ක ගැලපෙනවද බලන්න
//         const isMatch = await bcrypt.compare(currentPassword, admin.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid current password" });
//         }
//         // 3. අලුත් password එක Hash කරලා දාන්න
//         const salt = await bcrypt.genSalt(10);
//         admin.password = await bcrypt.hash(newPassword, salt);
//         await admin.save();
//         res.json({ message: "Password updated successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// };
