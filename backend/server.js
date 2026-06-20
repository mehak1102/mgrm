import dotenv from "dotenv";
dotenv.config();


import express from "express";
import mongoose from "mongoose";
// import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import uploadRoutes from "./routes/upload.js";
import supportRoutes from "./routes/support.js";
import paymentRoutes from "./routes/payment.js";
import recommendationRoutes from "./routes/recommendation.js";
import reviewRoutes from "./routes/reviews.js";
import recoveryStoryRoutes from "./routes/recoveryStories.js";
import userRoutes from "./routes/users.js";
import careerRoutes from "./routes/careers.js";

// dotenv.config();
console.log("Razorpay loaded:", !!process.env.RAZORPAY_KEY_ID);
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("Razorpay env missing");
}

process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/recovery-stories", recoveryStoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/careers", careerRoutes);

async function bootstrap() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo Connected");

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log("Server running on port", port);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

bootstrap();