// controllers/product.controller.js
import ProductService from '../services/product.service.js';

export default class ProductController {
  static addProduct = async (req, res) => {
    const result = await ProductService.addProduct(req.body);
    return res.status(result.code).json(result);
  };

  static getProducts = async (req, res) => {
    const result = await ProductService.getProducts(req.query);
    return res.status(result.code).json(result);
  };

  static getProduct = async (req, res) => {
    const { productId } = req.params;
    const result = await ProductService.getProductById(productId);
    return res.status(result.code).json(result);
  };

  static updateProduct = async (req, res) => {
    const { productId } = req.params;
    const result = await ProductService.updateProduct(productId, req.body);
    return res.status(result.code).json(result);
  };


  static getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    const response = await ProductService.getProductsByCategory(categoryId);
    res.status(response.code).json(response);
  };

  // New: get by subcategory
  static getProductsBySubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    const response = await ProductService.getProductsBySubCategory(subCategoryId);
    res.status(response.code).json(response);
  };

  static deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const result = await ProductService.deleteProduct(productId);
    return res.status(result.code).json(result);
  };
}
