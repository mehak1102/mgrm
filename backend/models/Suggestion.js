import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    category: {
      type: String,
      enum: ["Product Idea", "Website Feedback", "Service Improvement", "General Suggestion"],
      default: "General Suggestion",
    },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Suggestion", suggestionSchema);
