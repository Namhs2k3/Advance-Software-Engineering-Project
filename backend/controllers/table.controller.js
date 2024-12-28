import mongoose from "mongoose";
import Table from "../models/table.model.js";
// Get all tables
export const getTables = async (req, res) => {
  try {
    const tables = await Table.find({});
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    console.error("Error in fetching tables", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new table
export const createTable = async (req, res) => {
  const { name, isActive } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Table name is required" });
  }

  try {
    const newTable = new Table({ name, isActive });
    await newTable.save();

    res.status(201).json({ success: true, data: newTable });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Table name must be unique" });
    }
    console.error("Error in creating table: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a table
export const updateTable = async (req, res) => {
  const { id } = req.params;
  const { name, isActive } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Table ID" });
  }

  try {
    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { name, isActive },
      { new: true }
    );

    if (!updatedTable) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.status(200).json({ success: true, data: updatedTable });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Table name must be unique" });
    }
    console.error("Error in updating table: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a table
export const deleteTable = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Table ID" });
  }

  try {
    const deletedTable = await Table.findByIdAndDelete(id);

    if (!deletedTable) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Table deleted successfully" });
  } catch (error) {
    console.error("Error in deleting table: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add a product to the table's cart
export const addProductToCart = async (req, res) => {
  const { id } = req.params;
  const { productId, quantity, totalPrice } = req.body;

  try {
    const table = await Table.findById(id);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    // Kiểm tra nếu sản phẩm đã có trong giỏ
    const existingCartItem = table.CartItem.find(
      (item) => item.productId.toString() === productId
    );

    if (existingCartItem) {
      // Cập nhật số lượng và tổng giá
      existingCartItem.quantity += quantity;
      existingCartItem.totalPrice += totalPrice;
    } else {
      // Thêm sản phẩm mới vào giỏ
      table.CartItem.push({ productId, quantity, totalPrice });
    }

    // Lưu vào cơ sở dữ liệu
    await table.save();

    res.status(200).json({
      success: true,
      updatedCartItem: table.CartItem, // Trả về giỏ hàng đã cập nhật
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTableById = async (req, res) => {
  const { id } = req.params;

  // Kiểm tra ID có hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Table ID" });
  }

  try {
    // Tìm table theo ID và populate trường cart.product
    const table = await Table.findById(id).populate("cart.product");

    // Kiểm tra nếu không tìm thấy table
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Trả về thông tin table với thông tin cart đã được populate
    res.status(200).json({ success: true, data: table });
  } catch (error) {
    console.error("Error in fetching table by ID: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
