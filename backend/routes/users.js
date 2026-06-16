import express from "express";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put("/me", auth, async (req, res) => {
  try {
    const { name, phone, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(profileImage !== undefined && { profileImage }),
      },
      { new: true, runValidators: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/me/addresses", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const address = req.body;
    if (address.isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    }
    if (user.addresses.length === 0) address.isDefault = true;

    user.addresses.push(address);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put("/me/addresses/:addressId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ msg: "Address not found" });

    Object.assign(addr, req.body);
    if (req.body.isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = a._id.toString() === req.params.addressId;
      });
    }
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/me/addresses/:addressId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ msg: "Address not found" });

    const wasDefault = addr.isDefault;
    addr.deleteOne();
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
