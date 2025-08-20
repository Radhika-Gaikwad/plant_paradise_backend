import express from "express";
import CartController from "../controller/cart.controller.js";
import requireRole from "../middlewares/auth.middleware.js";

const router = express.Router();
const cartController = new CartController();


router.post("/add", requireRole(), cartController.addToCart);
router.post("/remove", requireRole(), cartController.removeFromCart);
router.post("/update", requireRole(), cartController.updateQuantity);
router.get("/", requireRole(), cartController.getCart);

export default router;
