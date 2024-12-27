import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

// Lấy danh sách review
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate("product", "name");

    if (!reviews || reviews.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error in fetching reviews:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Tạo mới review
export const createReview = async (req, res) => {
  const { id } = req.params; // Nhận productId từ URL
  const { name, email, content, rate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product ID" });
  }

  if (!name || !email || !content || !rate) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const existingProduct = await Product.findById(id); // Sử dụng productId từ URL
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const newReview = new Review({
      product: id,
      name,
      email,
      content,
      rate,
    });
    await newReview.save();

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    console.error("Error in creating review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Cập nhật review
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { name, email, content, rate, activeReview } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Review ID" });
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { name, email, content, rate, activeReview },
      { new: true }
    );

    if (!updatedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    console.error("Error in updating review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Xóa review
export const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Review ID" });
  }

  try {
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleting review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getReviewsByProduct = async (req, res) => {
  const { id } = req.params;

  // Kiểm tra xem ID có hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Id không hợp lệ" });
  }

  try {
    // Chỉ lấy những review có activeReview = 1
    const reviews = await Review.find({ product: id, activeReview: 1 });

    if (reviews.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error in fetching reviews for product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
