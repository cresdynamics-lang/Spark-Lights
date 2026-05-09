import { Router } from "express";
import * as SubscriptionsController from "./subscriptions.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.get("/", authenticate, SubscriptionsController.getSubscriptions);
router.post("/", authenticate, SubscriptionsController.createSubscription);

export default router;
