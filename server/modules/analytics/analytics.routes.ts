import { Router } from "express";
import * as AnalyticsController from "./analytics.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.get("/dashboard-stats", authenticate, AnalyticsController.getDashboardStats);

export default router;
