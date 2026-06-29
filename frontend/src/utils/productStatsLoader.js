import API from "../api";
import { bodyCategories } from "../data/siteData";
import { productMatchesCategory } from "./categoryProductMatch";
import {
  loadCachedProductStats,
  saveCachedProductStats,
} from "./productStatsCache";

/** Dummy per-category counts for first-time visitors (replaced after API loads). */
export const FALLBACK_CATEGORY_COUNTS = {
  Abdominal: 4,
  "Ankle And Foot": 7,
  Arm: 3,
  Back: 8,
  Chest: 2,
  Elbow: 5,
  Finger: 3,
  Knee: 9,
  Leg: 4,
  Neck: 6,
  "Shin And Calf": 3,
  Shoulder: 5,
  Thigh: 4,
  Wrist: 4,
  "Orthopedic Aids": 5,
};

/** Shown on first paint for brand-new devices while the API responds. */
export const FALLBACK_PRODUCT_STATS = {
  total: 68,
  bodyTotal: 68,
  activityTotal: 40,
  categoryCounts: { ...FALLBACK_CATEGORY_COUNTS },
};

export function normalizeProductStats(data) {
  if (!data) {
    return { ...FALLBACK_PRODUCT_STATS, categoryCounts: { ...FALLBACK_CATEGORY_COUNTS } };
  }

  let categoryCounts = data.categoryCounts;

  if (!categoryCounts && Array.isArray(data.products)) {
    categoryCounts = {};
    for (const cat of bodyCategories) {
      categoryCounts[cat.query] = data.products.filter((p) =>
        productMatchesCategory(p, cat.query)
      ).length;
    }
  }

  return {
    total: data.total ?? FALLBACK_PRODUCT_STATS.total,
    bodyTotal: data.bodyTotal ?? FALLBACK_PRODUCT_STATS.bodyTotal,
    activityTotal: data.activityTotal ?? FALLBACK_PRODUCT_STATS.activityTotal,
    categoryCounts: categoryCounts ?? { ...FALLBACK_CATEGORY_COUNTS },
  };
}

let inflight = null;

export function getBootstrapProductStats() {
  if (typeof window !== "undefined" && window.__MGRM_PRODUCT_STATS__) {
    return normalizeProductStats(window.__MGRM_PRODUCT_STATS__);
  }

  const cached = loadCachedProductStats();
  if (cached) return normalizeProductStats(cached.data);

  return {
    ...FALLBACK_PRODUCT_STATS,
    categoryCounts: { ...FALLBACK_CATEGORY_COUNTS },
  };
}

export function fetchProductStats() {
  const cached = loadCachedProductStats();
  if (cached) {
    return Promise.resolve(normalizeProductStats(cached.data));
  }

  if (!inflight) {
    inflight = API.get("/products/stats")
      .then((res) => {
        const next = normalizeProductStats(res.data);
        saveCachedProductStats(next);
        return next;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
}

export function primeProductStatsFetch() {
  if (!loadCachedProductStats()) {
    fetchProductStats();
  }
}
