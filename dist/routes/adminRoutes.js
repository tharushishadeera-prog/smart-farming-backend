"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware"); // login වෙලාද බලන්න
const adminMiddleware_1 = require("../middleware/adminMiddleware"); // admin ද බලන්න
const router = (0, express_1.Router)();
// මේ route එකට යන්න නම් ඉස්සෙල්ලා login වෙන්නත් ඕනේ (protect), ඊට පස්සේ admin වෙන්නත් ඕනේ (isAdmin)
router.get("/users", authMiddleware_1.protect, adminMiddleware_1.isAdmin, async (req, res) => {
    // Controller logic එක මෙතන ලියන්න
    res.json({ message: "Admin only access!" });
});
exports.default = router;
