// services/order.service.js
import OrderModel from "../models/order.model.js";

export default class OrderService {
  // ================= USER SERVICES =================

  // 1. Get orders by user
  async getOrdersByUser(email) {
    try {
      const orders = await OrderModel.find({ userEmail: email }).sort({ createdOn: -1 });
      return { success: true, orders };
    } catch (err) {
      throw new Error("Failed to fetch user orders: " + err.message);
    }
  }

  // 2. Get order by ID (check if user is allowed)
  async getOrderById(orderId, user) {
    try {
      const order = await OrderModel.findOne({ orderId });
      if (!order) return null;

      if (user.role !== "Admin" && order.userEmail !== user.email) {
        throw new Error("Unauthorized access");
      }

      return order;
    } catch (err) {
      throw new Error("Failed to fetch order: " + err.message);
    }
  }

  async cancelOrder(orderId, user) {
    try {
      const order = await OrderModel.findOne({ orderId });
      if (!order) return null;

      // Ensure only order owner can cancel
      if (order.userEmail !== user.email) {
        throw new Error("Unauthorized");
      }

      // Allowed statuses for cancellation
      const cancellableStatuses = ["PLACED", "CONFIRMED", "SHIPPED"];

      if (!cancellableStatuses.includes(order.status)) {
        throw new Error(`Order cannot be cancelled in current status: ${order.status}`);
      }

      order.status = "CANCELLED";
      order.statusHistory.push({ status: "CANCELLED" });
      await order.save();

      return order;
    } catch (err) {
      throw new Error("Failed to cancel order: " + err.message);
    }
  }

  // ================= ADMIN SERVICES =================

  // 4. Get all orders (admin)
  async getAllOrders() {
    try {
      const orders = await OrderModel.find().sort({ createdOn: -1 });
      return { success: true, orders };
    } catch (err) {
      throw new Error("Failed to fetch all orders: " + err.message);
    }
  }

  // 5. Update order status (admin)
  async updateOrderStatus(orderId, status) {
    try {
      const order = await OrderModel.findOne({ orderId });
      if (!order) return null;

      order.status = status;
      order.statusHistory.push({ status });
      await order.save();
      return order;
    } catch (err) {
      throw new Error("Failed to update order: " + err.message);
    }
  }

  // 6. Delete order (admin)
  async deleteOrder(orderId) {
    try {
      const order = await OrderModel.findOneAndDelete({ orderId });
      return order;
    } catch (err) {
      throw new Error("Failed to delete order: " + err.message);
    }
  }

  // 7. Cancel order (admin override)
  async adminCancelOrder(orderId) {
    try {
      const order = await OrderModel.findOne({ orderId });
      if (!order) return null;

      if (["DELIVERED", "CANCELLED"].includes(order.status)) {
        throw new Error("Order cannot be cancelled now");
      }

      order.status = "CANCELLED";
      order.statusHistory.push({ status: "CANCELLED" });
      await order.save();
      return order;
    } catch (err) {
      throw new Error("Failed to cancel order (admin): " + err.message);
    }
  }
}
