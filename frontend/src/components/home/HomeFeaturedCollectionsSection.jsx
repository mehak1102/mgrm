import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import API from "../../api";
import { featuredCollectionCategories } from "../../data/featuredCollectionsData";
import { PremiumWordHeader } from "../motion/PremiumMotion";
import { trackCategoryClick } from "../../utils/recommendationBehavior";
import { useTheme } from "../../context/ThemeContext";
import "../../theme/featured-collections.css";

const REVEAL_DURATION = 0.5;
const STAGGER_MS = 0.12;
const EASE_OUT = [0, 0, 0.2, 1];
const EASE_IN = [0.4, 0, 1, 1];
const HOVER_EASE = [0.25, 0.1, 0.25, 1];
const PANEL_HEIGHT = "h-[700px]";

const PASTEL_PALETTE = [
  { border: "#f9a8b8", glow: "225, 29, 72" },
  { border: "#7dd3fc", glow: "2, 132, 199" },
  { border: "#86efac", glow: "22, 163, 74" },
  { border: "#fcd34d", glow: "217, 119, 6" },
  { border: "#c4b5fd", glow: "124, 58, 237" },
  { border: "#f9a8d4", glow: "219, 39, 119" },
  { border: "#5eead4", glow: "13, 148, 136" },
  { border: "#a5b4fc", glow: "79, 70, 229" },
  { border: "#fdba74", glow: "234, 88, 12" },
  { border: "#d8b4fe", glow: "147, 51, 234" },
  { border: "#bef264", glow: "101, 163, 13" },
  { border: "#67e8f9", glow: "8, 145, 178" },
];

const PASTEL_PALETTE_DARK = [
  { border: "rgba(251, 113, 133, 0.62)", glow: "251, 113, 133" },
  { border: "rgba(56, 189, 248, 0.62)", glow: "56, 189, 248" },
  { border: "rgba(74, 222, 128, 0.62)", glow: "74, 222, 128" },
  { border: "rgba(251, 191, 36, 0.62)", glow: "251, 191, 36" },
  { border: "rgba(167, 139, 250, 0.62)", glow: "167, 139, 250" },
  { border: "rgba(244, 114, 182, 0.62)", glow: "244, 114, 182" },
  { border: "rgba(45, 212, 191, 0.62)", glow: "45, 212, 191" },
  { border: "rgba(129, 140, 248, 0.62)", glow: "129, 140, 248" },
  { border: "rgba(251, 146, 60, 0.62)", glow: "251, 146, 60" },
  { border: "rgba(192, 132, 252, 0.62)", glow: "192, 132, 252" },
  { border: "rgba(163, 230, 53, 0.62)", glow: "163, 230, 53" },
  { border: "rgba(34, 211, 238, 0.62)", glow: "34, 211, 238" },
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getPastelForProduct(product, index, isDark) {
  const key = String(product.slug || product._id || product.name || index);
  const palette = isDark ? PASTEL_PALETTE_DARK : PASTEL_PALETTE;
  return palette[hashString(key) % palette.length];
}

/** Card n → (n - 1) × 120ms — 0, 120, 240, 360, 480, 600… */
const cardRevealDelay = (index) => index * STAGGER_MS;

const listVariants = {
  hidden: {},
  visible: {},
  exit: {
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: REVEAL_DURATION,
      ease: EASE_OUT,
      delay: cardRevealDelay(index),
    },
  }),
  exit: (index) => ({
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.28,
      ease: EASE_IN,
      delay: index * 0.04,
    },
  }),
};

function normalizeApiProduct(product, fallbackImage) {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    image: product.images?.[0] || product.image || fallbackImage,
    rating: product.rating ?? 4.7,
    _id: product._id,
  };
}

function mergeCategoryProducts(category, apiProducts) {
  if (!apiProducts.length) return category;

  const apiNormalized = apiProducts.map((p) => normalizeApiProduct(p, category.image));
  const curatedSlugs = new Set(category.products.map((p) => p.slug));

  const fromApi = apiNormalized.filter((p) => !curatedSlugs.has(p.slug));
  const mergedCurated = category.products.map((curated, index) => {
    const match =
      apiNormalized.find((p) =>
        p.name?.toLowerCase().includes(curated.name.split(" ")[0].toLowerCase())
      ) || apiNormalized[index];
    return match ? { ...curated, ...match, rating: match.rating ?? curated.rating } : curated;
  });

  return {
    ...category,
    products: [...mergedCurated, ...fromApi].slice(0, 6),
  };
}

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= Math.round(rating)
                ? "text-amber-400 fill-amber-400"
                : "text-slate-200 dark:text-zinc-700 fill-slate-200 dark:fill-zinc-700"
            }
          />
        ))}
      </div>
      <span className="text-sm font-bold text-slate-600 dark:text-zinc-400 [data-theme=blue]:text-[var(--text-secondary)]">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function ProductCard({ product, category, index, reduce, t }) {
  const { isDark } = useTheme();
  const pastel = getPastelForProduct(product, index, isDark);

  return (
    <motion.article
      custom={index}
      variants={reduce ? undefined : cardVariants}
      whileHover={
        reduce
          ? undefined
          : { y: -7, transition: { duration: 0.35, ease: HOVER_EASE } }
      }
      className="featured-collection-card-wrap group/card relative self-start w-full"
      style={{
        "--pastel-border": pastel.border,
        "--pastel-glow": pastel.glow,
      }}
    >
      <div
        aria-hidden
        className="featured-collection-card__halo pointer-events-none absolute inset-0 rounded-[32px] opacity-0 blur-2xl transition-opacity duration-[380ms] ease-out group-hover/card:opacity-90"
        style={{
          background: `radial-gradient(ellipse at 50% 48%, rgba(${pastel.glow}, 0.22) 0%, rgba(${pastel.glow}, 0.08) 45%, transparent 72%)`,
        }}
      />

      <div
        className="featured-collection-card relative flex min-h-[420px] flex-col overflow-hidden rounded-[32px] bg-white dark:bg-zinc-900/90 sm:min-h-[440px]"
      >
        {/* Image zone — ~70% of card */}
        <div className="featured-collection-card__media relative flex-[7] min-h-[280px] overflow-hidden bg-white dark:bg-zinc-900/85 sm:min-h-[300px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[380ms] ease-out group-hover/card:opacity-100"
            style={{
              background: `linear-gradient(180deg, rgba(${pastel.glow}, 0.1) 0%, rgba(${pastel.glow}, 0.03) 38%, transparent 100%)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-5">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = category.image || "/products/knee.png";
              }}
              className="h-full max-h-[250px] w-full object-contain object-center drop-shadow-[0_12px_28px_rgba(15,23,42,0.1)] transition-transform duration-[380ms] ease-out group-hover/card:scale-[1.05] sm:max-h-[270px]"
            />
          </div>
        </div>

        {/* Content zone — ~30% of card */}
        <div
          className="featured-collection-card__body relative flex flex-[3] flex-col justify-center border-t px-5 py-5 sm:px-6 sm:py-6"
          style={{ borderTopColor: `rgba(${pastel.glow}, 0.22)` }}
        >
          <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-zinc-50 [data-theme=blue]:text-[var(--text-primary)] leading-snug line-clamp-2 transition-colors duration-[350ms] group-hover/card:text-slate-800 dark:group-hover/card:text-white">
            {product.name}
          </h4>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 [data-theme=blue]:text-[var(--text-secondary)] leading-relaxed line-clamp-2">
            {product.description || t("homeSections.featuredFallback")}
          </p>

          <div className="mt-3.5 featured-collection-card__rating hidden sm:block">
            <RatingStars rating={product.rating} />
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-zinc-100 [data-theme=blue]:bg-[var(--accent-primary)] text-white dark:text-zinc-900 [data-theme=blue]:text-white px-5 py-3 text-xs sm:text-sm font-black hover:scale-[1.02] active:scale-[0.98] transition-transform duration-[350ms] ease-out"
          >
            {t("common.viewProducts")}
            <ArrowRight size={15} className="transition-transform duration-[350ms] group-hover/card:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function HomeFeaturedCollectionsSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState(featuredCollectionCategories);
  const [activeId, setActiveId] = useState(featuredCollectionCategories[0].id);

  useEffect(() => {
    let ignore = false;

    Promise.all(
      featuredCollectionCategories.map((cat) =>
        API.get(`/products?category=${encodeURIComponent(cat.query)}&bodyOnly=true`)
          .then((res) => ({ query: cat.query, products: res.data.products || [] }))
          .catch(() => ({ query: cat.query, products: [] }))
      )
    ).then((results) => {
      if (ignore) return;
      const apiByCategory = Object.fromEntries(
        results.map((r) => [r.query, r.products])
      );
      setCategories(
        featuredCollectionCategories.map((cat) =>
          mergeCategoryProducts(cat, apiByCategory[cat.query] || [])
        )
      );
    });

    return () => {
      ignore = true;
    };
  }, []);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeId) || categories[0],
    [categories, activeId]
  );

  const selectCategory = useCallback((cat) => {
    if (cat.id === activeId) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setActiveId(cat.id);
    trackCategoryClick(cat.query);
  }, [activeId]);

  return (
    <section className="home-featured-collections-section relative max-w-[1500px] mx-auto mt-10 md:mt-14 lg:mt-[72px] px-4 sm:px-6 py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-white to-cyan-50/70 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 [data-theme=blue]:from-[var(--gradient-from)] [data-theme=blue]:via-[var(--gradient-via)] [data-theme=blue]:to-[var(--gradient-to)] rounded-[48px] border border-slate-100/60 dark:border-white/5 [data-theme=blue]:border-[var(--border-color)] transition-colors duration-300" />

      <div className="relative mb-12 sm:mb-14 px-2">
        <PremiumWordHeader
          label={t("homeSections.featuredLabel")}
          title={t("homeSections.featuredTitle")}
          description={t("homeSections.featuredDesc")}
          style="slideRight"
        />
      </div>

      <div className="relative grid lg:grid-cols-[minmax(240px,300px)_1fr] gap-8 lg:gap-12 items-start px-2">
        {/* Category list */}
        <nav
          className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 snap-x snap-mandatory lg:snap-none"
          aria-label={t("homeSections.featuredCategories")}
        >
          {categories.map((cat) => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                type="button"
                onMouseEnter={() => selectCategory(cat)}
                onFocus={() => selectCategory(cat)}
                onClick={() => selectCategory(cat)}
                className={[
                  "group relative shrink-0 snap-start text-left rounded-2xl lg:rounded-[24px] px-5 py-4 lg:px-6 lg:py-5 transition-all duration-500 border",
                  isActive
                    ? "bg-white dark:bg-zinc-900/95 [data-theme=blue]:bg-[var(--card-bg)] border-white dark:border-white/10 [data-theme=blue]:border-[var(--border-color)] shadow-[0_18px_55px_rgba(15,23,42,0.09)] dark:shadow-[0_18px_55px_rgba(0,0,0,0.35)] [data-theme=blue]:shadow-theme-md"
                    : "border-transparent hover:bg-white/70 dark:hover:bg-zinc-900/60 [data-theme=blue]:hover:bg-[var(--card-hover)]",
                ].join(" ")}
                style={
                  isActive
                    ? { boxShadow: `0 0 0 1px ${cat.color}30, 0 0 28px ${cat.color}22, 0 18px 50px ${cat.color}14` }
                    : undefined
                }
              >
                <span
                  className={[
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full transition-all duration-500 hidden lg:block",
                    isActive ? "h-11 opacity-100" : "h-0 opacity-0 group-hover:h-5 group-hover:opacity-50",
                  ].join(" ")}
                  style={{ background: cat.color }}
                  aria-hidden
                />

                <span
                  className={[
                    "block text-base sm:text-lg lg:text-xl font-black tracking-tight transition-colors duration-400",
                    isActive
                      ? "text-slate-900 dark:text-zinc-50 [data-theme=blue]:text-black"
                      : "text-slate-500 dark:text-zinc-400 [data-theme=blue]:text-black group-hover:text-slate-800 dark:group-hover:text-zinc-200 [data-theme=blue]:group-hover:text-black",
                  ].join(" ")}
                >
                  {cat.label}
                </span>

                <span
                  className={[
                    "mt-1 block text-[11px] font-bold uppercase tracking-[0.18em] transition-opacity duration-400",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70",
                  ].join(" ")}
                  style={{ color: cat.color }}
                >
                  {t("common.productsCount", { count: cat.products.length })}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Fixed-height scrollable showcase */}
        <div className="relative">
          <div
            className="absolute -inset-3 rounded-[40px] opacity-35 blur-3xl pointer-events-none transition-all duration-700"
            style={{
              background: `radial-gradient(circle at 40% 30%, ${activeCategory.color}40, transparent 68%)`,
            }}
          />

          <div
            className={`relative ${PANEL_HEIGHT} rounded-[36px] bg-white/88 dark:bg-zinc-900/92 [data-theme=blue]:bg-[var(--card-bg)] backdrop-blur-xl border border-white/80 dark:border-white/10 [data-theme=blue]:border-[var(--border-color)] shadow-[0_28px_85px_rgba(15,23,42,0.10)] dark:shadow-[0_28px_85px_rgba(0,0,0,0.38)] [data-theme=blue]:shadow-theme-lg overflow-hidden transition-colors duration-300`}
          >
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-white/8 [data-theme=blue]:border-[var(--border-color)]">
              <div>
                <p
                  className="text-[11px] font-black uppercase tracking-[0.26em]"
                  style={{ color: activeCategory.color }}
                >
                  {t("homeSections.collection")}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-50 [data-theme=blue]:text-[var(--text-primary)] mt-0.5">
                  {activeCategory.label}
                </h3>
              </div>
              <Link
                to={`/shop?category=${encodeURIComponent(activeCategory.query)}`}
                onClick={() => trackCategoryClick(activeCategory.query)}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-black text-cyan-600 dark:text-cyan-400 [data-theme=blue]:text-[var(--text-accent)] hover:gap-2.5 transition-all duration-300"
              >
                {t("homeSections.featuredViewAll")}
                <ArrowRight size={16} />
              </Link>
            </div>

            <div
              ref={scrollRef}
              className="h-[calc(700px-76px)] overflow-y-auto overscroll-contain custom-scroll px-5 sm:px-7 py-6 sm:py-7"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeCategory.id}
                  variants={reduce ? undefined : listVariants}
                  initial={reduce ? false : "hidden"}
                  animate={reduce ? undefined : "visible"}
                  exit={reduce ? undefined : "exit"}
                  className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-6 items-start"
                >
                  {activeCategory.products.map((product, index) => (
                    <ProductCard
                      key={`${activeCategory.id}-${product.slug || product._id || index}`}
                      product={product}
                      category={activeCategory}
                      index={index}
                      reduce={reduce}
                      t={t}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
