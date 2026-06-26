function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Mirrors GET /products?category=…&bodyOnly=true matching rules. */
export function productMatchesCategory(product, categoryQuery) {
  if (!categoryQuery || !product?.category?.trim()) return false;

  try {
    const re = new RegExp(escapeRegex(categoryQuery), "i");
    return re.test(product.category) || re.test(product.name || "");
  } catch {
    return false;
  }
}

export function productMatchesActivity(product, activityName) {
  if (!activityName || !product?.activity?.trim()) return false;

  try {
    const re = new RegExp(escapeRegex(activityName), "i");
    return re.test(product.activity);
  } catch {
    return false;
  }
}
