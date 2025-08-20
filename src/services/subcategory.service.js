import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';
import { logger } from '../logger/logger.js';
import SubCategoryModel from '../models/subcategory.model.js';

export default class SubCategoryService {
  static addSubCategory = async (payload) => {
    try {
      if (payload.subCategoryName) payload.subCategoryName = payload.subCategoryName.trim();
      const doc = await SubCategoryModel.create(payload);
      return sendResponse(CODES.CREATED, 'SubCategory created successfully', { subCategory: doc });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.BAD_REQUEST, err.message || 'Failed to create subCategory');
    }
  };

  static getSubCategories = async () => {
    try {
      const items = await SubCategoryModel.find().lean();
      return sendResponse(CODES.OK, 'SubCategories fetched successfully', { items });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Failed to fetch subCategories');
    }
  };

  static getSubCategoryById = async (subCategoryId) => {
    try {
      const subCategory = await SubCategoryModel.findOne({ subCategoryId }).lean();
      if (!subCategory) return sendResponse(CODES.NOT_FOUND, 'SubCategory not found');
      return sendResponse(CODES.OK, 'SubCategory fetched successfully', { subCategory });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Failed to fetch subCategory');
    }
  };

  static updateSubCategory = async (subCategoryId, updates) => {
    try {
      if ('subCategoryId' in updates) delete updates.subCategoryId;
      if (updates.subCategoryName) updates.subCategoryName = updates.subCategoryName.trim();

      const updated = await SubCategoryModel.findOneAndUpdate(
        { subCategoryId },
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!updated) return sendResponse(CODES.NOT_FOUND, 'SubCategory not found');
      return sendResponse(CODES.OK, 'SubCategory updated successfully', { subCategory: updated });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.BAD_REQUEST, err.message || 'Failed to update subCategory');
    }
  };

  static deleteSubCategory = async (subCategoryId) => {
    try {
      const deleted = await SubCategoryModel.findOneAndDelete({ subCategoryId });
      if (!deleted) return sendResponse(CODES.NOT_FOUND, 'SubCategory not found');
      return sendResponse(CODES.OK, 'SubCategory deleted successfully', { subCategoryId });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Failed to delete subCategory');
    }
  };
}
