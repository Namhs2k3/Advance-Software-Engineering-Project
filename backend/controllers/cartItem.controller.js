import CartItem from "../models/cartItem.model.js";
import Product from "../models/product.model.js";

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Kiểm tra xem sản phẩm có tồn tại hay không
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
    const existingCartItem = await CartItem.findOne({ product: productId });

    if (existingCartItem) {
      // Cập nhật số lượng nếu sản phẩm đã có
      existingCartItem.quantity += quantity;
      await existingCartItem.save(); // Middleware tự động tính lại `totalPrice`

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cartItem: existingCartItem,
      });
    }

    // Tạo sản phẩm mới trong giỏ hàng
    const newCartItem = new CartItem({
      product: productId,
      quantity,
    });
    await newCartItem.save(); // Middleware tự động tính `totalPrice`

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
      cartItem: newCartItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;

    // Tìm CartItem và cập nhật số lượng
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save(); // Middleware tự động tính lại `totalPrice`

    return res.status(200).json({
      message: "Cart item updated successfully",
      cartItem,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.cartItemId;

    const cartItem = await CartItem.findByIdAndDelete(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({ message: "Cart item removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
