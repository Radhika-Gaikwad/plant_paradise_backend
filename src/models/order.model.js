import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// ================== Sub-schemas ==================

// Delivery history schema
const deliveryHistorySchema = new mongoose.Schema(
  {
    deliveryDate: {
      type: Date,
      default: Date.now,
    },
    deliveryStatus: {
      type: String,
      enum: ["SCHEDULED", "DELIVERED", "MISSED", "CANCELLED"],
      default: "SCHEDULED",
    },
    notes: { type: String },
  },
  { _id: false }
);

// Delivery details schema
const deliveryDetailsSchema = new mongoose.Schema(
  {
    deliveryPersonName: { type: String },
    deliveryPersonContact: { type: String },
    trackingId: { type: String },
    trackingUrl: { type: String },
    isCOD: { type: Boolean, default: false },
    codAmountCollected: { type: Number, default: 0 },
  },
  { _id: false }
);

// Payment history schema
const paymentHistorySchema = new mongoose.Schema(
  {
    paymentDate: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    paymentMethod: { type: String },
    paymentId: { type: String },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      default: "SUCCESS",
    },
  },
  { _id: false }
);

// Address schema
const addressSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4 },
    name: { type: String },
    phoneNo: { type: String },
    houseNo: { type: String },
    streetName: { type: String },
    city: { type: String },
    district: { type: String },
    pincode: { type: String },
    addressType: { type: String, enum: ["home", "office"] },
  },
  { _id: false }
);

// Order status history schema
const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERYPARTNERASSIGNED",
        "OUTFORDELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Product details schema
const productDetailsSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    category: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number },
    gst: { type: Number },
    imageUrl: { type: String },
  },
  { _id: false }
);

// ================== Main order schema ==================
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    userEmail: { type: String, required: true },
    userName: { type: String },
    address: [addressSchema],
    products: {
      type: [productDetailsSchema],
      required: true,
    },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERYPARTNERASSIGNED",
        "OUTFORDELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [{ status: "PLACED", timestamp: Date.now() }],
    },
    deliveryHistory: { type: [deliveryHistorySchema], default: [] },
    paymentHistory: { type: [paymentHistorySchema], default: [] },
    deliveryDetails: deliveryDetailsSchema,
    deliveryDate: { type: Date },
    paymentMode: { type: String }, // e.g. COD, Online
    paymentId: { type: String },
    paymentMethod: { type: String }, // UPI, Card, etc.
    createdOn: { type: Date, default: Date.now },
  },
  {
    collection: "orders",
    versionKey: false,
  }
);

// ================== Model ==================
const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
