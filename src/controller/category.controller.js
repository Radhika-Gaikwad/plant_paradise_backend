import CategoryService from '../services/category.service.js';

export default class CategoryController {
  static addCategory = async (req, res) => {
    const result = await CategoryService.addCategory(req.body);
    return res.status(result.code).json(result);
  };

  static getCategories = async (req, res) => {
    const result = await CategoryService.getCategories();
    return res.status(result.code).json(result);
  };

  static getCategory = async (req, res) => {
    const { categoryId } = req.params;
    const result = await CategoryService.getCategoryById(categoryId);
    return res.status(result.code).json(result);
  };

  static updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const result = await CategoryService.updateCategory(categoryId, req.body);
    return res.status(result.code).json(result);
  };

  static deleteCategory = async (req, res) => {
    const { categoryId } = req.params;
    const result = await CategoryService.deleteCategory(categoryId);
    return res.status(result.code).json(result);
  };
}
