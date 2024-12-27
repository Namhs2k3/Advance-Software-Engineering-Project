import CartItem from "../models/cartItem.model.js";
import Product from "../models/product.model.js";

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Kiểm tra xem sản phẩm có tồn tại hay không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
    const existingCartItem = await CartItem.findOne({ product: productId });

    if (existingCartItem) {
      // Cập nhật số lượng nếu sản phẩm đã có
      existingCartItem.quantity += quantity;
      await existingCartItem.save(); // Middleware tự động tính lại `totalPrice`

      return res.status(200).json({
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
      message: "Product added to cart",
      cartItem: newCartItem,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
