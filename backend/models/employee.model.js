import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        position: {
            type: String,
            enum: ["manager", "waiter", "chef", "cleaner", "cashier"], // Các vị trí nhân viên
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        shifts: [
            {
                date: {
                    type: Date,
                    required: false
                },
                shift: {
                    type: String,
                    enum: ["morning", "afternoon", "evening"], // Các ca làm việc
                    required: false
                }
            }
        ]
    },
    {
        timestamps: true // Tự động thêm `createdAt` và `updatedAt`
    }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
