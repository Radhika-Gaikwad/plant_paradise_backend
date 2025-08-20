import express from "express";
import WishlistController from "../controller/wishlist.controller.js";
import requireRole from "../middlewares/auth.middleware.js";

const router = express.Router();
const wishlistController = new WishlistController();

// Add product to wishlist
router.post("/add", requireRole(), wishlistController.addToWishlist);

// Remove product from wishlist
router.post("/remove", requireRole(), wishlistController.removeFromWishlist);

// Get wishlist
router.get("/", requireRole(), wishlistController.getWishlist);

export default router;
