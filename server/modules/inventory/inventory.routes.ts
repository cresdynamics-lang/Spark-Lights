import { Router } from "express";
import * as InventoryController from "./inventory.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";

const router = Router();

router.get("/flowers", authenticate, InventoryController.getFlowerInventory);
router.post("/flowers", authenticate, requireRole("OWNER", "MANAGER"), InventoryController.createFlowerStock);
router.get("/alerts", authenticate, InventoryController.getInventoryAlerts);
router.get("/movements/:inventoryId", authenticate, InventoryController.getInventoryMovements);

export default router;
