import express from "express";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { auth, adminOnly } from "../middleware/auth.js";
import { isAdminEmail } from "../utils/admin.js";

const router = express.Router();

function buildBreakdown(reviews) {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(Number(r.rating));
    if (breakdown[star] !== undefined) breakdown[star] += 1;
  });
  return breakdown;
}

function sortReviews(reviews, sort) {
  const list = [...reviews];
  if (sort === "highest") {
    return list.sort((a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt));
  }
  if (sort === "lowest") {
    return list.sort((a, b) => a.rating - b.rating || new Date(b.createdAt) - new Date(a.createdAt));
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function syncProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { productId: productId } },
    {
      $group: {
        _id: null,
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avg = stats[0]?.avg ? Number(stats[0].avg.toFixed(1)) : 4.6;
  await Product.findByIdAndUpdate(productId, { rating: avg });
  return { averageRating: avg, totalReviews: stats[0]?.count || 0 };
}

// GET reviews for a product
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const sort = req.query.sort || "latest";

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();

    const sorted = sortReviews(reviews, sort);
    const breakdown = buildBreakdown(reviews);
    const total = reviews.length;
    const averageRating =
      total > 0
        ? Number((reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1))
        : 0;

    const galleryImages = reviews.flatMap((r) => r.images || []).filter(Boolean);

    res.json({
      reviews: sorted,
      summary: {
        averageRating,
        totalReviews: total,
        breakdown,
        galleryImages,
      },
    });
  } catch (err) {
    console.error("Review fetch error:", err);
    res.status(500).json({ msg: err.message });
  }
});

// POST a review (authenticated)
router.post("/", auth, async (req, res) => {
  try {
    const { productId, rating, comment, images = [] } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ msg: "productId and rating are required" });
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const existing = await Review.findOne({ productId, userId: req.user.id });
    if (existing) {
      return res.status(400).json({ msg: "You have already reviewed this product" });
    }

    const verifiedOrder = await Order.findOne({
      userId: req.user.id,
      "items._id": String(productId),
      status: { $in: ["Delivered", "Shipped", "Packed", "Placed"] },
    }).lean();

    const review = await Review.create({
      productId,
      userId: req.user.id,
      userName: req.user.name || "Customer",
      rating: numericRating,
      comment: (comment || "").trim(),
      images: Array.isArray(images) ? images.slice(0, 6) : [],
      isVerifiedPurchase: Boolean(verifiedOrder),
    });

    const summary = await syncProductRating(productId);

    res.status(201).json({ review, summary });
  } catch (err) {
    console.error("Review create error:", err);
    res.status(500).json({ msg: err.message });
  }
});

// DELETE review (admin or owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    const isOwner = String(review.userId) === String(req.user.id);
    const isAdmin = isAdminEmail(req.user.email);
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    const productId = review.productId;
    await review.deleteOne();
    const summary = await syncProductRating(productId);

    res.json({ msg: "Review deleted", summary });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin: list all reviews
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate("productId", "name slug")
      .lean();
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
