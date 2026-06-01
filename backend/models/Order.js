import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    userName: String,
    userEmail: String,
    userPhone: String,

    items: Array,
    total: Number,

    address: String,

    paymentMethod: {
      type: String,
      default: "COD",
    },

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    razorpayPaymentId: String,
    razorpayOrderId: String,

    status: {
      type: String,
      enum: ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);