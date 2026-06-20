import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    resumeUrl: { type: String, required: true },
    resumePublicId: { type: String, default: "" },
    coverLetter: { type: String, default: "" },
    position: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "review", "shortlisted", "rejected", "offer"],
      default: "new",
    },
  },
  { timestamps: true }
);

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    applications: [applicationSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Career", careerSchema);
