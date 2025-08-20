import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';
import { logger } from '../logger/logger.js';
import CategoryModel from '../models/category.model.js';

export default class CategoryService {
  // CREATE
  static addCategory = async (payload) => {
    try {
      if (payload.categoryName) payload.categoryName = payload.categoryName.trim();
      const doc = await CategoryModel.create(payload);
      return sendResponse(CODES.CREATED, 'Category created successfully', { category: doc });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.BAD_REQUEST, err.message || 'Failed to create category');
    }
  };

  // READ ALL
  static getCategories = async () => {
    try {
      const items = await CategoryModel.find().lean();
      return sendResponse(CODES.OK, 'Categories fetched successfully', { items });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Failed to fetch categories');
    }
  };

  // READ SINGLE
  static getCategoryById = async (categoryId) => {
    try {
      const category = await CategoryModel.findOne({ categoryId }).lean();
      if (!category) return sendResponse(CODES.NOT_FOUND, 'Category not found');
      return sendResponse(CODES.OK, 'Category fetched successfully', { category });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Failed to fetch category');
    }
  };

  // UPDATE (retain old name in products since we only store categoryName in products)
  static updateCategory = async (categoryId, updates) => {
    try {
      if ('categoryId' in updates) delete updates.categoryId;
      if (updates.categoryName) updates.categoryName = updates.categoryName.trim();

      const updated = await CategoryModel.findOneAndUpdate(
        { categoryId },
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!updated) return sendResponse(CODES.NOT_FOUND, 'Category not found');
      return sendResponse(CODES.OK, 'Category updated successfully', { category: updated });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.BAD_REQUEST, err.message || 'Failed to update category');
    }
  };

  // DELETE
  static deleteCategory = async (categoryId) => {
    try {
      const deleted = await CategoryModel.findOneAndDelete({ categoryId });
      if (!deleted) return sendResponse(CODES.NOT_FOUND, 'Category not found');
      return sendResponse(CODES.OK, 'Category deleted successfully', { categoryId });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Failed to delete category');
    }
  };
}
