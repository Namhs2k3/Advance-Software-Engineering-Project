import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import { ObjectId } from "mongodb";

export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "cart.product",
        select: "name image",
      })
      .sort({ createdAt: -1 })
      .lean(); // Sử dụng lean để đảm bảo trả về plain objects

    const ordersWithFullImagePath = orders.map((order) => ({
      ...order,
      cart: order.cart.map((item) => ({
        ...item,
        product: {
          ...item.product,
          image: `http://localhost:5000/assets/${item.product.image}`,
        },
      })),
    }));

    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công!",
      data: ordersWithFullImagePath,
    });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách đơn hàng: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const {
      name,
      number,
      email,
      paymentMethod,
      discount,
      finalsell_Price, // Updated from finalPrice to finalsell_Price
      cart,
      couponCode, // Coupon code from the body
    } = req.body;

    if (!name || !number || !email || !paymentMethod || !cart) {
      return res.status(400).json({ message: "Thiếu thông tin cần thiết!" });
    }

    console.log("Received order data:", req.body);

    // Process cart and validate products
    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        const productId = new ObjectId(item.productId);
        const product = await Product.findById(productId);
        if (!product) {
          console.error(`Product with ID ${item.productId} not found`);
          throw new Error("Sản phẩm không tồn tại");
        }
        return {
          product: product._id,
          quantity: item.quantity,
          totalPrice: item.quantity * item.sell_price, // Use sell_price for the product's price
        };
      })
    );

    // Validate and apply coupon if provided
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.trim() });

        if (!coupon) {
          return res.status(404).json({ message: "Coupon không tồn tại!" });
        }

        console.log(`Coupon found:`, {
          code: coupon.code,
          currentUsage: coupon.currentUsage,
          maxUsage: coupon.maxUsage,
        });

        if (coupon.currentUsage + 1 > coupon.maxUsage) {
          return res
            .status(400)
            .json({ message: "Coupon đã hết lượt sử dụng!" });
        }

        coupon.currentUsage += 1;
        await coupon.save();

        console.log(`Updated coupon usage:`, {
          currentUsage: coupon.currentUsage,
          maxUsage: coupon.maxUsage,
        });
      } catch (error) {
        console.error("Lỗi khi xử lý coupon:", error);
        return res.status(500).json({ message: "Lỗi khi xử lý coupon!" });
      }
    }

    // Create the new order with the provided data
    const newOrder = new Order({
      name,
      number,
      email,
      paymentMethod,
      discount: discount || 0,
      finalPrice: finalsell_Price, // Save final price correctly
      cart: updatedCart,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Đơn hàng đã được tạo thành công!",
      data: newOrder,
    });
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi tạo đơn hàng!" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, number, email, paymentMethod } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    }

    if (name) order.name = name;
    if (number) order.number = number;
    if (email) order.email = email;
    if (paymentMethod) order.paymentMethod = paymentMethod;

    const updatedOrder = await order.save();
    res.status(200).json({
      message: "Cập nhật đơn hàng thành công!",
      data: updatedOrder,
    });
  } catch (error) {
    console.log("Lỗi khi cập nhật đơn hàng: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
