import express from "express";
import { optionalAuth } from "../middleware/auth.js";
import {
  getHomeRecommendations,
  getProductRecommendations,
  saveUserBehavior,
} from "../services/recommendationService.js";

const router = express.Router();

const parseList = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

router.get("/home", optionalAuth, async (req, res) => {
  try {
    const guestBehavior = {
      recentSearches: parseList(req.query.searches),
      viewedProductIds: parseList(req.query.viewed),
      clickedCategories: parseList(req.query.categories),
      cartProductIds: parseList(req.query.cart),
    };

    const limit = Number(req.query.limit || 12);
    const payload = await getHomeRecommendations({
      userId: req.user?.id,
      guestBehavior,
      limit,
    });

    res.json(payload);
  } catch (err) {
    console.error("Home recommendation error:", err);
    res.status(500).json({ msg: "Failed to load recommendations" });
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 8);
    const payload = await getProductRecommendations({
      productId: req.params.id,
      limit,
    });
    res.json(payload);
  } catch (err) {
    console.error("Product recommendation error:", err);
    res.status(500).json({ msg: "Failed to load recommendations" });
  }
});

router.post("/behavior", optionalAuth, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.json({ ok: true, persisted: false });
    }

    await saveUserBehavior(req.user.id, req.body || {});
    res.json({ ok: true, persisted: true });
  } catch (err) {
    console.error("Behavior save error:", err);
    res.status(500).json({ msg: "Failed to save behavior" });
  }
});

export default router;
