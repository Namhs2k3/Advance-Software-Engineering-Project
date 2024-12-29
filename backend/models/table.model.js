import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Number, default: 1 },
    status: { type: Number, default: 1 },
    activeStep: { type: Number, default: 0 },
    request: { type: Number, default: 0 },
    notice: { type: Number, default: 0 },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        statusProduct: [
          {
            status: { type: Number, default: 0 },
            quantity: { type: Number, default: 0 },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Table = mongoose.model("Table", tableSchema);

export default Table;
