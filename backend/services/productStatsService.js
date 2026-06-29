import Product from "../models/Product.js";
import { buildCategoryCounts } from "../utils/categoryProductMatch.js";

let statsCache = null;
let statsCacheAt = 0;
const STATS_CACHE_TTL_MS = 5 * 60 * 1000;

export async function getProductStats() {
  const now = Date.now();
  if (statsCache && now - statsCacheAt < STATS_CACHE_TTL_MS) {
    return statsCache;
  }

  const [total, bodyTotal, activityTotal, products] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ category: { $exists: true, $ne: "" } }),
    Product.countDocuments({ activity: { $exists: true, $ne: "" } }),
    Product.find({}).select("category name activity").lean(),
  ]);

  const payload = {
    total,
    bodyTotal,
    activityTotal,
    categoryCounts: buildCategoryCounts(products),
  };

  statsCache = payload;
  statsCacheAt = now;
  return payload;
}

export function invalidateProductStatsCache() {
  statsCache = null;
  statsCacheAt = 0;
}

export async function warmupProductStats() {
  try {
    await getProductStats();
    console.log("Product stats cache warmed");
  } catch (err) {
    console.warn("Product stats warmup failed:", err.message);
  }
}
