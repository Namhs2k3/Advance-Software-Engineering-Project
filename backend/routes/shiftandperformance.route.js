import express from "express";
import {
    addEmployeePerformance,
    addEmployeeShift,
    getAllEmployeeShifts,
    getEmployeePerformance,
    getEmployeeShifts,
    getPerformances,
    updateEmployeePerformance,
    updateEmployeeShift,
    updateEmployeeShiftForManager
} from "../controllers/employee.controller.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();
router.get("/", getPerformances);
router.get(
    "/:employeeId/shifts",
    protect,
    checkRoles("admin"),
    getEmployeeShifts
);
router.put(
    "/:employeeId/shifts/:shiftId",
    protect,
    checkRoles("admin"),
    updateEmployeeShift
);
router.post(
    "/:employeeId/shifts",
    protect,
    checkRoles("admin"),
    addEmployeeShift
);
router.get(
    "/:employeeId/performance",
    protect,
    checkRoles("admin"),
    getEmployeePerformance
);
router.post(
    "/:employeeId/performance",
    protect,
    checkRoles("admin"),
    addEmployeePerformance
);
router.put(
    "/:employeeId/performance/:performanceId",
    protect,
    checkRoles("admin"),
    updateEmployeePerformance
);
router.get("/all-shifts", protect, checkRoles("manager"), getAllEmployeeShifts);
router.put(
    "/:employeeId/shifts/:shiftId/manager",
    protect,
    checkRoles("admin"),
    updateEmployeeShiftForManager
);

export default router;
