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

    // store categoryId & name separately
    categoryId: {
      type: String,
      required: true,
      trim: true,
    },
    categoryName: {
      type: String,
      trim: true,
    },

    // store subCategoryId & name separately
    subCategoryId: {
      type: String,
      trim: true,
    },
    subCategoryName: {
      type: String,
      trim: true,
    },

    quantity: { type: Number, default: 0 },
    stock: { type: Boolean, default: true },
    subscription: { type: Boolean, default: true },
    review: { type: [String], default: [] },
    unit: { type: String, trim: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    imageUrl: { type: [String], default: [] },
    video: { type: [String], default: [] },
    description: { type: String, trim: true },
    overAllRating: { type: Number, min: 0, max: 5, default: 5 },
    createdOn: { type: Date, default: Date.now },
  },
  {
    collection: 'plant_product',
    versionKey: false,
  }
);

const ProductModel = mongoose.model('PlantProduct', productSchema);
export default ProductModel;
