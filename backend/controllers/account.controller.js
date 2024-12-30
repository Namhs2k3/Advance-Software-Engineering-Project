import mongoose from "mongoose";
import Account from "../models/account.model.js";
import jwt from "jsonwebtoken";
import generateToken from "../generateToken.js";

export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    console.error("Error fetching accounts: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createAccount = async (req, res) => {
  const { username, password, numbers, gmail, role } = req.body;

  const missingFields = [];
  if (!username) missingFields.push("username");
  if (!password) missingFields.push("password");
  if (!numbers) missingFields.push("numbers");
  if (!gmail) missingFields.push("gmail");
  if (!role) missingFields.push("role");

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing fields: ${missingFields.join(", ")}`,
    });
  }

  const validRoles = ["admin", "staff", "chef"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Allowed roles: ${validRoles.join(", ")}`,
    });
  }

  try {
    // Tạo tài khoản mới
    const newAccount = new Account({
      username,
      password,
      gmail,
      numbers,
      role,
    });
    const savedAccount = await newAccount.save();

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: savedAccount._id,
        username: savedAccount.username,
        role: savedAccount.role,
      },
      process.env.JWT_SECRET, // Bí mật được lưu trong biến môi trường
      { expiresIn: "1h" } // Thời gian sống của token (1 giờ)
    );

    // Trả về thông tin tài khoản và token
    res.status(201).json({
      success: true,
      data: savedAccount,
      token, // Token được trả về
    });
  } catch (error) {
    console.error("Error creating account:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createCustomerAccount = async (req, res) => {
  const { username, password, numbers, gmail } = req.body; // Bỏ role từ req.body

  const missingFields = [];
  if (!username) missingFields.push("username");
  if (!password) missingFields.push("password");
  if (!numbers) missingFields.push("numbers");
  if (!gmail) missingFields.push("gmail");

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    // Tạo tài khoản mới với role mặc định là "customer"
    const newAccount = new Account({
      username,
      password,
      gmail,
      numbers,
      role: "staff", // Đặt mặc định role là "customer"
    });
    const savedAccount = await newAccount.save();
    // Tạo JWT token
    const token = jwt.sign(
      {
        id: savedAccount._id,
        username: savedAccount.username,
        role: savedAccount.role,
      },
      process.env.JWT_SECRET, // Bí mật được lưu trong biến môi trường
      { expiresIn: "1h" } // Thời gian sống của token (1 giờ)
    );

    // Trả về thông tin tài khoản và token
    res.status(201).json({
      success: true,
      data: savedAccount,
      token, // Token được trả về
    });
  } catch (error) {
    console.error("Error creating staff account:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateAccount = async (req, res) => {
  const { id } = req.params;

  const account = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid account ID" });
  }

  try {
    const updatedAccount = await Account.findByIdAndUpdate(id, account, {
      new: true,
    });

    if (!updatedAccount) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    // Nếu cần tạo token mới (ví dụ khi username hoặc role thay đổi)
    if (account.username || account.role) {
      generateToken(
        res,
        updatedAccount._id,
        updatedAccount.username,
        updatedAccount.role
      );
    }

    res.status(200).json({ success: true, data: updatedAccount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAccountsById = async (req, res) => {
  const { id } = req.params;

  // Kiểm tra xem ID có hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Id không hợp lệ",
    });
  }

  try {
    // Tìm tài khoản theo ID
    const account = await Account.findById(id);

    // Nếu không tìm thấy tài khoản
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    // Trả về dữ liệu tài khoản
    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error("Lỗi khi tìm tài khoản: ", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const updateGmailAndNumbers = async (req, res) => {
  const { id } = req.params; // Lấy ID từ params
  const { gmail, numbers } = req.body; // Lấy dữ liệu từ body request

  // Kiểm tra ID có hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid account ID" });
  }

  // Kiểm tra xem cả hai trường đều được cung cấp
  if (!gmail || !numbers) {
    return res.status(400).json({
      success: false,
      message: "Both 'gmail' and 'numbers' are required",
    });
  }

  try {
    // Kiểm tra xem gmail mới có trùng không
    const existingAccount = await Account.findOne({ gmail });
    if (existingAccount && existingAccount._id.toString() !== id) {
      return res.status(400).json({
        success: false,
        message: "Gmail already in use by another account",
      });
    }

    // Cập nhật thông tin
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { gmail, numbers },
      { new: true } // Trả về dữ liệu sau khi cập nhật
    );

    // Kiểm tra xem tài khoản có tồn tại không
    if (!updatedAccount) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedAccount,
      message: "Account updated successfully",
    });
  } catch (error) {
    console.error("Error updating account:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
