import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number},
  },
  { timestamps: true }
);

cartItemSchema.pre("save", async function (next) {
  const product = await mongoose.model("Product").findById(this.product);
  if (!product) {
    throw new Error("Product not found");
  }
  this.totalPrice = product.sell_price * this.quantity;
  next();
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

export default CartItem;
