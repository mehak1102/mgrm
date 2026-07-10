/** Visual assets & mockup slots for the modern /dashboard page */

import { bodyCategories } from "../../data/siteData";

export const DASHBOARD_ASSETS = {
  heroBrace: "/dashboard/hero-knee-brace.png",
  recoveryRunner: "/dashboard/recovery-runner.png",
  recoveryCardArt: "/dashboard/recovery-card-art.png",
  logoMark: "/products/logo-mark.png",
  drAarti: "/dashboard/dr-aarti-sharma.png",
  drRahul: "/dashboard/dr-rahul-verma.png",
  popularKnee: "/dashboard/popular-knee-brace.png",
  popularLumbar: "/dashboard/popular-lumbar-belt.png",
  popularAnkle: "/dashboard/popular-ankle-support.png",
};

const CATALOG_BASE = "/dashboard/catalog";

/** Studio product shots — transparent PNGs for hero catalog rotator */
export const CATALOG_SHOWCASE = {
  Abdominal: {
    image: `${CATALOG_BASE}/catalog-abdominal.png`,
    focus: "50% center",
  },
  "Ankle And Foot": {
    image: `${CATALOG_BASE}/catalog-ankle-foot.png`,
    focus: "50% center",
  },
  Arm: {
    image: `${CATALOG_BASE}/catalog-arm.png`,
    focus: "50% center",
  },
  Back: {
    image: `${CATALOG_BASE}/catalog-back.png`,
    focus: "50% center",
  },
  Chest: {
    image: `${CATALOG_BASE}/catalog-chest.png`,
    focus: "50% center",
  },
  Elbow: {
    image: `${CATALOG_BASE}/catalog-elbow.png`,
    focus: "50% center",
  },
  Finger: {
    image: `${CATALOG_BASE}/catalog-finger.png`,
    focus: "50% center",
  },
  Knee: {
    image: `${CATALOG_BASE}/catalog-knee.png`,
    focus: "50% center",
  },
  Leg: {
    image: `${CATALOG_BASE}/catalog-leg.png`,
    focus: "50% center",
  },
  Neck: {
    image: `${CATALOG_BASE}/catalog-neck.png`,
    focus: "50% center",
  },
  "Shin And Calf": {
    image: `${CATALOG_BASE}/catalog-shin-calf.png`,
    focus: "50% center",
  },
  Shoulder: {
    image: `${CATALOG_BASE}/catalog-shoulder.png`,
    focus: "50% center",
  },
  Thigh: {
    image: `${CATALOG_BASE}/catalog-leg.png`,
    focus: "50% center",
  },
  Wrist: {
    image: `${CATALOG_BASE}/catalog-wrist.png`,
    focus: "50% center",
  },
  "Orthopedic Aids": {
    image: `${CATALOG_BASE}/catalog-neck.png`,
    focus: "50% center",
  },
};

export function getCatalogShowcase(query) {
  return CATALOG_SHOWCASE[query] || null;
}

/** Categories with curated rotator slides — order follows shop-by-body */
export function buildCatalogRotatorSlides(categoriesWithCounts = []) {
  const byQuery = new Map(categoriesWithCounts.map((c) => [c.query, c]));

  return bodyCategories
    .map((cat) => {
      const stats = byQuery.get(cat.query);
      const showcase = getCatalogShowcase(cat.query);
      if (!showcase?.image) return null;

      return {
        ...cat,
        name: cat.name.replace(/ And /g, " & "),
        query: cat.query,
        count: stats?.count ?? 0,
        color: cat.color,
        productImage: showcase.image,
        imageFocus: showcase.focus,
        productName: cat.name,
        isShowcase: true,
      };
    })
    .filter(Boolean);
}

export const PHYSIO_DOCTORS = [
  {
    name: "Dr. Aarti Sharma",
    title: "Sports Physiotherapist",
    rating: 5,
    image: DASHBOARD_ASSETS.drAarti,
  },
  {
    name: "Dr. Rahul Verma",
    title: "Orthopedic Specialist",
    rating: 5,
    image: DASHBOARD_ASSETS.drRahul,
  },
];

/** Focus point per category so body-part art is centered in the circle */
const CATEGORY_IMAGE_FOCUS = {
  Abdominal: "50% 42%",
  "Ankle And Foot": "50% 72%",
  Arm: "50% 48%",
  Back: "50% 38%",
  Chest: "50% 40%",
  Elbow: "50% 50%",
  Finger: "50% 55%",
  Knee: "50% 58%",
  Leg: "50% 62%",
  Neck: "50% 28%",
  "Shin And Calf": "50% 65%",
  Shoulder: "50% 32%",
  Thigh: "50% 55%",
  Wrist: "50% 52%",
  "Orthopedic Aids": "50% 36%",
};

/** All 15 shop-by-body categories with matching medical body-part art */
export const DISPLAY_CATEGORIES = bodyCategories.map((cat) => ({
  name: cat.name.replace(/ And /g, " & "),
  query: cat.query,
  color: cat.color,
  image: cat.image,
  imageFocus: CATEGORY_IMAGE_FOCUS[cat.query] || "center center",
}));

/** Mockup product slots — showcase images always; slug/price from API when available */
export const POPULAR_PRODUCT_SLOTS = [
  {
    key: "knee",
    name: "Knee Support Brace",
    showcaseImage: DASHBOARD_ASSETS.popularKnee,
    pedestal: "purple",
    imageFocus: "center center",
    categoryQuery: "Knee",
    nameMatch: /knee/i,
    rating: 4.5,
    fallbackPrice: 1299,
  },
  {
    key: "lumbar",
    name: "Lumbar Support Belt",
    showcaseImage: DASHBOARD_ASSETS.popularLumbar,
    pedestal: "pink",
    imageFocus: "center 38%",
    categoryQuery: "Back",
    nameMatch: /lumbar|back|belt/i,
    rating: 4.7,
    fallbackPrice: 1599,
  },
  {
    key: "ankle",
    name: "Ankle Support",
    showcaseImage: DASHBOARD_ASSETS.popularAnkle,
    pedestal: "blue",
    imageFocus: "center center",
    categoryQuery: "Ankle And Foot",
    nameMatch: /ankle/i,
    rating: 4.4,
    fallbackPrice: 899,
  },
];

export function resolvePopularProducts(apiProducts = [], recommended = []) {
  const pool = [...recommended, ...apiProducts];

  return POPULAR_PRODUCT_SLOTS.map((slot) => {
    const match =
      pool.find((p) => p?.slug && slot.nameMatch.test(p.name || "")) ||
      pool.find(
        (p) =>
          p?.images?.[0] &&
          (p.category === slot.categoryQuery || p.bodyCategory === slot.categoryQuery)
      );

    return {
      ...slot,
      _id: match?._id,
      slug: match?.slug ?? null,
      name: slot.name,
      image: slot.showcaseImage,
      price: slot.fallbackPrice,
      rating: slot.rating,
    };
  });
}
