import { Router } from "express";
import * as BlogController from "./blogs.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { createBlogSchema, updateBlogSchema } from "./blogs.schema.js";

const router = Router();

router.get("/", BlogController.listPublished);
router.get("/admin/list", authenticate, requireRole("OWNER", "MANAGER", "FLORIST"), BlogController.adminList);
router.get("/:slug", BlogController.getBySlug);
router.post("/", authenticate, requireRole("OWNER", "MANAGER"), validate(createBlogSchema), BlogController.create);
router.patch("/:id", authenticate, requireRole("OWNER", "MANAGER"), validate(updateBlogSchema), BlogController.update);
router.delete("/:id", authenticate, requireRole("OWNER", "MANAGER"), BlogController.remove);

export default router;
