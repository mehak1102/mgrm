const CACHE_KEY = "mgrm:product-stats:v1";
const CACHE_MAX_AGE_MS = 10 * 60 * 1000;

export function loadCachedProductStats() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.data || typeof parsed.at !== "number") return null;

    return {
      data: parsed.data,
      isStale: Date.now() - parsed.at > CACHE_MAX_AGE_MS,
    };
  } catch {
    return null;
  }
}

export function saveCachedProductStats(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, at: Date.now() })
    );
  } catch {
    // Ignore quota / private-mode errors.
  }
}

export function clearCachedProductStats() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // no-op
  }
}
