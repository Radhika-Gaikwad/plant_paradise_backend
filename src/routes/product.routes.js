// routes/product.routes.js
import express from 'express';
import ProductController from '../controller/product.controller.js';

// NOTE: your auth middleware is CommonJS (module.exports).
// In ESM, importing it as default works fine due to interop:
import requireRole from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public reads
router.get('/getAll', ProductController.getProducts);
router.get('/:productId', ProductController.getProduct);
router.get('/byCategory/:categoryId', ProductController.getProductsByCategory);
router.get('/bySubCategory/:subCategoryId', ProductController.getProductsBySubCategory);

// Admin-only writes
router.post('/addProduct', requireRole('Admin'), ProductController.addProduct);
router.patch('/updateProduct/:productId', requireRole('Admin'), ProductController.updateProduct);
router.delete('/deleteProduct/:productId', requireRole('Admin'), ProductController.deleteProduct);

export default router;
