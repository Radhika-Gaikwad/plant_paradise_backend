import express from 'express'; 
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import subCategoryRoutes from './subcategory.routes.js';
import cartRoutes from './cart.routes.js';       // 👈 import cart routes
import wishlistRoutes from './wishlist.routes.js'; // 👈 import wishlist routes

const router = express.Router();

// all routes here
router.use('/auth', authRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/subcategory', subCategoryRoutes);
router.use('/cart', cartRoutes);                 // 👈 register cart routes
router.use('/wishlist', wishlistRoutes);         // 👈 register wishlist routes

export default router;

