import express from "express";
import {
  createAccount,
  getAccounts,
  getAccountsById,
  updateAccount,
  updateGmailAndNumbers,
  createCustomerAccount,
} from "../controllers/account.controller.js";
import { protect } from "../middleware/protect.js"; // Import middleware protect
import { checkRoles } from "../middleware/checkRoles.js";
const router = express.Router();

// Bảo vệ các route cần đăng nhập
router.get("/", protect, checkRoles("admin"), getAccounts); // Chỉ admin hoặc staff đã đăng nhập mới được xem danh sách account
router.get("/:id", getAccountsById);
router.post("/register-customer", createCustomerAccount);
router.post("/", protect, checkRoles("admin"), createAccount); // Chỉ admin mới được tạo account mới
router.put("/update-gmail-numbers/:id", updateGmailAndNumbers);
router.put("/:id", protect, checkRoles("admin"), updateAccount); // Chỉ admin hoặc staff mới được cập nhật thông tin

export default router;
