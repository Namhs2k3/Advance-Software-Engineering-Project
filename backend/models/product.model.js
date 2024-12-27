import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    sell_price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    displayType: { type: Number, default: 1 },
    displayHot: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
