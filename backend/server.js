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

// dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running on port", process.env.PORT || 5000)
    );
  })
  .catch((err) => console.log("Mongo Error:", err.message));