import express from "express";
import {
  createReview,
  deleteReview,
  getReviews,
  getReviewsByProduct,
  updateReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", getReviews);
router.get("/:id", getReviewsByProduct);
router.post("/:id", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
