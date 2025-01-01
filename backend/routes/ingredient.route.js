import express from "express";
import {
  createIngredient,
  deleteIngredient,
  getIngredients,
  updateIngredient,
  generateInventoryReport
} from "../controllers/ingredient.controller.js";

const router = express.Router();

router.get("/", getIngredients);
router.post("/", createIngredient);
router.put("/:id", updateIngredient);
router.delete("/:id", deleteIngredient);
router.get("/inventory-report", generateInventoryReport);

export default router;
