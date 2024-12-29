import express from "express";
import {
  addProductToCart,
  createTable,
  deleteTable,
  getTableById,
  getTables,
  updateTable,
  removeProductFromCart,
  updateProductQuantity,
  sendRequestToChef,
  getTableAsRequest,
  getTableAsNotice,
  updateNotice,
} from "../controllers/table.controller.js";

const router = express.Router();

router.get("/request", getTableAsRequest);
router.get("/notice", getTableAsNotice);
router.get("/", getTables);
router.get("/:id", getTableById);
router.post("/", createTable);
router.put("/:id/notice", updateNotice);
router.put("/:id/addProduct", addProductToCart);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);
router.put("/:id/removeProduct", removeProductFromCart);
router.put("/:id/updateProductQuantity", updateProductQuantity);
router.put("/:id/sendRequest", sendRequestToChef);

export default router;
