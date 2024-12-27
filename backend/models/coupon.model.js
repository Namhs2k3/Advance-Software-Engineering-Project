import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    currentUsage: {
      type: Number,
      default: 0, // Số lần sử dụng hiện tại, mặc định là 0
      min: 0,
    },
    maxUsage: {
      type: Number,
      required: true, // Số lần tối đa coupon có thể sử dụng
      min: 0,
    },
  },
  { timestamps: true } // Tự động tạo `createdAt` và `updatedAt`
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
