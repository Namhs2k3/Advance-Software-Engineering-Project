import crypto from 'crypto';
import Order from '../models/order.model.js';
import mongoose from 'mongoose';
import { sendInvoiceEmail } from '../services/emailService.js';


export const vnpayReturn = async (req, res) => {
  try {
    // Lấy query parameters từ URL callback của VNPay
    const vnp_Params = req.query;

    // Lấy `vnp_SecureHash` từ VNPay callback để kiểm tra
    const vnp_SecureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash']; // Xóa khỏi object để tính lại hash

    // Sắp xếp tham số theo thứ tự bảng chữ cái
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {});

    // Tạo query string từ tham số
    const queryString = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join('&');

    // Tính toán hash từ query string
    const secureHash = crypto
      .createHmac('sha512', process.env.VNPAY_HASH_SECRET)
      .update(queryString)
      .digest('hex');

    // So sánh hash
    if (vnp_SecureHash !== secureHash) {
      return res.status(400).json({ message: 'Giao dịch không hợp lệ (Sai mã hash).' });
    }

    // Kiểm tra trạng thái thanh toán
    const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
    if (vnp_ResponseCode !== '00') {
      return res.status(400).json({
        message: 'Giao dịch thất bại.',
        code: vnp_ResponseCode,
      });
    }

    // Lấy thông tin cần thiết từ vnp_Params
    const orderId = new mongoose.Types.ObjectId(vnp_Params['vnp_TxnRef']);; // Mã đơn hàng
    const paymentAmount = parseInt(vnp_Params['vnp_Amount']) / 100; // Số tiền đã thanh toán

    // Cập nhật trạng thái đơn hàng (nếu cần)
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { status: 'paid', paymentMethod: 'Online Payment', paymentAmount },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }

    // Gửi email xác nhận thanh toán thành công
    try {
      const invoiceDetails = {
        name: order.name,
        email: order.email,
        finalPrice: order.finalPrice,
        discount: order.discount,
        cart: order.cart,
      };

      await sendInvoiceEmail(order.email, invoiceDetails);
    } catch (emailError) {
      console.error('Lỗi khi gửi email xác nhận thanh toán:', emailError);
    }

    // Chuyển hướng người dùng đến trang thành công
    res.redirect(`http://localhost:5173/order-success?orderId=${orderId}`);
    
  } catch (error) {
    console.error('Lỗi khi xử lý VNPay return:', error);
    res.status(500).json({ message: 'Lỗi server khi xử lý VNPay return.' });
  }
};
