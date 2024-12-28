import express from "express";
import {
  addProductToCart,
  createTable,
  deleteTable,
  getTableAsRequest,
  getTableById,
  getTables,
  updateTable,
} from "../controllers/table.controller.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();

router.get("/request", upload.single("image"), getTableAsRequest);
router.get("/", getTables);
router.get("/:id", getTableById);
router.post("/", createTable);
router.put("/:id/addProduct", addProductToCart);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

export default router;
