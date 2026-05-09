import { Router } from "express";
import * as OrderController from "./orders.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { createOrderSchema } from "./orders.schema.js";

const router = Router();

router.get("/", authenticate, OrderController.getOrders);
router.post("/", authenticate, validate(createOrderSchema), OrderController.createOrder);

export default router;
