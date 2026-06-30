import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import * as StaffController from "./staff.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { loginSchema, refreshSchema } from "./auth.schema.js";

const router = Router();

router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh", validate(refreshSchema), AuthController.refresh);
router.post("/logout", validate(refreshSchema), AuthController.logout);
router.get("/me", authenticate, AuthController.getMe);

// Staff Management
router.get("/staff", authenticate, StaffController.getStaff);
router.patch("/staff/:id", authenticate, requireRole("OWNER"), StaffController.updateStaff);

export default router;
