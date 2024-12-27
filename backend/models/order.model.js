import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  number: { type: String, required: true },
  email: { type: String, required: true },
  note: { type: String, required: false },
  paymentMethod: { type: String, required: true },
  discount: { type: Number, default: 0 }, // Thêm giảm giá
  finalPrice: { type: Number, required: true }, // Tổng tiền cuối
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
