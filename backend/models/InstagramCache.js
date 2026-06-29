import mongoose from "mongoose";

const instagramCacheSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    profile: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("InstagramCache", instagramCacheSchema);
