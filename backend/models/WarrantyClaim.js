import mongoose from "mongoose";

const warrantyClaimSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, trim: true },
    product: { type: String, required: true, trim: true },
    issue: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("WarrantyClaim", warrantyClaimSchema);
