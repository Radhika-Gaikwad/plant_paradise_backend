import CartService from "../services/cart.service.js";

export default class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  addToCart = async (req, res) => {
    const response = await this.cartService.addToCart(req.user, req.body);
    return res.status(response.code).json(response);
  };

  removeFromCart = async (req, res) => {
    const response = await this.cartService.removeFromCart(req.user, req.body);
    return res.status(response.code).json(response);
  };

  updateQuantity = async (req, res) => {
    const response = await this.cartService.updateQuantity(req.user, req.body);
    return res.status(response.code).json(response);
  };

  getCart = async (req, res) => {
    const response = await this.cartService.getCart(req.user);
    return res.status(response.code).json(response);
  };
}
