import Coupon from "../models/coupon.model.js";
import mongoose from "mongoose";

// Tạo coupon mới
export const createCoupon = async (req, res) => {
  try {
    const { code, discountValue, maxUsage } = req.body;

    // Kiểm tra xem mã coupon đã tồn tại chưa
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Mã giảm giá đã tồn tại!" });
    }

    // Tạo coupon mới
    const coupon = new Coupon({
      code,
      discountValue,
      maxUsage,
      currentUsage: 0, // Ban đầu số lần sử dụng là 0
    });

    await coupon.save();

    res.status(201).json({
      message: "Coupon đã được tạo thành công!",
      data: coupon,
    });
  } catch (error) {
    console.error("Lỗi tạo coupon:", error);
    res.status(500).json({ message: "Lỗi server khi tạo coupon!" });
  }
};

// Lấy tất cả các coupon
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find(); // Lấy tất cả coupons
    res.status(200).json({ data: coupons });
  } catch (error) {
    console.error("Lỗi lấy danh sách coupon:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách coupon!" });
  }
};

// Lấy coupon theo ID
export const getCouponById = async (req, res) => {
  try {
    const couponId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(couponId)) {
      return res.status(400).json({ message: "Mã coupon không hợp lệ!" });
    }

    // Tìm coupon theo ObjectId
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon không tìm thấy!" });
    }

    // Trả về coupon
    res.status(200).json({ data: coupon });
  } catch (error) {
    console.error("Lỗi khi lấy coupon:", error);
    res.status(500).json({ message: "Lỗi server khi lấy coupon!" });
  }
};

// Cập nhật coupon
export const updateCoupon = async (req, res) => {
  const { id } = req.params; // Lấy id từ params
  const { code, discountValue, maxUsage, currentUsage } = req.body; // Lấy thông tin từ body

  // Kiểm tra xem id có hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Coupon ID" });
  }

  // Kiểm tra giá trị hợp lệ của currentUsage và maxUsage
  if (currentUsage < 0 || maxUsage < 0 || currentUsage > maxUsage) {
    return res.status(400).json({
      success: false,
      message: "Giá trị currentUsage hoặc maxUsage không hợp lệ!",
    });
  }

  try {
    // Tìm coupon theo ID và cập nhật
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discountValue, maxUsage, currentUsage },
      { new: true }
    );

    // Kiểm tra nếu coupon không tồn tại
    if (!updatedCoupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon không tìm thấy" });
    }

    res.status(200).json({ success: true, data: updatedCoupon });
  } catch (error) {
    console.error("Lỗi khi cập nhật coupon: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Xóa coupon theo ID
export const deleteCoupon = async (req, res) => {
  try {
    const couponId = req.params.id; // Nhận couponId từ tham số trong URL

    if (!mongoose.Types.ObjectId.isValid(couponId)) {
      return res.status(400).json({ message: "Mã coupon không hợp lệ!" });
    }

    // Xóa coupon theo ObjectId
    const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon không tìm thấy!" });
    }

    res.status(200).json({ message: "Coupon đã được xóa thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa coupon:", error);
    res.status(500).json({ message: "Lỗi server khi xóa coupon!" });
  }
};

// Sử dụng coupon
export const useCoupon = async (req, res) => {
  try {
    const { id } = req.body; // Nhận ObjectId từ body

    // Kiểm tra ObjectId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ!" });
    }

    // Tìm coupon theo ObjectId
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon không tìm thấy!" });
    }

    // Kiểm tra nếu coupon đã hết lượt sử dụng
    if (coupon.currentUsage >= coupon.maxUsage) {
      return res.status(400).json({ message: "Coupon đã hết lượt sử dụng!" });
    }

    // Tăng số lần sử dụng lên 1
    coupon.currentUsage += 1;
    await coupon.save();

    res.status(200).json({
      message: "Áp dụng coupon thành công!",
      data: coupon,
    });
  } catch (error) {
    console.error("Lỗi khi áp dụng coupon:", error);
    res.status(500).json({ message: "Lỗi server khi áp dụng coupon!" });
  }
};
