import { Router } from "express";
import * as ProductController from "./products.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { createProductSchema } from "./products.schema.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/categories", ProductController.getCategories);
router.get("/:id", ProductController.getProductBySlug);
router.post("/", authenticate, requireRole("OWNER", "MANAGER"), validate(createProductSchema), ProductController.createProduct);
router.post("/categories", authenticate, requireRole("OWNER", "MANAGER"), ProductController.createCategory);

export default router;
