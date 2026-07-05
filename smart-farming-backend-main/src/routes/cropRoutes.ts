import express from "express";
import { addCrop, deleteCrop, getMyCrops, updateCrop } from "../controllers/ cropController";
// import { protect } from "../middleware/authMiddleware";
import { protect } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";
const router = express.Router();

router.post("/", protect, addCrop);
router.get("/", protect, getMyCrops);

router.put("/:id", protect, updateCrop);    
router.delete("/:id", protect, deleteCrop); 

router.get("/admin/all", protect, isAdmin, getMyCrops);


export default router;