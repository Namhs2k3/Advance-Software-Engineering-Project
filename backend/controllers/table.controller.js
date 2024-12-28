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
