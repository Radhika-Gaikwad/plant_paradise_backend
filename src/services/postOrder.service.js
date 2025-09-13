// services/postOrder.service.js
import OrderModel from "../models/order.model.js"; // mongoose
import ProductModel from "../models/product.model.js"; // mongoose
import userModel from "../models/user.model.js"; // mongoose
// import { NotificationModel } from "../models/notification.model.js"; // if used
import { verifyMockSignature } from "../utils/mockPayment.js";
import { v4 as uuidv4 } from "uuid";

/**
 * PostOrderService
 * - Validates products
 * - Computes totals (discount & gst)
 * - Supports subscription vs single orders
 * - Verifies mock payment if online
 * - Performs stock updates with rollback on errors
 */
export default class PostOrderService {
  constructor(orderModel = OrderModel, productModel = ProductModel) {
    this.orderModel = orderModel;
    this.productModel = productModel;
  }

  // helper: compute product line totals
  computeLinePrice(productDoc, quantity) {
    const price = Number(productDoc.price || 0);
    const discountPercent = Number(productDoc.discount || 0);
    const gstPercent = Number(productDoc.gst || 0);
    const base = price * quantity;
    const afterDiscount = base - (base * discountPercent / 100);
    const withGst = afterDiscount + (afterDiscount * gstPercent / 100);
    // round to 2 decimals
    return Number(withGst.toFixed(2));
  }

  // core function
  addOrder = async (reqBody) => {
    // reqBody expected keys:
    // { user, products, address, paymentMode, subscriptionMode, paymentPayload, paymentSignature, deliveryFrom, deliveryTo, deliveryDate }
    const transactionReverts = []; // functions to run to rollback state (reverse stock)
    try {
      const {
        user,
        products,
        address,
        paymentMode = "COD", // COD or ONLINE
        subscriptionMode = false,
        paymentPayload,
        paymentSignature,
        deliveryFrom,
        deliveryTo,
        deliveryDate
      } = reqBody;

      if (!user || !user.email) {
        return { status: 400, success: false, message: "Invalid user" };
      }
      if (!Array.isArray(products) || products.length === 0) {
        return { status: 400, success: false, message: "No products in request" };
      }

      // If online payment, verify signature
      let paymentMethod = "COD";
      let paymentId = null;
      if (paymentMode === "ONLINE") {
        if (!paymentPayload || !paymentSignature) {
          return { status: 400, success: false, message: "Missing payment payload/signature for online payment" };
        }
        const signatureOk = verifyMockSignature(paymentPayload, paymentSignature);
        if (!signatureOk) {
          return { status: 400, success: false, message: "Invalid payment signature" };
        }
        paymentMethod = "ONLINE";
        paymentId = paymentPayload.paymentId;
      }

      // Validate each product and compute totals
      let totalPrice = 0;
      const lineItems = []; // enriched product details to store in order

      for (const p of products) {
        const { productId, quantity } = p;
        if (!productId || !quantity || quantity <= 0) {
          return { status: 400, success: false, message: "Invalid product information" };
        }

        // Fetch product from DB (mongoose model)
        const productDoc = await this.productModel.findOne({ productId }).lean();
        if (!productDoc) {
          return { status: 400, success: false, message: `Product not found: ${productId}` };
        }

        // Ensure stock
        if (productDoc.quantity < quantity) {
          return { status: 400, success: false, message: `Insufficient stock for product ${productDoc.productName}` };
        }

        // compute line total using product's price/discount/gst
        const linePrice = this.computeLinePrice(productDoc, quantity);
        totalPrice += linePrice;

        // prepare item stored in order
        lineItems.push({
          productId: productDoc.productId,
          productName: productDoc.productName,
          category: productDoc.categoryName || productDoc.subCategoryName || "",
          quantity,
          price: productDoc.price,
          discount: productDoc.discount || 0,
          gst: productDoc.gst || 0,
          imageUrl: (productDoc.imageUrl && productDoc.imageUrl[0]) || null,
          totalPrice: linePrice,
        });

        // prepare stock decrement and rollback function
        const oldQty = productDoc.quantity;
        transactionReverts.push(async () => {
          // rollback increments
          try {
            await this.productModel.updateOne({ productId }, { $set: { quantity: oldQty } });
          } catch (e) {
            console.error("Failed to rollback product quantity for", productId, e);
          }
        });

        // decrement now (optimistic)
        await this.productModel.updateOne({ productId }, { $inc: { quantity: -quantity } });
      } // end product loop

      // subscription handling: if subscriptionMode true, multiply by days
      if (subscriptionMode === true || subscriptionMode === "true") {
        // Very simple subscription calculation: assume deliveryFrom/deliveryTo ISO dates provided
        if (!deliveryFrom || !deliveryTo) {
          return { status: 400, success: false, message: "Missing deliveryFrom/deliveryTo for subscription" };
        }
        const start = new Date(deliveryFrom);
        const end = new Date(deliveryTo);
        const days = Math.max(1, Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1);
        totalPrice = Number((totalPrice * days).toFixed(2));
      } else {
        totalPrice = Number(totalPrice.toFixed(2));
      }

      // build order object for MongoDB (Mongoose)
      const orderPayload = {
        userEmail: user.email,
        userName: user.username || user.name || "",
        address: Array.isArray(address) ? address : [address],
        products: lineItems,
        totalPrice,
        status: "PLACED",
        paymentMode: paymentMode,
        paymentId: paymentId,
        paymentMethod: paymentMethod,
        createdOn: new Date().toISOString(),
        deliveryFrom,
        deliveryTo,
        deliveryDate,
      };

      // Payment history
      if (paymentMode === "ONLINE") {
        orderPayload.paymentHistory = [
          {
            amount: totalPrice,
            paymentMethod: "ONLINE",
            paymentId,
            status: "SUCCESS",
          },
        ];
      } else {
        orderPayload.paymentHistory = [];
      }

      // create order in MongoDB (Mongoose)
      const createdOrder = await this.orderModel.create(orderPayload);

      // remove ordered items from user's cart (Mongoose version)
      try {
        if (userModel) {
          const userRecord = await userModel.findOne({ email: user.email }).exec();
          if (userRecord && Array.isArray(userRecord.cart)) {
            const updatedCart = userRecord.cart.filter(ci => !products.some(pi => pi.productId === ci.productId));
            // persist the updated cart
            userRecord.cart = updatedCart;
            await userRecord.save();
            // alternatively you could use:
            // await userModel.updateOne({ email: user.email }, { cart: updatedCart });
          }
        }
      } catch (e) {
        // non-fatal
        console.error("Failed to clear user cart", e);
      }

      // optional: create notification for admin
      try {
        const adminUsers = (await userModel.find({ role: "Admin" }).exec()) || [];
        const admin = adminUsers[0];
        if (admin) {
          const notificationTitle = `🛒 New Order ${createdOrder.orderId}`;
          const notificationBody = `Order placed by ${createdOrder.userName || createdOrder.userEmail}`;
          // await NotificationModel.create({
          //   username: admin.name,
          //   email: admin.email,
          //   title: notificationTitle,
          //   body: notificationBody,
          //   data: { orderId: createdOrder.orderId },
          // }).catch(err => console.error("Notification save failed", err));
        }
      } catch (e) {
        // non-fatal
      }

      return { status: 201, success: true, message: "Order placed successfully", orderId: createdOrder.orderId };
    } catch (err) {
      console.error("addOrder error, starting rollback", err);
      // attempt rollback stock updates
      for (const revert of transactionReverts.reverse()) {
        try { await revert(); } catch (e) { console.error("Rollback error", e); }
      }
      return { status: 500, success: false, message: "Failed to place order", error: String(err) };
    }
  };
}
