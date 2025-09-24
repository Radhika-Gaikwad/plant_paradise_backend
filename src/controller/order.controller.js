// controllers/order.controller.js
import PostOrderService from "../services/postOrder.service.js";
import PostOrderServiceClass from "../services/postOrder.service.js"; // ensure path
import ProductModel from "../models/product.model.js";
import OrderModel from "../models/order.model.js";
import OrderService from "../services/order.service.js";

const orderService = new OrderService();
const postOrderService = new PostOrderService(OrderModel, ProductModel);

// ----------------- ADD ORDER -----------------
export const addOrderController = async (req, res) => {
  try {
    const body = req.body;
    const response = await postOrderService.addOrder(body);
    return res.status(response.status).json(response);
  } catch (err) {
    console.error("addOrderController error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------- GET USER ORDERS -----------------
export const getOrdersByUser = async (req, res) => {
  try {
    const data = await orderService.getOrdersByUser(req.user.email);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    if (err.message.includes("Unauthorized")) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};


// ----------------- CANCEL ORDER -----------------
export const cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.unauthorized) {
      return res.status(403).json({ success: false, message: "Unauthorized to cancel this order" });
    }

    return res.status(200).json({ success: true, message: "Order cancelled successfully", order });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ================= ADMIN CONTROLLERS =================

// 4. Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const data = await orderService.getAllOrders();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order updated successfully", order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 6. Delete order (admin only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 7. Cancel order (admin override)
export const adminCancelOrder = async (req, res) => {
  try {
    const order = await orderService.adminCancelOrder(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order cancelled by admin", order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};