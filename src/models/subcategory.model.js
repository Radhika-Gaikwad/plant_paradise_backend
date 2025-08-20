import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const subCategorySchema = new mongoose.Schema(
  {
    subCategoryId: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    subCategoryName: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: String,
      required: true, // Linking logically with categoryId (not ObjectId ref)
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String, // Single image for subcategory
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
    collection: 'subcategories',
    versionKey: false,
  }
);

const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);
export default SubCategoryModel;
