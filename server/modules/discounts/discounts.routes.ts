import { Router } from "express";
import * as DiscountsController from "./discounts.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";

const router = Router();

router.get("/coupons", authenticate, DiscountsController.getCoupons);
router.post("/coupons", authenticate, requireRole("OWNER", "MANAGER"), DiscountsController.createCoupon);

export default router;
