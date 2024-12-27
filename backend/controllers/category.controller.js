import mongoose from "mongoose";
import Category from "../models/category.model.js";

export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.log("Error in fetching categories", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createCategory = async (req, res) => {
  const { name, isActive } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Category name is required" });
  }

  try {
    const newCategory = new Category({ name, isActive });
    await newCategory.save();

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Category name must be unique" });
    }
    console.error("Error in creating category: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, isActive } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Category ID" });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, isActive },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Category name must be unique" });
    }
    console.error("Error in updating category: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
