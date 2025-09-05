// services/product.service.js
import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';
import { logger } from '../logger/logger.js'; // optional but matches your pattern
import ProductModel from '../models/product.model.js';
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subcategory.model.js";
export default class ProductService {
  // CREATE
  static addProduct = async (payload) => {
    try {
      if (payload.productName) payload.productName = payload.productName.trim();

      // fetch category name
      const category = await CategoryModel.findOne({ categoryId: payload.categoryId }).lean();
      if (!category) return sendResponse(CODES.BAD_REQUEST, 'Invalid categoryId');

      // fetch subcategory name (optional)
      let subCategoryName = '';
      if (payload.subCategoryId) {
        const subCategory = await SubCategoryModel.findOne({ subCategoryId: payload.subCategoryId }).lean();
        if (!subCategory) return sendResponse(CODES.BAD_REQUEST, 'Invalid subCategoryId');
        subCategoryName = subCategory.subCategoryName;
      }

      const doc = await ProductModel.create({
        ...payload,
        categoryName: category.categoryName,
        subCategoryName,
      });

      return sendResponse(CODES.CREATED, 'Product created successfully', { product: doc });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.BAD_REQUEST, err.message || 'Failed to create product');
    }
  };
  // READ (LIST) — basic filters + pagination
  static getProducts = async (query) => {
    try {
      const {
        search,
        category,
        subCategory,
        minPrice,
        maxPrice,
        inStock,
        veg,
        page = 1,
        limit = 10,
        sort = '-createdOn', // default newest first
      } = query;

      const filter = {};

      if (search) {
        filter.$or = [
          { productName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      if (category) filter.category = category;
      if (subCategory) filter.subCategory = subCategory;

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      if (typeof inStock !== 'undefined') {
        // Accept "true"/"false" strings as well
        filter.stock = String(inStock) === 'true';
      }
      if (typeof veg !== 'undefined') {
        filter.veg = String(veg) === 'true';
      }

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
      const skip = (pageNum - 1) * limitNum;

      const [items, total] = await Promise.all([
        ProductModel.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
        ProductModel.countDocuments(filter),
      ]);

      return sendResponse(CODES.OK, 'Products fetched successfully', {
        items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Failed to fetch products');
    }
  };

  // READ (SINGLE)
  static getProductById = async (productId) => {
    try {
      const product = await ProductModel.findOne({ productId }).lean();
      if (!product) {
        return sendResponse(CODES.NOT_FOUND, 'Product not found');
      }
      return sendResponse(CODES.OK, 'Product fetched successfully', { product });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Failed to fetch product');
    }
  };

  // UPDATE
  static updateProduct = async (productId, updates) => {
    try {
      // Prevent productId from being overwritten
      if ('productId' in updates) delete updates.productId;

      if (updates.productName) updates.productName = updates.productName.trim();
      if (updates.category) updates.category = updates.category.trim();
      if (updates.subCategory) updates.subCategory = updates.subCategory.trim();

      const updated = await ProductModel.findOneAndUpdate(
        { productId },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return sendResponse(CODES.NOT_FOUND, 'Product not found');
      }
      return sendResponse(CODES.OK, 'Product updated successfully', { product: updated });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.BAD_REQUEST, err.message || 'Failed to update product');
    }
  };

  // DELETE
  static deleteProduct = async (productId) => {
    try {
      const deleted = await ProductModel.findOneAndDelete({ productId });
      if (!deleted) {
        return sendResponse(CODES.NOT_FOUND, 'Product not found');
      }
      return sendResponse(CODES.OK, 'Product deleted successfully', { productId });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Failed to delete product');
    }
  };



  static getProductsByCategory = async (categoryId) => {
    try {
      const items = await ProductModel.find({ category: categoryId }).lean();
      if (!items.length) {
        return sendResponse(CODES.NOT_FOUND, 'No products found for this category');
      }
      return sendResponse(CODES.OK, 'Products fetched successfully', { items });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Failed to fetch products by category');
    }
  };

  // Get products by subCategoryId
  static getProductsBySubCategory = async (subCategoryId) => {
    try {
      const items = await ProductModel.find({ subCategory: subCategoryId }).lean();
      if (!items.length) {
        return sendResponse(CODES.NOT_FOUND, 'No products found for this subcategory');
      }
      return sendResponse(CODES.OK, 'Products fetched successfully', { items });
    } catch (err) {
      logger?.error?.(err);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Failed to fetch products by subcategory');
    }
  };
}


// Get products by categoryId

