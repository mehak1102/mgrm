import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.cart);
});

router.post("/", auth, async (req, res) => {
  const { productId, qty } = req.body;

  const user = await User.findById(req.user.id);

  const existing = user.cart.find((c) => c.productId === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    user.cart.push({ productId, qty });
  }

  await user.save();
  res.json(user.cart);
});

export default router;