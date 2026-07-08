import express from "express";
import Order from "../models/Order.js";
import { auth, adminOnly, optionalAuth } from "../middleware/auth.js";
import { validateAndPriceCart, OrderValidationError } from "../utils/orderPricing.js";
import { sendOrderConfirmationEmail } from "../utils/mail.js";
import CartReminder from "../models/CartReminder.js";

const router = express.Router();

router.post("/", optionalAuth, async (req, res) => {
  try {
    const {
      items,
      address,
      paymentMethod,
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId,
      userPhone,
      userName,
      userEmail,
      bundleDiscount,
    } = req.body;

    if (!address?.trim()) {
      return res.status(400).json({ msg: "Delivery address is required" });
    }

    const isGuest = !req.user;
    const resolvedName = req.user?.name || userName?.trim();
    const resolvedEmail = req.user?.email || userEmail?.trim().toLowerCase();
    const resolvedPhone = userPhone?.trim();

    if (isGuest) {
      if (!resolvedName || !resolvedEmail || !resolvedPhone) {
        return res.status(400).json({
          msg: "Name, email, and phone are required for guest checkout",
        });
      }
      if (!/\S+@\S+\.\S+/.test(resolvedEmail)) {
        return res.status(400).json({ msg: "Valid email is required" });
      }
    } else if (!resolvedPhone) {
      return res.status(400).json({ msg: "Phone number is required" });
    }

    const pricing = await validateAndPriceCart(items, { bundleDiscount });

    const order = await Order.create({
      userId: req.user?.id || "",
      userName: resolvedName,
      userEmail: resolvedEmail,
      userPhone: resolvedPhone,
      items: pricing.items,
      total: pricing.grandTotal,
      address,
      paymentMethod,
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId,
    });

    if (resolvedEmail) {
      try {
        await sendOrderConfirmationEmail({
          to: resolvedEmail,
          name: resolvedName,
          order,
        });
        await CartReminder.deleteOne({ email: resolvedEmail });
      } catch (emailErr) {
        console.error("Order confirmation email error:", emailErr);
      }
    }

    res.json(order);
  } catch (err) {
    if (err instanceof OrderValidationError) {
      return res.status(400).json({ msg: err.message });
    }
    console.error("Create order error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/my", auth, async (req, res) => {
  const email = req.user.email?.toLowerCase().trim();
  const orders = await Order.find({
    $or: [{ userId: req.user.id }, { userEmail: email }],
  }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/", auth, adminOnly, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.put("/:id/status", auth, adminOnly, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(order);
});

export default router;
