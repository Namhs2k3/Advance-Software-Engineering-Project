import express from "express";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cartItem.controller.js";

const router = express.Router();

router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeFromCart);

export default router;
