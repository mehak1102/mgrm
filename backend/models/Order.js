import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    userName: String,
    userEmail: String,
    items: Array,
    total: Number,
    address: Object,
    paymentMethod: { type: String, default: "COD" },
    status: {
      type: String,
      enum: ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);