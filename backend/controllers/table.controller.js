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
    const existingCartItem = table.cart.find(
      (item) => item.product.toString() === productId // Fix: Referencing 'cart' not 'CartItem'
    );

    if (existingCartItem) {
      // Cập nhật số lượng và tổng giá
      existingCartItem.quantity += quantity;
      existingCartItem.totalPrice += totalPrice;
    } else {
      // Thêm sản phẩm mới vào giỏ
      table.cart.push({ product: productId, quantity, totalPrice });
    }

    // Lưu vào cơ sở dữ liệu
    await table.save();

    res.status(200).json({
      success: true,
      updatedCartItem: table.cart, // Trả về giỏ hàng đã cập nhật
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTableById = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Table ID" });
  }

  try {
    const table = await Table.findById(id)
      .populate("cart.product") // Populate the product field in the cart
      .exec();

    // If table not found, return an error
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Modify the cart products to include the full image path
    table.cart = table.cart.map((item) => ({
      ...item.toObject(),
      product: {
        ...item.product.toObject(),
        image: `http://localhost:5000/assets/${item.product.image}`, // Add the full image path
      },
    }));

    // Return the table with populated cart information
    res.status(200).json({ success: true, data: table });
  } catch (error) {
    console.error("Error in fetching table by ID: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Remove a product from the table's cart
export const removeProductFromCart = async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Table ID" });
  }

  try {
    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ success: false, message: "Table not found" });
    }

    // Remove product from the cart
    table.cart = table.cart.filter(
      (item) => item.product.toString() !== productId
    );

    // Save the updated table
    await table.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: table.cart,
    });
  } catch (error) {
    console.error("Error in removing product from cart:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update product quantity in the table's cart
export const updateProductQuantity = async (req, res) => {
  const { id } = req.params; // Table ID
  const { productId, quantity } = req.body; // Product ID and new quantity

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Table ID" });
  }

  if (quantity < 1) {
    return res.status(400).json({ success: false, message: "Invalid quantity" });
  }

  try {
    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ success: false, message: "Table not found" });
    }

    // Find the product in the cart and update its quantity
    const cartItem = table.cart.find((item) => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    cartItem.quantity = quantity;

    // Save the updated table
    await table.save();

    res.status(200).json({
      success: true,
      message: "Product quantity updated successfully",
      data: table.cart,
    });
  } catch (error) {
    console.error("Error updating product quantity:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const sendRequestToChef = async (req, res) => {
  const { id } = req.params;

  // Kiểm tra ID bàn có hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Table ID" });
  }

  try {
    // Tìm bàn theo ID
    const table = await Table.findById(id);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    // Kiểm tra nếu bàn có sản phẩm trong giỏ hàng không
    if (!table.cart || table.cart.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Bàn này không có món trong giỏ hàng.",
        });
    }

    // Cập nhật trường request của bàn được chọn
    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { request: 1 }, // Set request thành 1
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Request sent to chef successfully",
      data: updatedTable,
    });
  } catch (error) {
    console.error("Error in sending request to chef:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getTableAsRequest = async (req, res) => {
  try {
    const tables = await Table.find({ request: 1 })
      .populate({
        path: "cart.product", // Populate product details from the Product model
        select: "name image price category", // Select fields to include
        populate: {
          path: "category", // Populate category details
          select: "name", // Include only the category name
        },
      })
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    // Process image paths
    const tablesWithImages = tables.map((table) => ({
      ...table,
      cart: table.cart.map((item) => ({
        ...item,
        product: {
          ...item.product,
          image: item.product.image
            ? `http://localhost:5000/assets/${item.product.image}`
            : null, // Add full image path if exists
        },
      })),
    }));

    res.status(200).json({
      success: true,
      data: tablesWithImages,
    });
  } catch (error) {
    console.error("Error in fetching tables with products: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};