import mongoose from "mongoose";

const supportMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Product Help", "Size Guide", "Order Help", "Return Request", "Bulk Inquiry", "Other"],
      default: "Product Help",
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "resolved"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SupportMessage", supportMessageSchema);