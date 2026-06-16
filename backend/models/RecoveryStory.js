import mongoose from "mongoose";

const recoveryStorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    beforeImage: { type: String, required: true },
    afterImage: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    story: { type: String, default: "", trim: true },
    recoveryDuration: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "published", "rejected"],
      default: "pending",
      index: true,
    },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("RecoveryStory", recoveryStorySchema);
