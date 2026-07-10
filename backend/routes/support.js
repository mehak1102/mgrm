import express from "express";
import mongoose from "mongoose";
import SupportMessage from "../models/SupportMessage.js";
import { auth, adminOnly, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeEmail(email) {
  return email?.toLowerCase?.()?.trim() || "";
}

function toObjectId(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

function buildUserTicketQuery(user) {
  const userId = user?.id;
  const email = normalizeEmail(user?.email);
  const or = [];

  const objectId = toObjectId(userId);
  if (objectId) {
    or.push({ userId: objectId });
  }
  if (userId) {
    or.push({ userId: String(userId) });
  }
  if (email) {
    or.push({ email });
    or.push({ email: { $regex: new RegExp(`^${escapeRegex(email)}$`, "i") } });
  }

  return or.length ? { $or: or } : null;
}

async function linkOrphanedTickets(user) {
  const email = normalizeEmail(user?.email);
  const objectId = toObjectId(user?.id);
  if (!email || !objectId) return;

  await SupportMessage.updateMany(
    {
      email: { $regex: new RegExp(`^${escapeRegex(email)}$`, "i") },
      $or: [{ userId: null }, { userId: { $exists: false } }],
    },
    { $set: { userId: objectId, email } }
  );
}

router.post("/", optionalAuth, async (req, res) => {
  try {
    const { name, email, phone, type, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ msg: "Name and message are required" });
    }

    const accountEmail = normalizeEmail(req.user?.email);
    const bodyEmail = normalizeEmail(email);
    const userObjectId = toObjectId(req.user?.id);

    const supportMessage = await SupportMessage.create({
      name: String(name).trim(),
      email: accountEmail || bodyEmail,
      phone: phone || "",
      type,
      message,
      userId: userObjectId,
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

router.get("/my", auth, async (req, res) => {
  try {
    await linkOrphanedTickets(req.user);

    const query = buildUserTicketQuery(req.user);
    if (!query) {
      return res.json({ count: 0, openCount: 0, messages: [] });
    }

    const messages = await SupportMessage.find(query).sort({ createdAt: -1 });
    const openCount = messages.filter((m) => m.status !== "resolved").length;

    res.json({
      count: messages.length,
      openCount,
      messages,
    });
  } catch (err) {
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