import express from "express";
import Product from "../models/Product.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      activity,
      activityOnly,
      color,
      size,
      featured,
      bestSeller,
      bodyOnly,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { activity: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.$or = [
        ...(query.$or || []),
        { category: { $regex: category, $options: "i" } },
        { name: { $regex: category, $options: "i" } },
      ];
    }

    // ✅ activity page filter
    if (activity) {
      query.activity = { $regex: activity, $options: "i" };
    }

    // ✅ clear all on activity page => only activity products
    if (activityOnly === "true") {
      query.activity = { $exists: true, $ne: "" };
    }
    // ✅ shop/body page => only body/category products
// if (bodyOnly === "true") {
//   query.category = { $exists: true, $ne: "" };

//   query.$and = [
//     ...(query.$and || []),
//     {
//       $or: [
//         { activity: { $exists: false } },
//         { activity: "" },
//         { activity: null },
//       ],
//     },
//   ];
// }
if (bodyOnly === "true") {
  query.category = { $exists: true, $ne: "" };
}

    if (color) {
      query.colors = { $regex: color, $options: "i" };
    }

    if (size) {
      query.sizes = { $regex: size, $options: "i" };
    }

    if (featured === "true") query.isFeatured = true;
    if (bestSeller === "true") query.isBestSeller = true;

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    console.error("Product fetch error:", err);
    res.status(500).json({ msg: err.message });
  }
});

// GET categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories.filter(Boolean));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET single product by slug
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// CREATE product
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    let baseSlug =
      req.body.slug ||
      req.body.name
        ?.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    let slug = baseSlug;
    let count = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const product = await Product.create({
      ...req.body,
      slug,
      price: Number(req.body.price),
      discountPrice: Number(req.body.discountPrice),
      stock: Number(req.body.stock || 10),
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Product create error:", err);
    res.status(500).json({ msg: err.message });
  }
});


// UPDATE product
// router.put("/:id", auth, adminOnly, async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       returnDocument: "after",
//     });

//     if (!product) {
//       return res.status(404).json({ msg: "Product not found" });
//     }

//     res.json(product);
//   } catch (err) {
//     console.error("Product update error:", err);
//     res.status(500).json({ msg: err.message });
//   }
// });
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    // 🔥 REMOVE empty fields so they don't overwrite DB
    const cleanBody = Object.fromEntries(
      Object.entries(req.body).filter(([_, v]) => v !== "")
    );

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: cleanBody },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Product update error:", err);
    res.status(500).json({ msg: err.message });
  }
});

// DELETE product
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;