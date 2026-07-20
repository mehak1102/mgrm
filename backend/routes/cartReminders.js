import express from "express";
import CartReminder from "../models/CartReminder.js";
import { optionalAuth } from "../middleware/auth.js";
import { formRateLimiter } from "../middleware/rateLimit.js";
import { sendAbandonedCartEmail } from "../utils/mail.js";

const router = express.Router();
const REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;

router.post("/", formRateLimiter, optionalAuth, async (req, res) => {
  try {
    const { email, name, items, total } = req.body;
    const normalizedEmail = String(email || req.user?.email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail || !/\S+@\S+\.\S+/.test(normalizedEmail)) {
      return res.status(400).json({ msg: "Valid email is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    const snapshot = items.map((item) => ({
      _id: item._id,
      name: item.name,
      qty: item.qty,
      selectedSize: item.selectedSize || "",
    }));

    const reminder = await CartReminder.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        userId: req.user?.id || "",
        name: name || req.user?.name || "",
        items: snapshot,
        total: Number(total) || 0,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    const canRemind =
      !reminder.remindedAt ||
      Date.now() - new Date(reminder.remindedAt).getTime() > REMINDER_COOLDOWN_MS;

    if (canRemind) {
      await sendAbandonedCartEmail({
        to: normalizedEmail,
        name: reminder.name,
        items: snapshot,
        total: reminder.total,
      });
      reminder.remindedAt = new Date();
      await reminder.save();
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Cart reminder error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
