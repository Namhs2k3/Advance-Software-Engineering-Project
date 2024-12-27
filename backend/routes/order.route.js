import express from "express";
import {
  createOrder,
  getOrder,
  updateOrder,
} from "../controllers/order.controller.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/", getOrder);
router.post("/", createOrder);
router.put("/:id", updateOrder);

export default router;
