import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { auth } from "../middleware/auth.js";
import { validateAndPriceCart, OrderValidationError } from "../utils/orderPricing.js";

const router = express.Router();

export const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Missing Razorpay credentials");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

router.post("/create-order", auth, async (req, res) => {
  try {
    const razorpay = getRazorpay();
    const { items } = req.body;

    const { grandTotal } = await validateAndPriceCart(items);

    const options = {
      amount: Math.round(grandTotal * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      total: grandTotal,
    });
  } catch (err) {
    if (err instanceof OrderValidationError) {
      return res.status(400).json({ msg: err.message });
    }
    console.error("Razorpay create order error:", err);
    res.status(500).json({ msg: err.message });
  }
});

router.post("/verify", async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ msg: "Razorpay is not configured" });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ msg: "Payment verification failed" });
    }

    res.json({
      success: true,
      msg: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;
