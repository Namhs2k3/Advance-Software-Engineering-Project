import Ingredient from "../models/ingredient.model.js";
import mongoose from "mongoose";
import { Parser } from '@json2csv/plainjs';

export const getIngredients = async (req, res) => {
  const { searchTerm } = req.query; // Get search term from query parameters

  try {
    // If there's a search term, filter ingredients by name (case-insensitive search)
    const ingredients = await Ingredient.find({
      name: new RegExp(searchTerm, "i"), // 'i' for case-insensitive
    });

    res.status(200).json({
      success: true,
      data: ingredients,
    });
  } catch (error) {
    console.error("Error in fetching ingredients: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const createIngredient = async (req, res) => {
  const ingredient = req.body;

  if (!ingredient.name)
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });

  if (!ingredient.quantity)
    return res
      .status(400)
      .json({ success: false, message: "Quantity is required" });

  if (!ingredient.safeThreshold)
    return res
      .status(400)
      .json({ success: false, message: "Safe threshold is required" });

  try {
    const newIngredient = new Ingredient(ingredient);

    await newIngredient.save();

    res.status(201).json({ success: true, data: newIngredient });
  } catch (error) {
    console.log("Error in creating ingredient", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateIngredient = async (req, res) => {
  const { id } = req.params;
  const ingredient = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Ingredient ID" });
  }

  try {
    const existingIngredient = await Ingredient.findById(id);
    if (!existingIngredient) {
      return res
        .status(404)
        .json({ success: false, message: "Ingredient not found" });
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      ingredient,
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedIngredient });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteIngredient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Ingredient ID" });
  }

  try {
    await Ingredient.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Ingredient deleted" });
  } catch (error) {
    console.error("Error in deleting ingredients: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const generateInventoryReport = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().select('name quantity safeThreshold').lean();
    const ingredientsForCsv = ingredients.map(ingredient => ({
      'Tên': ingredient.name,
      'Số lượng': ingredient.quantity,
      'Ngưỡng an toàn': ingredient.safeThreshold
    }));
    const csvParser = new Parser();
    const csvData = csvParser.parse(ingredientsForCsv);
    const bom = '\ufeff';
    const csvWithBom = bom + csvData;

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("inventory_report.csv");
    res.send(csvWithBom);
  } catch (error) {
    console.error("Error generating inventory report:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

