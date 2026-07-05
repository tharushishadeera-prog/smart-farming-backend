import { Router } from "express";
import { getCropReport, getExpenseReport, getHarvestReport, getIncomeReport, getFarmerReport } from "../controllers/reportController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/crops", protect, getCropReport);
router.get("/expenses", protect, getExpenseReport);
router.get("/harvests", protect, getHarvestReport);
router.get("/income", protect, getIncomeReport);
router.get("/farmers", protect, getFarmerReport);

export default router;