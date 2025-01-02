import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import Ingredient from "../models/ingredient.model.js"
import { ObjectId } from "mongodb";
import { sendInvoiceEmail, sendLowStockNotification } from '../services/emailService.js';
import { format } from 'date-fns';
import crypto from 'crypto';

export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    const ordersWithFullImagePath = orders.map((order) => ({
      ...order,
      cart: order.cart.map((item) => ({
        ...item,
        product: {
          ...item.product,
          image: `${item.product.image}`,
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

    // Truy vấn chi tiết từng sản phẩm trong giỏ hàng
    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        const productDetails = await Product.findById(item.productId).select('name sell_price image');
        if (!productDetails) {
          throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
        }
        return {
          product: {
            id: productDetails._id,
            name: productDetails.name,
            price: productDetails.sell_price,
            image: `${process.env.BE_URL}assets/${encodeURIComponent(productDetails.image)}`,
          },
          quantity: item.quantity,
          totalPrice: item.quantity * productDetails.sell_price,
        };
      })
    );

    console.log('updatedCart ', updatedCart);

    // Xử lý coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.trim() });
      if (!coupon) {
        return res.status(404).json({ message: "Coupon không tồn tại!" });
      }
      if (coupon.currentUsage + 1 > coupon.maxUsage) {
        return res.status(400).json({ message: "Coupon đã hết lượt sử dụng!" });
      }
      coupon.currentUsage += 1;
      await coupon.save();
    }

    // Tạo đơn hàng ban đầu
    const newOrder = new Order({
      name,
      number,
      email,
      paymentMethod,
      discount: discount || 0,
      finalPrice: finalsell_Price,
      cart: updatedCart,
      status: paymentMethod === "Online Payment" ? "Pending" : "Confirmed", // Đơn hàng chờ thanh toán nếu online
    });

    await newOrder.save();

    // Nếu thanh toán qua VNPay
    if (paymentMethod === "Online Payment") {
      const vnp_TmnCode = process.env.VNPAY_TMN_CODE; // Mã website VNPay
      const vnp_HashSecret = process.env.VNPAY_HASH_SECRET; // Key bảo mật
      const vnp_Url = process.env.VNPAY_URL; // URL cổng thanh toán VNPay
      const vnp_ReturnUrl = `${process.env.BE_URL}api/vnpay/vnpay-return`; // URL trả về khi thanh toán xong

      const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const createDate = format(new Date(), 'yyyyMMddHHmmss'); // Format: YYYYMMDDHHmmss
      const expireDate = format(new Date(new Date().getTime() + 15 * 60 * 1000), 'yyyyMMddHHmmss'); // 15 phút sau
      const orderId = newOrder._id.toString(); // ID đơn hàng làm mã giao dịch
      const amount = finalsell_Price * 100; // Đơn vị: VND (x100)
      const orderInfo = "string";
      const bankCode = "ncb"; // Mã ngân hàng demo

      const params = {
        vnp_Amount: Math.round(amount),
        vnp_Command: "pay",
        vnp_CreateDate: createDate,
        vnp_CurrCode: "VND",
        vnp_ExpireDate: expireDate,
        vnp_IpAddr: "127.0.0.1",
        vnp_Locale: "vn",
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: "other",
        vnp_ReturnUrl: vnp_ReturnUrl,
        vnp_TmnCode: vnp_TmnCode,
        vnp_TxnRef: orderId,
        vnp_Version: "2.1.0",
      };


      // Sắp xếp tham số theo thứ tự từ điển
      const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}=${encodeURIComponent(String(params[key]))}`)
        .join("&");


      // Tính toán mã bảo mật (secure hash)
      const secureHash = crypto
        .createHmac('sha512', vnp_HashSecret)
        .update(sortedParams)  // Dùng tham số đã sắp xếp, không cần stringify
        .digest('hex');

      console.log("Calculated Secure Hash:", secureHash);
      console.log("Query String: ", params);
      console.log("sortedParams: ", sortedParams);

      // Tạo URL thanh toán
      const paymentUrl = `${vnp_Url}?${sortedParams}&vnp_SecureHash=${secureHash}`;

      console.log('VNPay Payment URL:', paymentUrl);


      // Trả về URL thanh toán
      return res.status(201).json({
        message: "Đơn hàng đã được tạo. Chuyển hướng đến thanh toán VNPay.",
        paymentUrl,
      });
    }

    // Gửi email hóa đơn
    try {
      const invoiceDetails = {
        name,
        email,
        finalPrice: finalsell_Price,
        discount,
        cart: updatedCart,
      };

      await sendInvoiceEmail(email, invoiceDetails);
      console.log("Email hóa đơn đã được gửi thành công.");
    } catch (emailError) {
      console.error("Lỗi khi gửi email hóa đơn:", emailError);
    }

    try {
      const lowStockIngredients = [];

      for (const item of cart) {
        const productDetails = await Product.findById(item.productId).select('ingredients');
        if (productDetails && productDetails.ingredients) {
          for (const ingredientId of productDetails.ingredients) {
            const ingredient = await Ingredient.findById(ingredientId);
            if (ingredient && ingredient.quantity < ingredient.safeThreshold) {
              lowStockIngredients.push({
                name: ingredient.name,
                quantity: ingredient.quantity,
                safeThreshold: ingredient.safeThreshold,
              });
            }
          }
        }
      }

      if (lowStockIngredients.length > 0) {
        await sendLowStockNotification(lowStockIngredients);
      }
    } catch (emailError) {
      console.error("Lỗi khi gửi email thông báo nguyên liệu sắp hết:", emailError);
    }

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
