import Product from "../models/product.model.js";
import mongoose from "mongoose";
import Category from "../models/category.model.js";
export const getProduct = async (req, res) => {
  const { searchTerm } = req.query; // Get search term from query parameters

  try {
    // If there's a search term, filter products by name (case-insensitive search)
    const products = await Product.find({
      name: new RegExp(searchTerm, "i"), // 'i' for case-insensitive
    }).populate("category", "name");

    const productsWithFullImagePath = products.map((product) => ({
      ...product.toObject(),
      image: `http://localhost:5000/assets/${product.image}`,
    }));

    // Return filtered products based on search term
    res.status(200).json({
      success: true,
      data: productsWithFullImagePath,
    });
  } catch (error) {
    console.error("Error in fetching products: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const createProduct = async (req, res) => {
  const product = req.body;

  if (!product.name)
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Image is required" });
  }
  if (!product.sell_price)
    return res
      .status(400)
      .json({ success: false, message: "Sell price is required" });
  if (!product.price)
    return res
      .status(400)
      .json({ success: false, message: "Price is required" });
  if (!product.category)
    return res
      .status(400)
      .json({ success: false, message: "Category is required" });

  if (product.sell_price > product.price) {
    return res
      .status(400)
      .json({ success: false, message: "Sell price should not exceed price" });
  }

  try {
    const categoryExists = await Category.findById(product.category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const imagePath = req.file.filename;

    const newProduct = new Product({
      ...product,
      image: imagePath,
    });

    await newProduct.save();
    const populatedProduct = await Product.findById(newProduct._id).populate(
      "category",
      "name"
    );
    const productWithFullImagePath = {
      ...populatedProduct.toObject(),
      image: `http://localhost:5000/assets/${populatedProduct.image}`,
    };
    res.status(201).json({ success: true, data: productWithFullImagePath });
  } catch (error) {
    console.log("Error in creating product", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Product ID" });
  }

  try {
    if (product.category) {
      const categoryExists = await Category.findById(product.category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Kiểm tra và cập nhật ảnh nếu có
    let updatedImagePath = existingProduct.image;
    if (req.file) {
      updatedImagePath = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...product, image: updatedImagePath },
      { new: true }
    ).populate("category", "name");

    const productWithFullImagePath = {
      ...updatedProduct.toObject(),
      image: updatedProduct.image
        ? `http://localhost:5000/assets/${updatedProduct.image}`
        : null,
    };

    res.status(200).json({ success: true, data: productWithFullImagePath });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Product ID" });
  }

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error in deleting products: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
