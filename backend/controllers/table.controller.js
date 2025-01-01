import mongoose from "mongoose";
import Table from "../models/table.model.js";
import Product from "../models/product.model.js";
import Ingredient from "../models/ingredient.model.js";
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Table ID" });
  }

  try {
    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { ...req.body },
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
  const { productId, quantity } = req.body;

  try {
    const table = await Table.findById(id);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const ingredientUpdates = [];
    let needsDisplayTypeUpdate = false;

    for (const ingredientId of product.ingredients) {
      const ingredientDoc = await Ingredient.findById(ingredientId);

      if (!ingredientDoc) {
        return res
          .status(404)
          .json({ success: false, message: `Ingredient ${ingredientId} not found` });
      }

      // const totalRequired = requiredQuantity * quantity;

      if (ingredientDoc.quantity < quantity) {
        return res
          .status(400)
          .json({ success: false, message: `Not enough ${ingredientDoc.name} in stock` });
      }

      if (ingredientDoc.quantity - quantity < ingredientDoc.safeThreshold) {
        needsDisplayTypeUpdate = true;
      }

      ingredientDoc.quantity -= quantity;
      ingredientUpdates.push(ingredientDoc.save());
    }

    if (needsDisplayTypeUpdate) {
      product.displayType = 2;
      await product.save();
    }

    const existingCartItem = table.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      table.cart.push({
        product: productId,
        quantity,
        statusProduct: [{ state: 0, doneQuantity: 0 }],
      });
    }

    // Lưu các cập nhật vào ingredients
    await Promise.all(ingredientUpdates);

    // Lưu table
    await table.save();

    res.status(200).json({
      success: true,
      updatedCartItem: table.cart,
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
  const { productId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Table ID" });
  }

  try {
    const table = await Table.findById(id);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const ingredientUpdates = [];
    let needsDisplayTypeUpdate = false;

    for (const ingredientId of product.ingredients) {
      const ingredientDoc = await Ingredient.findById(ingredientId);

      if (!ingredientDoc) {
        return res
          .status(404)
          .json({ success: false, message: `Ingredient ${ingredientId} not found` });
      }

      // if (ingredientDoc.quantity < quantity) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: `Not enough ${ingredientDoc.name} in stock` });
      // }

      if (ingredientDoc.quantity + quantity > ingredientDoc.safeThreshold) {
        needsDisplayTypeUpdate = true;
      }

      ingredientDoc.quantity += quantity;
      ingredientUpdates.push(ingredientDoc.save());
    }

    if (needsDisplayTypeUpdate) {
      product.displayType = 1;
      await product.save();
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
  const { productId, value } = req.body; // Product ID and new quantity

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Table ID" });
  }

  try {
    const table = await Table.findById(id);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    const cartItem = table.cart.find(
      (item) => item.product.toString() === productId
    );
    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const ingredientUpdates = [];
    let needsDisplayTypeUpdate = false;

    for (const ingredientId of product.ingredients) {
      const ingredientDoc = await Ingredient.findById(ingredientId);

      if (!ingredientDoc) {
        return res
          .status(404)
          .json({ success: false, message: `Ingredient ${ingredientId} not found` });
      }

      const qty = ingredientDoc.quantity - cartItem.quantity - value;
      if (value > 0 && ingredientDoc.quantity < ingredientDoc.safeThreshold || qty <= 0) {
        return res
          .status(404)
          .json({ success: false, message: "Cannot add this item anymore" });
      }

      if (qty > 0 && qty < ingredientDoc.safeThreshold) {
        needsDisplayTypeUpdate = false;
      } else {
        needsDisplayTypeUpdate = true;
      }

      if (needsDisplayTypeUpdate || value < 0) ingredientDoc.quantity -= value;
      ingredientUpdates.push(ingredientDoc.save());
    }

    if (needsDisplayTypeUpdate) {
      product.displayType = 1;
      await product.save();
    } else {
      product.displayType = 2;
      await product.save();
    }

    if (cartItem.quantity + value === 0) {
      table.cart = table.cart.filter((item) => item.product.toString() !== productId);
    } else {
      cartItem.quantity += value;
    }

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
      return res.status(400).json({
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

export const updateNotice = async (req, res) => {
  const { id } = req.params; // Lấy ID từ params
  const updates = req.body; // Lấy thông tin cần update từ body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Table ID" });
  }

  try {
    const updatedTable = await Table.findByIdAndUpdate(
      id,
      updates, // Thông tin cần cập nhật (trong trường hợp này là { notice: 0 })
      { new: true } // Trả về document đã được cập nhật
    );

    if (!updatedTable) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.status(200).json({ success: true, data: updatedTable });
  } catch (error) {
    console.error("Error in updating table: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getTableAsNotice = async (req, res) => {
  try {
    const tables = await Table.find({ notice: 1 })
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

export const swapTables = async (req, res) => {
  const { tableId1, tableId2 } = req.body; // Nhận id của hai bàn

  try {
    // Lấy thông tin của hai bàn từ cơ sở dữ liệu
    const table1 = await Table.findById(tableId1);
    const table2 = await Table.findById(tableId2);

    if (!table1 || !table2) {
      return res
        .status(404)
        .json({ success: false, message: "One or both tables not found" });
    }

    // Chuyển đổi dữ liệu của bàn
    const table1Data = {
      isActive: table2.isActive,
      status: table2.status,
      activeStep: table2.activeStep,
      request: table2.request,
      notice: table2.notice,
      cart: table2.cart,
    };

    const table2Data = {
      isActive: table1.isActive,
      status: table1.status,
      activeStep: table1.activeStep,
      request: table1.request,
      notice: table1.notice,
      cart: table1.cart,
    };

    // Cập nhật dữ liệu cho hai bàn
    table1.set(table1Data);
    table2.set(table2Data);

    // Lưu lại dữ liệu mới
    await table1.save();
    await table2.save();

    // Trả về kết quả thành công
    return res.status(200).json({
      success: true,
      message: "Tables swapped successfully",
      table1: table1,
      table2: table2,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

