"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    // ඉස්සෙල්ලාම බලනවා user ඉන්නවද කියලා, ඊට පස්සේ role එක admin ද කියලා
    if (req.user && req.user.role === 'ADMIN') {
        next(); // හරි නම් පස්සට යන්න දෙන්න
    }
    else {
        // නැත්නම් 403 Forbidden Error එකක් දෙන්න
        res.status(403).json({ message: "Access Denied: You are not an admin" });
    }
};
exports.isAdmin = isAdmin;
