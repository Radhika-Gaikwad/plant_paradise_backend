import express from "express";
import requireRole from "../middlewares/auth.middleware.js";

import { 
  getOrdersByUser, 
  getOrderById, 
  cancelOrder, 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder, 
  adminCancelOrder,
  addOrderController
} from "../controller/order.controller.js";

const router = express.Router();

// USER routes
router.post("/add-order", requireRole(), addOrderController);
router.get("/my-orders", requireRole(), getOrdersByUser);
router.get("/order/:id", requireRole(), getOrderById);
router.put("/cancel/:id", requireRole(), cancelOrder);

// ADMIN routes
router.get("/all", requireRole("Admin"), getAllOrders);
router.put("/update-status/:id", requireRole("Admin"), updateOrderStatus);
router.put("/admin-cancel/:id", requireRole("Admin"), adminCancelOrder);
router.delete("/delete/:id", requireRole("Admin"), deleteOrder);

export default router;
