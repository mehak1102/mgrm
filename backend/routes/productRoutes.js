import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// featured
router.get("/featured", async (req, res) => {
  const products = await Product.find({ isFeatured: true });
  res.json(products);
});

// best seller
router.get("/best", async (req, res) => {
  const products = await Product.find({ isBestSeller: true });
  res.json(products);
});

// categories
router.get("/categories", async (req, res) => {
  const categories = await Product.distinct("category");
  res.json(categories);
});

export default router;