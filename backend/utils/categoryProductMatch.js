const BODY_CATEGORY_QUERIES = [
  "Abdominal",
  "Ankle And Foot",
  "Arm",
  "Back",
  "Chest",
  "Elbow",
  "Finger",
  "Knee",
  "Leg",
  "Neck",
  "Shin And Calf",
  "Shoulder",
  "Thigh",
  "Wrist",
  "Orthopedic Aids",
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function productMatchesCategory(product, categoryQuery) {
  if (!categoryQuery || !product?.category?.trim()) return false;

  try {
    const re = new RegExp(escapeRegex(categoryQuery), "i");
    return re.test(product.category) || re.test(product.name || "");
  } catch {
    return false;
  }
}

export function buildCategoryCounts(products) {
  const counts = {};
  for (const query of BODY_CATEGORY_QUERIES) {
    counts[query] = products.filter((p) => productMatchesCategory(p, query)).length;
  }
  return counts;
}
