import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendPasswordResetEmail } from "../utils/mail.js";
import { isAdminEmail, syncUserRole } from "../utils/admin.js";
import { linkGuestOrdersToUser } from "../utils/linkGuestOrders.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const AUTH_COOKIE_NAMES = ["token", "accessToken", "refreshToken", "auth"];
const SESSION_TTL = process.env.JWT_EXPIRES_IN || "72h";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

function clearAuthCookies(res) {
  AUTH_COOKIE_NAMES.forEach((name) => {
    res.clearCookie(name, cookieOptions);
  });
}

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: SESSION_TTL }
  );
}

router.post("/register", async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, email, and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: isAdminEmail(email) ? "admin" : "user",
    });

    await linkGuestOrdersToUser(user);

    res.json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    await syncUserRole(user);
    await linkGuestOrdersToUser(user);

    res.json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const genericMsg =
      "If an account with that email exists, a reset link has been sent.";

    const user = await User.findOne({ email });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = hashResetToken(rawToken);
      user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await user.save();

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const resetUrl = `${clientUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;
      try {
        await sendPasswordResetEmail({ to: email, name: user.name, resetUrl });
      } catch (emailErr) {
        console.error("Forgot password email error:", emailErr);
      }
    }

    res.json({ msg: genericMsg });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({ msg: "Email, token, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (
      !user ||
      !user.resetPasswordToken ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      return res.status(400).json({ msg: "Invalid or expired reset link" });
    }

    if (user.resetPasswordToken !== hashResetToken(token)) {
      return res.status(400).json({ msg: "Invalid or expired reset link" });
    }

    user.password = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, {
      password: user.password,
      $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
    });

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ msg: "User not found" });

  await syncUserRole(user);

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

router.post("/logout", (_req, res) => {
  clearAuthCookies(res);
  res.json({ ok: true });
});

export default router;