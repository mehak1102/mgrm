import express from "express";
import SupportMessage from "../models/SupportMessage.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, type, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ msg: "Name and message are required" });
    }

    const supportMessage = await SupportMessage.create({
      name,
      email,
      phone,
      type,
      message,
    });

    res.status(201).json({
      msg: "Support request submitted successfully",
      supportMessage,
    });
  } catch (err) {
    console.error("Support create error:", err);
    res.status(500).json({ msg: err.message });
  }
});

router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.patch("/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const message = await SupportMessage.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after" }
    );

    res.json(message);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;