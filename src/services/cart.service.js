import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { sendResponse } from "../common/common.js";
import { CODES } from "../common/response-code.js";

export default class CartService {
  // ✅ Add to Cart
  async addToCart(userPayload, body) {
    try {
      const { productId, quantity = 1 } = body;
      const user = await User.findOne({ email: userPayload.email });

      if (!user) return sendResponse(CODES.NOT_FOUND, "User not found");

      const product = await Product.findOne({ productId });
      if (!product) return sendResponse(CODES.NOT_FOUND, "Product not found");

      const cartItem = user.cart.find((item) => item.productId === productId);

      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        user.cart.push({ productId, quantity });
      }

      await user.save();
     return sendResponse(
  CODES.OK,
  "Product added to cart",
  user.cart.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }))
);

    } catch (error) {
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, "Error adding to cart");
    }
  }

  // ✅ Remove from Cart
  async removeFromCart(userPayload, body) {
    try {
      const { productId } = body;
      const user = await User.findOne({ email: userPayload.email });

      if (!user) return sendResponse(CODES.NOT_FOUND, "User not found");

      user.cart = user.cart.filter((item) => item.productId !== productId);
      await user.save();

      return sendResponse(CODES.OK, "Product removed from cart", user.cart);
    } catch (error) {
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, "Error removing from cart");
    }
  }

  // ✅ Update Quantity
  async updateQuantity(userPayload, body) {
    try {
      const { productId, quantity } = body;
      const user = await User.findOne({ email: userPayload.email });

      if (!user) return sendResponse(CODES.NOT_FOUND, "User not found");

      const cartItem = user.cart.find((item) => item.productId === productId);
      if (!cartItem) return sendResponse(CODES.NOT_FOUND, "Product not in cart");

      cartItem.quantity = quantity;
      await user.save();

      return sendResponse(CODES.OK, "Cart updated successfully", user.cart);
    } catch (error) {
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, "Error updating cart");
    }
  }

// ✅ Get Cart with Full Product Details
async getCart(userPayload) {
  try {
    const user = await User.findOne({ email: userPayload.email });
    if (!user) return sendResponse(CODES.NOT_FOUND, "User not found");

    const cartWithDetails = await Promise.all(
      user.cart.map(async (item) => {
        const product = await Product.findOne({ productId: item.productId });

        return {
          productId: item.productId,
          quantity: item.quantity,
          productName: product?.productName || null,
          price: product?.price || null,
          discount: product?.discount || 0,
          finalPrice: product
            ? product.price - (product.price * (product.discount || 0)) / 100
            : null,
          categoryId: product?.categoryId || null,
          categoryName: product?.categoryName || null,
          subCategoryId: product?.subCategoryId || null,
          subCategoryName: product?.subCategoryName || null,
          stock: product?.stock || false,
          unit: product?.unit || null,
          imageUrl: product?.imageUrl?.length ? product.imageUrl[0] : null, // first image
          description: product?.description || null,
          overAllRating: product?.overAllRating || 0,
        };
      })
    );

    return sendResponse(CODES.OK, "Cart fetched successfully", cartWithDetails);
  } catch (error) {
    console.error("Get Cart Error:", error);
    return sendResponse(CODES.INTERNAL_SERVER_ERROR, "Error fetching cart");
  }
}
              

}
