import express from "express";
import {
    createEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployees,
    updateEmployee
} from "../controllers/employee.controller.js";
import { checkRoles } from "../middleware/checkRoles.js"; // Middleware kiểm tra quyền
import { protect } from "../middleware/protect.js"; // Middleware bảo vệ

const router = express.Router();

// Lấy danh sách nhân viên (chỉ admin hoặc staff được phép)
router.get("/", protect, checkRoles("admin", "staff"), getEmployees);

// Lấy thông tin chi tiết một nhân viên
router.get("/:id", protect, checkRoles("admin", "staff"), getEmployeeById);

// Tạo nhân viên mới (chỉ admin được phép)
router.post("/", protect, checkRoles("admin"), createEmployee);

// Cập nhật thông tin nhân viên (chỉ admin hoặc staff được phép)
router.put("/:id", protect, checkRoles("admin", "staff"), updateEmployee);

// Xóa nhân viên (chỉ admin được phép)
router.delete("/:id", protect, checkRoles("admin"), deleteEmployee);

export default router;
