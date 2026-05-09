import { Router } from "express";
import * as SettingsController from "./settings.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";

const router = Router();

router.get("/", authenticate, SettingsController.getSettings);
router.patch("/", authenticate, requireRole("OWNER"), SettingsController.updateSettings);

export default router;
