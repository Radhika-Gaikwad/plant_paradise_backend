import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// ----------------------
// Address Schema
// ----------------------
const addressSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
  },
  name: { type: String },
  phoneNo: { type: String },
  alterPhoneNo: { type: String },
  houseNo: { type: String },
  streetName: { type: String },
  city: { type: String },
  district: { type: String },
  pincode: { type: String },
  addressType: {
    type: String,
    enum: ["home", "office"],
  },
});

// ----------------------
// Cart Schema
// ----------------------
const cartSchema = new mongoose.Schema({
  productId: { type: String },
  quantity: { type: Number, default: 1 },
});

// ----------------------
// Category Schema
// ----------------------
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  createdOn: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

// ----------------------
// Social Media Links Schema
// ----------------------
const socialMediaLinksSchema = new mongoose.Schema({
  facebook: { type: String, default: null },
  twitter: { type: String, default: null },
  instagram: { type: String, default: null },
  linkedin: { type: String, default: null },
  youtube: { type: String, default: null },
});

// ----------------------
// User Schema
// ----------------------
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    mobile: { type: Number },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    newsletter: [{ type: String }], // Array of product IDs
    address: { type: [addressSchema], default: [] },
    wishlist: { type: [String], default: [] }, // Array of product IDs
    cart: { type: [cartSchema], default: [] },
    wrongPasswordCount: { type: Number, default: 0 },
    lockedTemp: { type: Boolean, default: false },
    otp: { type: Number },
    expireTime: { type: Number },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    contact: { type: String },
    contactImg: { type: String },
    category: { type: [categorySchema] },
    offer: { type: String },
    token: { type: String },
    webToken: { type: String },
    socialMediaLinks: { type: socialMediaLinksSchema, default: {} },
    createdOn: {
      type: String,
      default: () => new Date().toISOString(),
    },
    lastLogin: {
      type: String,
      default: () => new Date().toISOString(),
    },
    gender: { type: String, default: "" },
    phoneNo: { type: String, default: "" },
  },
  { timestamps: true }
);

// ----------------------
// Password Hash Middleware
// ----------------------
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ----------------------
// Compare Password Method
// ----------------------
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
