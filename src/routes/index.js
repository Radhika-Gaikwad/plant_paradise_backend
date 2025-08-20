// src/routes/index.js
import express from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import subCategoryRoutes from './subcategory.routes.js';

const router = express.Router();

// all routes here
router.use('/auth', authRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/subcategory', subCategoryRoutes);

export default router;
