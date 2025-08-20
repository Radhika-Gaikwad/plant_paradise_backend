import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { sendResponse } from "../common/common.js";
import { CODES } from "../common/response-code.js";

export default class WishlistService {
  // ✅ Add to Wishlist
  async addToWishlist(userPayload, body) {
    try {
      const { productId } = body;
      const user = await User.findOne({ email: userPayload.email });

      if (!user) return sendResponse(CODES.NOT_FOUND, "User not found");

      const product = await Product.findOne({ productId });
      if (!product) return sendResponse(CODES.NOT_FOUND, "Product not found");

      if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        await user.save();
      }

      return sendResponse(CODES.OK, "Product added to wishlist", user.wishlist);
    } catch (error) {
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, "Error adding to wishlist");
    }
  }

  // ✅ Remove from Wishlist
  async removeFromWishlist(userPayload, body) {
    try {
      const { productId } = body;
      const user = await User.findOne({ email: userPayload.email });

      if (!user) return sendResponse(CODES.NOT_FOUND, "User not found");

      user.wishlist = user.wishlist.filter((id) => id !== productId);
      await user.save();

      return sendResponse(CODES.OK, "Product removed from wishlist", user.wishlist);
    } catch (error) {
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, "Error removing from wishlist");
    }
  }

  // ✅ Get Wishlist
  async getWishlist(userPayload) {
    try {
      const user = await User.findOne({ email: userPayload.email });
      if (!user) return sendResponse(CODES.NOT_FOUND, "User not found");

      const wishlistWithDetails = await Promise.all(
        user.wishlist.map(async (productId) => {
          const product = await Product.findOne({ productId });
          return {
            productId,
            productName: product?.productName || null,
            price: product?.price || null,
            imageUrl: product?.imageUrl || null,
          };
        })
      );

      return sendResponse(CODES.OK, "Wishlist fetched successfully", wishlistWithDetails);
    } catch (error) {
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, "Error fetching wishlist");
    }
  }
}
