import API from "../api";

let cachedIndex = null;
let inflight = null;
let cachedAt = 0;
const TTL_MS = 5 * 60 * 1000;

/**
 * Lightweight catalog for dynamic search suggestions (every product).
 * @returns {Promise<Array<{ name: string, category: string, activity: string, slug: string }>>}
 */
export async function fetchSuggestIndex({ force = false } = {}) {
  const now = Date.now();
  if (!force && cachedIndex && now - cachedAt < TTL_MS) {
    return cachedIndex;
  }
  if (!force && inflight) return inflight;

  inflight = API.get("/products/suggest-index")
    .then((res) => {
      const products = Array.isArray(res.data?.products) ? res.data.products : [];
      cachedIndex = products;
      cachedAt = Date.now();
      return products;
    })
    .catch((err) => {
      // Fall back to full product list if suggest-index is unavailable
      return API.get("/products")
        .then((res) => {
          const list = Array.isArray(res.data?.products) ? res.data.products : [];
          const products = list.map((p) => ({
            name: p.name || "",
            category: p.category || "",
            activity: p.activity || "",
            slug: p.slug || "",
          }));
          cachedIndex = products;
          cachedAt = Date.now();
          return products;
        })
        .catch(() => {
          if (cachedIndex) return cachedIndex;
          throw err;
        });
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function getCachedSuggestIndex() {
  return cachedIndex || [];
}

export function clearSuggestIndexCache() {
  cachedIndex = null;
  cachedAt = 0;
  inflight = null;
}
