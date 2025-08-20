import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Boolean,
      default: true,
    },
    subscription: {
      type: Boolean,
      default: true,
    },
    review: {
      type: [String], // Array of review IDs or texts
      default: [],
    },
    unit: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: [String], // Array of image URLs
      default: [],
    },
    video: {
      type: [String], // Array of video URLs
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    overAllRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'plant_product', // Collection name
    versionKey: false,           // Removes __v field
  }
);

const ProductModel = mongoose.model('PlantProduct', productSchema);

export default ProductModel;
