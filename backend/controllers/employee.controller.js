import mongoose from "mongoose";
import Employee from "../models/employee.model.js";
import WorkPerformance from "../models/workPerformance.model.js";

// Lấy danh sách nhân viên với tìm kiếm và lọc
export const getEmployees = async (req, res) => {
    try {
        const { search, isActive, position } = req.query;

        // Build the query object dynamically
        const query = {};

        // Search by name, phone, or email
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } }, // Case-insensitive search
                { phone: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        // Filter by isActive
        if (isActive !== "") {
            query.isActive = isActive === "true"; // Convert to boolean
        }

        // Filter by position
        if (position) {
            query.position = position;
        }

        // Fetch employees based on the query
        const employees = await Employee.find(query);

        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error("Error fetching employees: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Tạo nhân viên mới
export const createEmployee = async (req, res) => {
    const { name, phone, email, position, shifts } = req.body;

    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!phone) missingFields.push("phone");
    if (!email) missingFields.push("email");
    if (!position) missingFields.push("position");

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Missing fields: ${missingFields.join(", ")}`
        });
    }

    const validPositions = ["manager", "waiter", "chef", "cleaner", "cashier"];
    if (!validPositions.includes(position)) {
        return res.status(400).json({
            success: false,
            message: `Invalid position. Allowed positions: ${validPositions.join(
                ", "
            )}`
        });
    }

    try {
        const newEmployee = new Employee({
            name,
            phone,
            email,
            position,
            shifts
        });
        const savedEmployee = await newEmployee.save();

        res.status(201).json({ success: true, data: savedEmployee });
    } catch (error) {
        console.error("Error creating employee:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Cập nhật thông tin nhân viên
export const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid employee ID" });
    }

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, {
            new: true
        });

        if (!updatedEmployee) {
            return res
                .status(404)
                .json({ success: false, message: "Employee not found" });
        }

        res.status(200).json({ success: true, data: updatedEmployee });
    } catch (error) {
        console.error("Error updating employee:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Lấy thông tin chi tiết của một nhân viên
export const getEmployeeById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID"
        });
    }

    try {
        const employee = await Employee.findById(id);

        if (!employee) {
            return res
                .status(404)
                .json({ success: false, message: "Employee not found" });
        }

        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        console.error("Error fetching employee: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Xóa nhân viên
export const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID"
        });
    }

    try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res
                .status(404)
                .json({ success: false, message: "Employee not found" });
        }

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting employee: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getEmployeeShifts = async (req, res) => {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID"
        });
    }

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            data: employee.shifts
        });
    } catch (error) {
        console.error("Error fetching employee shifts: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateEmployeeShift = async (req, res) => {
    const { employeeId, shiftId } = req.params;
    const { date, shift } = req.body;

    if (
        !mongoose.Types.ObjectId.isValid(employeeId) ||
        !mongoose.Types.ObjectId.isValid(shiftId)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID or shift ID"
        });
    }

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const shiftIndex = employee.shifts.findIndex(
            (shift) => shift._id.toString() === shiftId
        );
        if (shiftIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Shift not found"
            });
        }

        employee.shifts[shiftIndex] = { date, shift };
        await employee.save();

        res.status(200).json({
            success: true,
            data: employee.shifts
        });
    } catch (error) {
        console.error("Error updating employee shift: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addEmployeeShift = async (req, res) => {
    const { employeeId } = req.params;
    const { date, shift } = req.body;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID"
        });
    }

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        employee.shifts.push({ date, shift });
        await employee.save();

        res.status(201).json({
            success: true,
            data: employee.shifts
        });
    } catch (error) {
        console.error("Error adding employee shift: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
export const getEmployeePerformance = async (req, res) => {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID"
        });
    }

    try {
        const performances = await WorkPerformance.find({
            employeeId
        }).populate("employeeId");
        res.status(200).json({
            success: true,
            data: performances
        });
    } catch (error) {
        console.error("Error fetching employee performance: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
export const addEmployeePerformance = async (req, res) => {
    const { employeeId } = req.params;
    const { date, tasksCompleted, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID"
        });
    }

    try {
        const newPerformance = new WorkPerformance({
            employeeId,
            date,
            tasksCompleted,
            notes
        });
        await newPerformance.save();

        res.status(201).json({
            success: true,
            data: newPerformance
        });
    } catch (error) {
        console.error("Error adding employee performance: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
export const updateEmployeePerformance = async (req, res) => {
    const { employeeId, performanceId } = req.params;
    const { date, tasksCompleted, notes } = req.body;

    if (
        !mongoose.Types.ObjectId.isValid(employeeId) ||
        !mongoose.Types.ObjectId.isValid(performanceId)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID or performance ID"
        });
    }

    try {
        const performance = await WorkPerformance.findOneAndUpdate(
            { _id: performanceId, employeeId },
            { date, tasksCompleted, notes },
            { new: true } // Returns the updated document
        );

        if (!performance) {
            return res.status(404).json({
                success: false,
                message: "Performance not found"
            });
        }

        res.status(200).json({
            success: true,
            data: performance
        });
    } catch (error) {
        console.error("Error updating employee performance: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getAllEmployeeShifts = async (req, res) => {
    try {
        const employees = await Employee.find();
        const allShifts = employees.map((employee) => ({
            name: employee.name,
            shifts: employee.shifts
        }));

        res.status(200).json({
            success: true,
            data: allShifts
        });
    } catch (error) {
        console.error("Error fetching all employee shifts: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateEmployeeShiftForManager = async (req, res) => {
    const { employeeId, shiftId } = req.params;
    const { date, shift } = req.body;

    if (
        !mongoose.Types.ObjectId.isValid(employeeId) ||
        !mongoose.Types.ObjectId.isValid(shiftId)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID or shift ID"
        });
    }

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const shiftIndex = employee.shifts.findIndex(
            (shift) => shift._id.toString() === shiftId
        );
        if (shiftIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Shift not found"
            });
        }

        employee.shifts[shiftIndex] = { date, shift };
        await employee.save();

        res.status(200).json({
            success: true,
            data: employee.shifts
        });
    } catch (error) {
        console.error(
            "Error updating employee shift for manager: ",
            error.message
        );
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getPerformances = async (req, res) => {
    try {
        const performances = await WorkPerformance.find({}).populate(
            "employeeId"
        );
        res.status(200).json({ success: true, data: performances });
    } catch (error) {
        console.error("Error fetching employees: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
