import API from "../api";

const STORAGE_KEY = "mgrm_reco_behavior";
const LIMIT = 12;

const normalize = (value = "") => value.toString().trim().toLowerCase();

const uniq = (items = []) => [...new Set(items.filter(Boolean))];

const pushRecent = (list = [], value) =>
  uniq([normalize(value), ...list.map(normalize)]).slice(0, LIMIT);

export function getBehavior() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveBehavior(partial = {}) {
  const current = getBehavior();
  const next = {
    recentSearches: partial.recentSearches || current.recentSearches || [],
    viewedProductIds: partial.viewedProductIds || current.viewedProductIds || [],
    clickedCategories: partial.clickedCategories || current.clickedCategories || [],
    cartProductIds: partial.cartProductIds || current.cartProductIds || [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function syncBehaviorToBackend(behavior) {
  try {
    await API.post("/recommendations/behavior", behavior);
  } catch {
    // Keep experience resilient even if sync fails.
  }
}

export function trackSearch(query) {
  const current = getBehavior();
  const next = saveBehavior({
    ...current,
    recentSearches: pushRecent(current.recentSearches || [], query),
  });
  void syncBehaviorToBackend(next);
  return next;
}

export function trackViewedProduct(productId) {
  const current = getBehavior();
  const next = saveBehavior({
    ...current,
    viewedProductIds: pushRecent(current.viewedProductIds || [], productId),
  });
  void syncBehaviorToBackend(next);
  return next;
}

export function trackCategoryClick(category) {
  const current = getBehavior();
  const next = saveBehavior({
    ...current,
    clickedCategories: pushRecent(current.clickedCategories || [], category),
  });
  void syncBehaviorToBackend(next);
  return next;
}

export function trackCartProducts(productIds = []) {
  const normalizedIds = uniq(productIds.map((id) => String(id)));
  const current = getBehavior();
  const next = saveBehavior({
    ...current,
    cartProductIds: normalizedIds.slice(0, LIMIT),
  });
  void syncBehaviorToBackend(next);
  return next;
}
