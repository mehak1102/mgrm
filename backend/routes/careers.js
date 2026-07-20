import express from "express";
import multer from "multer";
import Career from "../models/Career.js";
import { auth, adminOnly } from "../middleware/auth.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF or Word documents are allowed"));
  },
});

function publicJob(job) {
  return {
    _id: job._id,
    title: job.title,
    department: job.department,
    location: job.location,
    experience: job.experience,
    type: job.type,
    description: job.description,
    status: job.status,
    createdAt: job.createdAt,
  };
}

router.get("/admin/all", auth, adminOnly, async (_req, res) => {
  try {
    const jobs = await Career.find().sort({ createdAt: -1 });
    const stats = {
      openPositions: jobs.filter((j) => j.status === "open").length,
      applications: jobs.reduce((sum, j) => sum + j.applications.length, 0),
      shortlisted: jobs.reduce(
        (sum, j) => sum + j.applications.filter((a) => a.status === "shortlisted").length,
        0
      ),
    };
    res.json({ jobs, stats });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const jobs = await Career.find({ status: "open" }).sort({ createdAt: -1 });
    res.json({ jobs: jobs.map(publicJob) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const job = await Career.create(req.body);
    res.json({ job });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const job = await Career.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });
    if (!job) return res.status(404).json({ msg: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.patch("/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }
    const job = await Career.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!job) return res.status(404).json({ msg: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.patch("/:jobId/applications/:appId", auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["new", "review", "shortlisted", "rejected", "offer"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ msg: "Invalid application status" });
    }

    const job = await Career.findById(req.params.jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    const app = job.applications.id(req.params.appId);
    if (!app) return res.status(404).json({ msg: "Application not found" });

    app.status = status;
    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Career.findOne({ _id: req.params.id, status: "open" });
    if (!job) return res.status(404).json({ msg: "Position not found" });
    res.json({ job: publicJob(job) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/:id/apply", upload.single("resume"), async (req, res) => {
  try {
    const job = await Career.findOne({ _id: req.params.id, status: "open" });
    if (!job) return res.status(404).json({ msg: "This position is no longer open" });

    const { name, email, phone, coverLetter } = req.body;
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return res.status(400).json({ msg: "Name, email, and phone are required" });
    }
    if (!req.file) return res.status(400).json({ msg: "Resume file is required" });

    if (!process.env.CLOUDINARY_API_KEY) {
      return res.status(500).json({ msg: "Resume upload is unavailable. Please email careers@mgrm.com" });
    }

    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "mgrm-resumes", {
      resource_type: "raw",
      format: req.file.mimetype.includes("pdf") ? "pdf" : undefined,
    });

    job.applications.push({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      coverLetter: (coverLetter || "").trim(),
      position: job.title,
      resumeUrl: uploadResult.secure_url,
      resumePublicId: uploadResult.public_id,
      status: "new",
    });

    await job.save();

    res.json({ ok: true, msg: "Application submitted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
