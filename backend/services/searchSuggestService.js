let indexCache = null;
let indexCacheAt = 0;
const INDEX_CACHE_TTL_MS = 5 * 60 * 1000;

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scoreSuggestion(text, queryLower) {
  const lower = text.toLowerCase();
  if (lower === queryLower) return 100;
  if (lower.startsWith(queryLower)) return 80;
  const idx = lower.indexOf(` ${queryLower}`);
  if (idx >= 0) return 55;
  if (lower.includes(queryLower)) return 40;
  return 10;
}

/**
 * From a product title, derive Amazon-style completions that start with / contain the query.
 * e.g. "Soft Knee Brace" + "knee" → "Knee", "Knee Brace"
 */
function collectPhrasesFromName(name, queryLower) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return [];

  const phrases = [];
  const seen = new Set();

  const add = (phrase) => {
    const label = phrase.trim();
    if (!label) return;
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    if (!key.includes(queryLower)) return;
    seen.add(key);
    phrases.push(label);
  };

  add(words.join(" "));

  for (let i = 0; i < words.length; i++) {
    const word = words[i].toLowerCase();
    const startsHere =
      word.startsWith(queryLower) ||
      words
        .slice(i)
        .join(" ")
        .toLowerCase()
        .startsWith(queryLower);

    if (!startsHere && !word.includes(queryLower)) continue;

    for (let end = i + 1; end <= words.length; end++) {
      add(words.slice(i, end).join(" "));
    }
  }

  return phrases;
}

/**
 * Build ranked suggestions from a product catalog index (fully dynamic).
 */
export function buildSuggestionsFromIndex(index = [], rawQuery, options = {}) {
  const limit = Math.min(Math.max(Number(options.limit) || 8, 1), 12);
  const query = String(rawQuery || "").trim();
  if (query.length < 1 || !index.length) return [];

  const queryLower = query.toLowerCase();
  const seen = new Set();
  const ranked = [];

  const push = (text, type, boost = 0, meta = {}) => {
    const label = String(text || "").trim();
    if (!label) return;
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    if (!key.includes(queryLower)) return;
    seen.add(key);
    ranked.push({
      text: label,
      type,
      score: scoreSuggestion(label, queryLower) + boost,
      ...(meta.slug ? { slug: meta.slug } : {}),
    });
  };

  for (const item of index) {
    if (item.category) {
      const cat = String(item.category).trim();
      if (cat.toLowerCase().includes(queryLower)) {
        push(cat, "category", 28);
      }
    }

    if (item.activity) {
      const act = String(item.activity).trim();
      if (act.toLowerCase().includes(queryLower)) {
        push(act, "activity", 8);
      }
    }

    if (item.name) {
      const name = String(item.name).trim();
      const nameLower = name.toLowerCase();
      const slugMeta = item.slug ? { slug: item.slug } : {};

      if (nameLower.includes(queryLower)) {
        push(
          name,
          "product",
          nameLower.startsWith(queryLower) ? 22 : 14,
          slugMeta
        );
      }

      for (const phrase of collectPhrasesFromName(name, queryLower)) {
        const isFullName = phrase.toLowerCase() === nameLower;
        if (isFullName) continue;
        push(phrase, "query", phrase.toLowerCase().startsWith(queryLower) ? 18 : 8);
      }
    }
  }

  ranked.sort((a, b) => b.score - a.score || a.text.localeCompare(b.text));
  return ranked.slice(0, limit).map(({ text, type, slug }) =>
    slug ? { text, type, slug } : { text, type }
  );
}

export async function getSuggestIndex(Product) {
  const now = Date.now();
  if (indexCache && now - indexCacheAt < INDEX_CACHE_TTL_MS) {
    return indexCache;
  }

  const products = await Product.find({})
    .select("name category activity slug")
    .lean();

  indexCache = products.map((p) => ({
    name: p.name || "",
    category: p.category || "",
    activity: p.activity || "",
    slug: p.slug || "",
  }));
  indexCacheAt = now;
  return indexCache;
}

export function invalidateSuggestCache() {
  indexCache = null;
  indexCacheAt = 0;
}

/**
 * Dynamic search suggestions for every product in the catalog.
 */
export async function getSearchSuggestions(Product, rawQuery, options = {}) {
  const index = await getSuggestIndex(Product);
  return buildSuggestionsFromIndex(index, rawQuery, options);
}

/** @deprecated kept for callers that escape manually */
export { escapeRegex };
