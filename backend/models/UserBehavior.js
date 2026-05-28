import mongoose from "mongoose";

const userBehaviorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    recentSearches: {
      type: [String],
      default: [],
    },
    viewedProductIds: {
      type: [String],
      default: [],
    },
    clickedCategories: {
      type: [String],
      default: [],
    },
    cartProductIds: {
      type: [String],
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserBehavior", userBehaviorSchema);
