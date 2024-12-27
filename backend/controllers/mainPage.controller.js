import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import mongoose from "mongoose";

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Id không hợp lệ",
      });
    }

    const product = await Product.findById(id).populate("category", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }

    const productWithFullImagePath = {
      ...product.toObject(),
      image: `http://localhost:5000/assets/${product.image}`,
    };

    res.status(200).json({
      success: true,
      data: productWithFullImagePath,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

export const getHotProducts = async (req, res) => {
  try {
    const filter = {
      displayHot: 1,
      displayType: 1,
    };

    const products = await Product.find(filter).populate("category", "name");

    const productsWithFullImagePath = products.map((product) => ({
      ...product.toObject(),
      image: `http://localhost:5000/assets/${product.image}`,
    }));

    res.status(200).json({
      success: true,
      data: productsWithFullImagePath,
    });
  } catch (error) {
    console.error("Error in fetching filtered products:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getActiveProducts = async (req, res) => {
  try {
    const filter = {
      displayType: 1,
    };

    const products = await Product.find(filter).populate(
      "category",
      "name isActive"
    );

    const productsWithFullImagePath = products.map((product) => ({
      ...product.toObject(),
      image: `http://localhost:5000/assets/${product.image}`,
    }));

    res.status(200).json({
      success: true,
      data: productsWithFullImagePath,
    });
  } catch (error) {
    console.error("Error in fetching filtered products:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getActiveCategory = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: 1 });

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.log("Error in fetching categories", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
