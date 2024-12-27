import express from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  useCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

// CRUD routes cho Coupon
router.get("/", getAllCoupons); // Lấy danh sách coupon
router.get("/:id", getCouponById); // Lấy coupon theo code
router.post("/", createCoupon); // Tạo coupon mới
router.put("/use", useCoupon);
router.put("/:id", updateCoupon); // Cập nhật coupon
router.delete("/:id", deleteCoupon); // Xóa coupon

export default router;
