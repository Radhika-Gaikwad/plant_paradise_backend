import express from 'express';
import SubCategoryController from '../controller/subcategory.controller.js';
import requireRole from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public Reads
router.get('/getAll', SubCategoryController.getSubCategories);
router.get('/:subCategoryId', SubCategoryController.getSubCategory);

// Admin-only writes
router.post('/addSubCategory', requireRole('Admin'), SubCategoryController.addSubCategory);
router.patch('/updateSubCategory/:subCategoryId', requireRole('Admin'), SubCategoryController.updateSubCategory);
router.delete('/deleteSubCategory/:subCategoryId', requireRole('Admin'), SubCategoryController.deleteSubCategory);

export default router;
