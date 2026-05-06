import express from "express";
import Order from "../models/Order.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { items, total, address } = req.body;

  const order = await Order.create({
    userId: req.user.id,
    userName: req.user.name,
    userEmail: req.user.email,
    items,
    total,
    address,
  });

  res.json(order);
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