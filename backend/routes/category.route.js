import express from "express";
import {
  createCategory,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";
const router = express.Router();

router.get("/", getCategory);
router.post("/", createCategory);
router.put("/:id", updateCategory);

export default router;
