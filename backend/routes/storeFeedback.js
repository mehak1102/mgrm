import express from "express";
import StoreFeedback from "../models/StoreFeedback.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: "Name, email, and message are required" });
    }

    const feedback = await StoreFeedback.create({
      name,
      email,
      phone: phone || "",
      subject: subject || "",
      message,
    });

    res.status(201).json({ msg: "Feedback submitted successfully", feedback });
  } catch (err) {
    console.error("Store feedback create error:", err);
    res.status(500).json({ msg: err.message });
  }
});

router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const { search = "", read, page = 1, limit = 20 } = req.query;
    const query = {};

    if (read === "true") query.isRead = true;
    if (read === "false") query.isRead = false;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      StoreFeedback.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      StoreFeedback.countDocuments(query),
    ]);

    res.json({ feedback: items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.patch("/:id/read", auth, adminOnly, async (req, res) => {
  try {
    const item = await StoreFeedback.findByIdAndUpdate(
      req.params.id,
      { isRead: req.body.isRead ?? true },
      { returnDocument: "after" }
    );
    if (!item) return res.status(404).json({ msg: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await StoreFeedback.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/export/csv", auth, adminOnly, async (req, res) => {
  try {
    const items = await StoreFeedback.find().sort({ createdAt: -1 });
    const header = "Name,Email,Phone,Subject,Message,Read,Created At\n";
    const rows = items
      .map((f) =>
        [
          `"${f.name}"`,
          `"${f.email}"`,
          `"${f.phone}"`,
          `"${f.subject}"`,
          `"${f.message.replace(/"/g, '""')}"`,
          f.isRead,
          f.createdAt.toISOString(),
        ].join(",")
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=store-feedback.csv");
    res.send(header + rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
