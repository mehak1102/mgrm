import express from "express";
import Suggestion from "../models/Suggestion.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, category, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ msg: "Name and suggestion are required" });
    }

    const suggestion = await Suggestion.create({
      name,
      email: email || "",
      category: category || "General Suggestion",
      message,
    });

    res.status(201).json({ msg: "Suggestion submitted successfully", suggestion });
  } catch (err) {
    console.error("Suggestion create error:", err);
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
        { category: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Suggestion.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Suggestion.countDocuments(query),
    ]);

    res.json({ suggestions: items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.patch("/:id/read", auth, adminOnly, async (req, res) => {
  try {
    const item = await Suggestion.findByIdAndUpdate(
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
    await Suggestion.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/export/csv", auth, adminOnly, async (req, res) => {
  try {
    const items = await Suggestion.find().sort({ createdAt: -1 });
    const header = "Name,Email,Category,Message,Read,Created At\n";
    const rows = items
      .map((item) =>
        [
          `"${item.name}"`,
          `"${item.email}"`,
          `"${item.category}"`,
          `"${item.message.replace(/"/g, '""')}"`,
          item.isRead,
          item.createdAt.toISOString(),
        ].join(",")
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=suggestions.csv");
    res.send(header + rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
