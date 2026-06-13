import { Router } from "express";
import * as ProductController from "./products.controller.js";
import { uploadProductImage } from "./products.upload.js";
import { authenticate, requireRole } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { createProductSchema, updateProductSchema, uploadImageSchema } from "./products.schema.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/admin/list", authenticate, requireRole("OWNER", "MANAGER", "FLORIST"), ProductController.getAdminProducts);
router.get("/public-assets", ProductController.getPublicAssets);
router.get("/categories", ProductController.getCategories);
router.post(
  "/upload-image",
  authenticate,
  requireRole("OWNER", "MANAGER"),
  validate(uploadImageSchema),
  uploadProductImage
);
router.get("/:id", ProductController.getProductBySlug);
router.post("/", authenticate, requireRole("OWNER", "MANAGER"), validate(createProductSchema), ProductController.createProduct);
router.patch("/:id", authenticate, requireRole("OWNER", "MANAGER"), validate(updateProductSchema), ProductController.updateProduct);
router.post("/categories", authenticate, requireRole("OWNER", "MANAGER"), ProductController.createCategory);

export default router;
