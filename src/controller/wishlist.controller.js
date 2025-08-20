import WishlistService from "../services/wishlist.service.js";

export default class WishlistController {
  constructor() {
    this.wishlistService = new WishlistService();
  }

  addToWishlist = async (req, res) => {
    const response = await this.wishlistService.addToWishlist(req.user, req.body);
    return res.status(response.code).json(response);
  };

  removeFromWishlist = async (req, res) => {
    const response = await this.wishlistService.removeFromWishlist(req.user, req.body);
    return res.status(response.code).json(response);
  };

  getWishlist = async (req, res) => {
    const response = await this.wishlistService.getWishlist(req.user);
    return res.status(response.code).json(response);
  };
}
