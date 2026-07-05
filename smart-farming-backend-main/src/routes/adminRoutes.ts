import { Router } from "express";
import { protect } from "../middleware/authMiddleware"; // login වෙලාද බලන්න
import { isAdmin } from "../middleware/adminMiddleware"; // admin ද බලන්න

const router = Router();

// මේ route එකට යන්න නම් ඉස්සෙල්ලා login වෙන්නත් ඕනේ (protect), ඊට පස්සේ admin වෙන්නත් ඕනේ (isAdmin)
router.get("/users", protect, isAdmin, async (req, res) => {
  // Controller logic එක මෙතන ලියන්න
  res.json({ message: "Admin only access!" });
});

export default router;