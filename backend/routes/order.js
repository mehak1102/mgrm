import express from "express";
import Order from "../models/Order.js";
import { auth, adminOnly } from "../middleware/auth.js";
import { validateAndPriceCart, OrderValidationError } from "../utils/orderPricing.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const {
      items,
      address,
      paymentMethod,
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId,
      userPhone,
    } = req.body;

    if (!address?.trim()) {
      return res.status(400).json({ msg: "Delivery address is required" });
    }

    const { items: validatedItems, grandTotal } = await validateAndPriceCart(items);

    const order = await Order.create({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone,
      items: validatedItems,
      total: grandTotal,
      address,
      paymentMethod,
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId,
    });

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
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
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
