import mongoose from "mongoose";

const cartReminderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    userId: { type: String, default: "" },
    name: { type: String, default: "" },
    items: { type: Array, default: [] },
    total: { type: Number, default: 0 },
    remindedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

cartReminderSchema.index({ email: 1 });

export default mongoose.model("CartReminder", cartReminderSchema);
