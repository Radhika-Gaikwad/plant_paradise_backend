import SubCategoryService from '../services/subcategory.service.js';

export default class SubCategoryController {
  static addSubCategory = async (req, res) => {
    const result = await SubCategoryService.addSubCategory(req.body);
    return res.status(result.code).json(result);
  };

  static getSubCategories = async (req, res) => {
    const result = await SubCategoryService.getSubCategories();
    return res.status(result.code).json(result);
  };

  static getSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    const result = await SubCategoryService.getSubCategoryById(subCategoryId);
    return res.status(result.code).json(result);
  };

  static updateSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    const result = await SubCategoryService.updateSubCategory(subCategoryId, req.body);
    return res.status(result.code).json(result);
  };

  static deleteSubCategory = async (req, res) => {
    const { subCategoryId } = req.params;
    const result = await SubCategoryService.deleteSubCategory(subCategoryId);
    return res.status(result.code).json(result);
  };
}
