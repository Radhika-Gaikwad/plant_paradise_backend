import express from 'express';
import CategoryController from '../controller/category.controller.js';
import requireRole from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/getAll', CategoryController.getCategories);
router.get('/:categoryId', CategoryController.getCategory);

// category.routes.js
router.post('/addCategory', requireRole('Admin'), CategoryController.addCategory);

router.patch('/updateCategory/:categoryId', requireRole('Admin'), CategoryController.updateCategory);
router.delete('/deleteCategory/:categoryId', requireRole('Admin'), CategoryController.deleteCategory);

export default router;
