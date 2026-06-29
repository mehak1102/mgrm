import express from "express";
import {
  fetchInstagramImage,
  getInstagramProfile,
  isAllowedInstagramImageUrl,
  toProxiedImageUrl,
} from "../services/instagramService.js";
import { FALLBACK_INSTAGRAM } from "../data/instagramFallback.js";

const router = express.Router();

router.get("/profile", async (req, res) => {
  try {
    const profile = await getInstagramProfile();
    res.json(profile);
  } catch (err) {
    console.error("GET /api/instagram/profile error:", err.message);
    res.json({
      ...withProxiedFallback(FALLBACK_INSTAGRAM),
      fallback: true,
    });
  }
});

function withProxiedFallback(profile) {
  return {
    ...profile,
    avatar: toProxiedImageUrl(profile.avatar),
    posts: (profile.posts || []).map((post) => ({
      ...post,
      image: post.image?.startsWith("http")
        ? toProxiedImageUrl(post.image)
        : post.image,
    })),
  };
}

router.get("/image", async (req, res) => {
  const url = req.query.url;
  if (!isAllowedInstagramImageUrl(url)) {
    return res.status(400).json({ msg: "Invalid image url" });
  }

  try {
    const { contentType, buffer } = await fetchInstagramImage(url);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    res.send(buffer);
  } catch (err) {
    console.error("GET /api/instagram/image error:", err.message);
    res.status(502).json({ msg: "Failed to load Instagram image" });
  }
});

export default router;
