// routes/payment.routes.js
import express from "express";
import { createMockPaymentController, verifyMockPaymentController } from "../controller/payment.controller.js";

const router = express.Router();

router.post("/create-order", createMockPaymentController);
router.post("/verify-order", verifyMockPaymentController);

export default router;
