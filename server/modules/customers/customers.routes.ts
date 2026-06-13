import { Router } from "express";
import * as CustomersController from "./customers.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.get("/", authenticate, CustomersController.getCustomers);
router.get("/:id", authenticate, CustomersController.getCustomerById);
router.post("/", authenticate, CustomersController.createCustomer);
router.patch("/:id", authenticate, CustomersController.updateCustomer);

export default router;
