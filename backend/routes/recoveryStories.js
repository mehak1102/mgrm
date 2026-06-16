import express from "express";
import RecoveryStory from "../models/RecoveryStory.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public: published stories for a product
router.get("/product/:productId", async (req, res) => {
  try {
    const stories = await RecoveryStory.find({
      productId: req.params.productId,
      status: { $in: ["approved", "published"] },
    })
      .sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 })
      .populate("userId", "name profileImage")
      .populate("productId", "name slug")
      .lean();
    res.json({ stories });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// User: my stories
router.get("/my", auth, async (req, res) => {
  try {
    const stories = await RecoveryStory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("productId", "name slug images")
      .lean();
    res.json({ stories });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// User: submit story
router.post("/", auth, async (req, res) => {
  try {
    const { productId, beforeImage, afterImage, title, story, recoveryDuration } =
      req.body;

    if (!productId || !beforeImage || !afterImage || !title) {
      return res.status(400).json({ msg: "Product, images, and title are required" });
    }

    const created = await RecoveryStory.create({
      userId: req.user.id,
      productId,
      beforeImage,
      afterImage,
      title: title.trim(),
      story: (story || "").trim(),
      recoveryDuration: (recoveryDuration || "").trim(),
      status: "pending",
    });

    const populated = await RecoveryStory.findById(created._id)
      .populate("productId", "name slug")
      .lean();

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// User: delete own pending/rejected story
router.delete("/:id", auth, async (req, res) => {
  try {
    const story = await RecoveryStory.findById(req.params.id);
    if (!story) return res.status(404).json({ msg: "Story not found" });

    const isOwner = String(story.userId) === String(req.user.id);
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && (!isOwner || !["pending", "rejected"].includes(story.status))) {
      return res.status(403).json({ msg: "Cannot delete this story" });
    }

    await story.deleteOne();
    res.json({ msg: "Story deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: all stories for moderation
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const stories = await RecoveryStory.find(filter)
      .sort({ createdAt: -1 })
      .populate("productId", "name slug")
      .populate("userId", "name email")
      .lean();
    res.json({ stories });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: moderate / feature
router.patch("/:id", auth, adminOnly, async (req, res) => {
  try {
    const { status, isFeatured, sortOrder } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;

    const story = await RecoveryStory.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    })
      .populate("productId", "name slug")
      .populate("userId", "name email");

    if (!story) return res.status(404).json({ msg: "Story not found" });
    res.json(story);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
