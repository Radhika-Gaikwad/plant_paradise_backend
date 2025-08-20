import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String, // Single image for category
      trim: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'categories',
    versionKey: false,
  }
);

const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel;
