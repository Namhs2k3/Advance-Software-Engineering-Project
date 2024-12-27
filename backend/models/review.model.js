import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Tham chiếu đến model Product
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    rate: { type: Number, required: true }, // Điểm đánh giá (1-5)
    activeReview: { type: Number, default: 1 }, // 1: Active, 2: Hidden
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
