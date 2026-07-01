import mongoose from "mongoose";

const sizeCustomizationRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    productName: { type: String, default: "", trim: true },
    bodyPart: { type: String, default: "", trim: true },
    measurement: { type: String, default: "", trim: true },
    measurementUnit: { type: String, default: "cm", trim: true },
    preferredSize: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminNotes: { type: String, default: "", trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model(
  "SizeCustomizationRequest",
  sizeCustomizationRequestSchema
);
