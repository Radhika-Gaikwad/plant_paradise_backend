// services/order.service.js
import OrderModel from "../models/order.model.js";

export default class OrderService {
  // ================= USER SERVICES =================

  async getOrdersByUser(email) {
    try {
      const orders = await OrderModel.find({ userEmail: email }).sort({ createdOn: -1 });
      return { success: true, orders };
    } catch (err) {
      throw new Error("Failed to fetch user orders: " + err.message);
    }
  }

  async getOrderById(orderId, user) {
    try {
      const order = await OrderModel.findOne({ orderId });
      if (!order) return null; // not found

      // Rule: Admin can see all, user can see only their own
      if (user.role !== "Admin" && order.userEmail !== user.email) {
        throw new Error("Unauthorized");
      }

      return order;
    } catch (err) {
      throw new Error("Failed to fetch order: " + err.message);
    }
  }



  // 3. Cancel order
  async cancelOrder(orderId, user) {
    try {
      const order = await OrderModel.findOne({ orderId });
      if (!order) return null;

      if (order.userEmail !== user.email) {
        return { unauthorized: true };
      }

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
