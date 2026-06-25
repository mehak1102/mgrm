import express from "express";
import WarrantyClaim from "../models/WarrantyClaim.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { orderId, product, issue, imageUrl, description } = req.body;

    if (!orderId || !product || !issue || !description) {
      return res.status(400).json({
        msg: "Order ID, product, issue, and description are required",
      });
    }

    const claim = await WarrantyClaim.create({
      orderId,
      product,
      issue,
      imageUrl: imageUrl || "",
      description,
    });

    res.status(201).json({ msg: "Warranty claim submitted successfully", claim });
  } catch (err) {
    console.error("Warranty claim create error:", err);
    res.status(500).json({ msg: err.message });
  }
});

router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const { search = "", status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { product: { $regex: search, $options: "i" } },
        { issue: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      WarrantyClaim.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      WarrantyClaim.countDocuments(query),
    ]);

    res.json({ claims: items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.patch("/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }
    const claim = await WarrantyClaim.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );
    if (!claim) return res.status(404).json({ msg: "Not found" });
    res.json(claim);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await WarrantyClaim.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/export/csv", auth, adminOnly, async (req, res) => {
  try {
    const items = await WarrantyClaim.find().sort({ createdAt: -1 });
    const header = "Order ID,Product,Issue,Description,Status,Image URL,Created At\n";
    const rows = items
      .map((c) =>
        [
          `"${c.orderId}"`,
          `"${c.product}"`,
          `"${c.issue}"`,
          `"${c.description.replace(/"/g, '""')}"`,
          c.status,
          `"${c.imageUrl}"`,
          c.createdAt.toISOString(),
        ].join(",")
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=warranty-claims.csv");
    res.send(header + rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
