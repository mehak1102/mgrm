import Product from "../models/Product.js";
import Order from "../models/Order.js";
import UserBehavior from "../models/UserBehavior.js";

const MAX_BEHAVIOR_ITEMS = 12;
const STOP_WORDS = new Set([
  "the",
  "for",
  "and",
  "with",
  "from",
  "your",
  "you",
  "are",
  "into",
  "kit",
  "set",
  "support",
  "brace",
  "belt",
  "mgrm",
  "medicare",
]);
const BODY_PART_KEYWORDS = [
  "knee",
  "neck",
  "back",
  "shoulder",
  "ankle",
  "foot",
  "wrist",
  "elbow",
  "thigh",
  "leg",
  "calf",
  "arm",
  "chest",
  "abdominal",
  "finger",
  "cervical",
  "lumbar",
  "patella",
];

const RELATED_KEYWORD_MAP = {
  knee: ["patella", "compression", "sleeve", "rehab", "orthopedic"],
  neck: ["cervical", "traction", "pillow", "collar", "rehab"],
  back: ["lumbar", "posture", "spine", "support", "belt"],
  ankle: ["foot", "compression", "stability", "sprain"],
  shoulder: ["arm", "sling", "rehab", "mobility"],
  wrist: ["hand", "finger", "splint", "brace"],
};

const normalize = (value = "") => value.toString().trim().toLowerCase();

const safeArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const uniq = (items = []) => [...new Set(items.filter(Boolean))];

function tokenize(text = "") {
  return uniq(
    normalize(text)
      .split(/[^a-z0-9]+/i)
      .filter((token) => token.length >= 3 && !STOP_WORDS.has(token))
  );
}

function pushRecent(list = [], value) {
  const clean = normalize(value);
  if (!clean) return list;
  return uniq([clean, ...safeArray(list).map(normalize)]).slice(0, MAX_BEHAVIOR_ITEMS);
}

function deriveProductKeywords(product = {}) {
  return uniq([
    ...tokenize(product.name),
    ...tokenize(product.description),
    ...tokenize(product.category),
    ...tokenize(product.activity),
  ]);
}

function expandSignals(signals = {}) {
  const categories = safeArray(signals.categories).map(normalize);
  const keywords = safeArray(signals.keywords).map(normalize);
  const merged = uniq([...categories.flatMap(tokenize), ...keywords]);
  const bodyParts = merged.filter((item) => BODY_PART_KEYWORDS.includes(item));
  const relatedKeywords = uniq([
    ...bodyParts.flatMap((part) => RELATED_KEYWORD_MAP[part] || []),
  ]);

  return {
    ...signals,
    bodyParts,
    keywords: uniq([...keywords, ...relatedKeywords]),
    categories: uniq([...categories, ...bodyParts]),
  };
}

function diversifyRankedProducts(items = [], limit = 12, maxPerCategory = 2) {
  const selected = [];
  const seenIds = new Set();
  const categoryCount = new Map();

  for (const item of items) {
    const id = String(item._id);
    if (seenIds.has(id)) continue;
    const cat = normalize(item.category) || "uncategorized";
    const current = categoryCount.get(cat) || 0;
    if (current >= maxPerCategory) continue;

    selected.push(item);
    seenIds.add(id);
    categoryCount.set(cat, current + 1);
    if (selected.length >= limit) return selected;
  }

  for (const item of items) {
    const id = String(item._id);
    if (seenIds.has(id)) continue;
    selected.push(item);
    seenIds.add(id);
    if (selected.length >= limit) break;
  }

  return selected;
}

function productPoolSearchQuery(signals = {}) {
  const categories = safeArray(signals.categories).map(normalize);
  const keywords = safeArray(signals.keywords).map(normalize);
  const cartIds = safeArray(signals.cartProductIds);
  const viewedIds = safeArray(signals.viewedProductIds);

  const conditions = [];

  if (categories.length) {
    conditions.push({
      category: { $in: categories.map((item) => new RegExp(item, "i")) },
    });
  }

  if (keywords.length) {
    conditions.push({
      $or: [
        { name: { $in: keywords.map((item) => new RegExp(item, "i")) } },
        { description: { $in: keywords.map((item) => new RegExp(item, "i")) } },
        { category: { $in: keywords.map((item) => new RegExp(item, "i")) } },
      ],
    });
  }

  if (cartIds.length || viewedIds.length) {
    conditions.push({ _id: { $in: [...cartIds, ...viewedIds] } });
  }

  if (!conditions.length) return {};
  return { $or: conditions };
}

function scoreHomeProduct(product, signals) {
  const productKeywords = deriveProductKeywords(product);
  const category = normalize(product.category);
  const signalCategories = safeArray(signals.categories).map(normalize);
  const signalKeywords = safeArray(signals.keywords).map(normalize);
  const cartIds = safeArray(signals.cartProductIds).map(String);
  const viewedIds = safeArray(signals.viewedProductIds).map(String);
  const bodyParts = safeArray(signals.bodyParts).map(normalize);

  let score = 0;
  const reasons = [];

  if (signalCategories.includes(category)) {
    score += 45;
    reasons.push("category");
  }

  const matchedKeywords = productKeywords.filter((word) =>
    signalKeywords.includes(word)
  );
  if (matchedKeywords.length) {
    score += Math.min(35, matchedKeywords.length * 9);
    reasons.push("keyword");
  }

  if (bodyParts.length && productKeywords.some((word) => bodyParts.includes(word))) {
    score += 12;
    reasons.push("body-part");
  }

  if (cartIds.includes(String(product._id))) {
    score += 20;
    reasons.push("cart");
  }

  if (viewedIds.includes(String(product._id))) {
    score += 14;
    reasons.push("viewed");
  }

  score += Number(product.rating || 0) * 2;
  if (product.isBestSeller) score += 8;

  return { score, reasons };
}

function scoreDetailProduct(candidate, seedProduct, coViewedSet) {
  const seedKeywords = deriveProductKeywords(seedProduct);
  const candidateKeywords = deriveProductKeywords(candidate);
  const keywordMatches = candidateKeywords.filter((word) =>
    seedKeywords.includes(word)
  );
  const seedBodyParts = seedKeywords.filter((w) => BODY_PART_KEYWORDS.includes(w));
  const candidateBodyMatch = candidateKeywords.some((w) => seedBodyParts.includes(w));
  const complementaryMatch = seedBodyParts.some((part) =>
    candidateKeywords.some((word) => (RELATED_KEYWORD_MAP[part] || []).includes(word))
  );

  let score = 0;
  const reasons = [];

  if (normalize(candidate.category) === normalize(seedProduct.category)) {
    score += 55;
    reasons.push("same-category");
  }

  if (normalize(candidate.activity) && normalize(candidate.activity) === normalize(seedProduct.activity)) {
    score += 18;
    reasons.push("same-usage");
  }

  if (keywordMatches.length) {
    score += Math.min(30, keywordMatches.length * 8);
    reasons.push("tag-match");
  }

  if (candidateBodyMatch) {
    score += 20;
    reasons.push("related-body-part");
  }

  if (complementaryMatch) {
    score += 15;
    reasons.push("complementary");
  }

  if (coViewedSet.has(String(candidate._id))) {
    score += 20;
    reasons.push("viewed-together");
  }

  score += Number(candidate.rating || 0) * 2;
  if (candidate.isBestSeller) score += 6;

  return { score, reasons };
}

export async function saveUserBehavior(userId, payload = {}) {
  const existing = await UserBehavior.findOne({ userId });
  const current = existing || { recentSearches: [], viewedProductIds: [], clickedCategories: [], cartProductIds: [], keywords: [] };

  const recentSearches = safeArray(payload.recentSearches).reduce(
    (acc, text) => pushRecent(acc, text),
    safeArray(current.recentSearches)
  );
  const viewedProductIds = safeArray(payload.viewedProductIds).reduce(
    (acc, id) => pushRecent(acc, String(id)),
    safeArray(current.viewedProductIds)
  );
  const clickedCategories = safeArray(payload.clickedCategories).reduce(
    (acc, text) => pushRecent(acc, text),
    safeArray(current.clickedCategories)
  );
  const cartProductIds = safeArray(payload.cartProductIds).reduce(
    (acc, id) => pushRecent(acc, String(id)),
    safeArray(current.cartProductIds)
  );

  const keywords = uniq([
    ...safeArray(current.keywords).map(normalize),
    ...recentSearches.flatMap(tokenize),
    ...clickedCategories.flatMap(tokenize),
  ]).slice(0, MAX_BEHAVIOR_ITEMS);

  return UserBehavior.findOneAndUpdate(
    { userId },
    {
      userId,
      recentSearches,
      viewedProductIds,
      clickedCategories,
      cartProductIds,
      keywords,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function getHomeRecommendations({
  userId,
  guestBehavior = {},
  limit = 12,
}) {
  const persisted = userId ? await UserBehavior.findOne({ userId }).lean() : null;
  const purchaseOrders = userId
    ? await Order.find({ userId }, { items: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .limit(30)
        .lean()
    : [];

  const purchasedItems = purchaseOrders.flatMap((order) => safeArray(order.items));
  const purchasedProductIds = uniq(
    purchasedItems.map((item) => String(item?._id || "")).filter(Boolean)
  );
  const purchasedCategories = uniq(
    purchasedItems.map((item) => normalize(item?.category || "")).filter(Boolean)
  );
  const purchasedKeywords = uniq(
    purchasedItems.flatMap((item) =>
      tokenize(`${item?.name || ""} ${item?.category || ""} ${item?.description || ""}`)
    )
  );

  const mergedSignals = {
    searches: uniq([
      ...safeArray(persisted?.recentSearches),
      ...safeArray(guestBehavior.recentSearches),
    ]),
    categories: uniq([
      ...safeArray(persisted?.clickedCategories),
      ...safeArray(guestBehavior.clickedCategories),
    ]),
    viewedProductIds: uniq([
      ...safeArray(persisted?.viewedProductIds),
      ...safeArray(guestBehavior.viewedProductIds),
    ]),
    cartProductIds: uniq([
      ...safeArray(persisted?.cartProductIds),
      ...safeArray(guestBehavior.cartProductIds),
      ...purchasedProductIds,
    ]),
  };
  mergedSignals.keywords = uniq([
    ...safeArray(persisted?.keywords),
    ...mergedSignals.searches.flatMap(tokenize),
    ...mergedSignals.categories.flatMap(tokenize),
    ...purchasedKeywords,
  ]);
  mergedSignals.categories = uniq([
    ...mergedSignals.categories,
    ...purchasedCategories,
  ]);
  const expandedSignals = expandSignals(mergedSignals);

  const hasBehavior =
    expandedSignals.searches.length ||
    expandedSignals.categories.length ||
    expandedSignals.viewedProductIds.length ||
    expandedSignals.cartProductIds.length;

  if (!hasBehavior) {
    const fallback = await Product.find({})
      .sort({ isBestSeller: -1, rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    return { products: fallback, strategy: "trending-fallback" };
  }

  const query = productPoolSearchQuery(expandedSignals);
  const pool = await Product.find(query)
    .limit(120)
    .lean();

  const ranked = pool
    .map((item) => {
      const scored = scoreHomeProduct(item, expandedSignals);
      return { ...item, _score: scored.score, _reasons: scored.reasons };
    })
    .filter((item) => item._score > 0)
    .sort((a, b) => b._score - a._score);

  const diverseRanked = diversifyRankedProducts(ranked, limit, 2);

  if (!diverseRanked.length) {
    const fallback = await Product.find({})
      .sort({ isBestSeller: -1, rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    return { products: fallback, strategy: "trending-fallback" };
  }

  return { products: diverseRanked, strategy: "behavioral-diverse" };
}

export async function getProductRecommendations({ productId, limit = 8 }) {
  const seedProduct = await Product.findById(productId).lean();
  if (!seedProduct) return { products: [], strategy: "not-found" };

  const relatedOrders = await Order.find(
    { "items._id": String(productId) },
    { items: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .limit(120)
    .lean();

  const viewedTogetherIds = uniq(
    relatedOrders.flatMap((order) =>
      safeArray(order.items)
        .map((item) => String(item?._id || ""))
        .filter((id) => id && id !== String(productId))
    )
  );
  const viewedTogetherSet = new Set(viewedTogetherIds);

  const keywordRegexes = deriveProductKeywords(seedProduct).map(
    (word) => new RegExp(word, "i")
  );
  const seedCategory = normalize(seedProduct.category);
  const seedActivity = normalize(seedProduct.activity);

  const candidateOr = [
    ...(seedCategory ? [{ category: new RegExp(seedCategory, "i") }] : []),
    ...(seedActivity ? [{ activity: new RegExp(seedActivity, "i") }] : []),
    ...(keywordRegexes.length
      ? [
          { name: { $in: keywordRegexes } },
          { description: { $in: keywordRegexes } },
        ]
      : []),
    ...(viewedTogetherIds.length ? [{ _id: { $in: viewedTogetherIds } }] : []),
  ];

  if (!candidateOr.length) {
    const fallback = await Product.find({ _id: { $ne: productId } })
      .sort({ isBestSeller: -1, rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    return { products: fallback, strategy: "trending-fallback" };
  }

  const candidates = await Product.find({
    _id: { $ne: productId },
    $or: candidateOr,
  })
    .limit(150)
    .lean();

  const ranked = candidates
    .map((item) => {
      const scored = scoreDetailProduct(item, seedProduct, viewedTogetherSet);
      return { ...item, _score: scored.score, _reasons: scored.reasons };
    })
    .filter((item) => item._score > 0)
    .sort((a, b) => b._score - a._score);

  const diverseRanked = diversifyRankedProducts(ranked, limit, 2);

  if (!diverseRanked.length) {
    const fallback = await Product.find({ _id: { $ne: productId } })
      .sort({ isBestSeller: -1, rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    return { products: fallback, strategy: "trending-fallback" };
  }

  return { products: diverseRanked, strategy: "related-content-diverse" };
}
