import express from "express";
import SizeCustomizationRequest from "../models/SizeCustomizationRequest.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      productName,
      bodyPart,
      measurement,
      measurementUnit,
      preferredSize,
      message,
    } = req.body;

    if (!name?.trim() || !preferredSize?.trim() || !message?.trim()) {
      return res.status(400).json({
        msg: "Name, preferred size, and your request details are required",
      });
    }

    const request = await SizeCustomizationRequest.create({
      name: name.trim(),
      email: email?.trim() || "",
      phone: phone?.trim() || "",
      productName: productName?.trim() || "",
      bodyPart: bodyPart?.trim() || "",
      measurement: measurement?.trim() || "",
      measurementUnit: measurementUnit?.trim() || "cm",
      preferredSize: preferredSize.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      msg: "Size customization request submitted. Our team will review it shortly.",
      request,
    });
  } catch (err) {
    console.error("Size customization create error:", err);
    res.status(500).json({ msg: err.message });
  }
});

router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const { search = "", status, read, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (read === "true") query.isRead = true;
    if (read === "false") query.isRead = false;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
        { bodyPart: { $regex: search, $options: "i" } },
        { measurement: { $regex: search, $options: "i" } },
        { preferredSize: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      SizeCustomizationRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      SizeCustomizationRequest.countDocuments(query),
    ]);

    res.json({
      requests: items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.patch("/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const { status, adminNotes, isRead } = req.body;
    const update = {};

    if (status) update.status = status;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;
    if (isRead !== undefined) update.isRead = isRead;
    if (status && status !== "Pending") update.isRead = true;

    const item = await SizeCustomizationRequest.findByIdAndUpdate(
      req.params.id,
      update,
      { returnDocument: "after" }
    );

    if (!item) return res.status(404).json({ msg: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await SizeCustomizationRequest.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/export/csv", auth, adminOnly, async (req, res) => {
  try {
    const items = await SizeCustomizationRequest.find().sort({ createdAt: -1 });
    const header =
      "Name,Email,Phone,Product,Body Part,Measurement,Unit,Preferred Size,Message,Status,Admin Notes,Read,Created At\n";
    const rows = items
      .map((item) =>
        [
          `"${item.name}"`,
          `"${item.email}"`,
          `"${item.phone}"`,
          `"${item.productName}"`,
          `"${item.bodyPart}"`,
          `"${item.measurement}"`,
          item.measurementUnit,
          `"${item.preferredSize}"`,
          `"${item.message.replace(/"/g, '""')}"`,
          item.status,
          `"${(item.adminNotes || "").replace(/"/g, '""')}"`,
          item.isRead,
          item.createdAt.toISOString(),
        ].join(",")
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=size-customization-requests.csv"
    );
    res.send(header + rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
