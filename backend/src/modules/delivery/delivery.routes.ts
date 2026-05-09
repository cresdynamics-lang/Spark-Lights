import { Router } from "express";
import * as DeliveryController from "./delivery.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.get("/zones", authenticate, DeliveryController.getDeliveryZones);
router.get("/slots", authenticate, DeliveryController.getDeliverySlots);
router.get("/manifest", authenticate, DeliveryController.getManifest);
router.patch("/dispatch/:id", authenticate, DeliveryController.dispatchOrder);

export default router;
