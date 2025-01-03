import mongoose from "mongoose";

const workPerformanceSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng employees
            ref: "Employee",
            required: true
        },
        tasksCompleted: {
            type: Number,
            required: true
        },
        notes: {
            type: String,
            default: "" // Ghi chú tùy chọn từ quản lý
        }
    },
    {
        timestamps: true // Tự động thêm `createdAt` và `updatedAt`
    }
);

const WorkPerformance = mongoose.model(
    "WorkPerformance",
    workPerformanceSchema
);

export default WorkPerformance;
