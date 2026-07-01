import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import API from "../../api";
import { bestSellerCategories } from "../../data/bestSellersData";
import { PremiumWordHeader } from "../motion/PremiumMotion";
import { trackCategoryClick } from "../../utils/recommendationBehavior";

const EASE = [0.16, 1, 0.3, 1];
const TRANSITION = { duration: 0.52, ease: EASE };

function mergeApiProducts(categories, apiByCategory) {
  return categories.map((cat) => {
    const apiProducts = apiByCategory[cat.query] || [];
    if (!apiProducts.length) return cat;

    const merged = cat.products.map((curated, index) => {
      const match =
        apiProducts.find((p) =>
          p.name?.toLowerCase().includes(curated.name.split(" ")[0].toLowerCase())
        ) || apiProducts[index];

      if (!match) return curated;

      return {
        ...curated,
        name: match.name || curated.name,
        slug: match.slug || curated.slug,
        description: match.description || curated.description,
        image: match.images?.[0] || match.image || curated.image,
        _id: match._id,
      };
    });

    return { ...cat, products: merged };
  });
}

export default function HomeBestSellersSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [categories, setCategories] = useState(bestSellerCategories);
  const [activeId, setActiveId] = useState(bestSellerCategories[0].id);
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    Promise.all(
      bestSellerCategories.map((cat) =>
        API.get(
          `/products?category=${encodeURIComponent(cat.query)}&bestSeller=true&bodyOnly=true`
        )
          .then((res) => ({ query: cat.query, products: res.data.products || [] }))
          .catch(() => ({ query: cat.query, products: [] }))
      )
    ).then((results) => {
      if (ignore) return;
      const apiByCategory = Object.fromEntries(
        results.map((r) => [r.query, r.products])
      );
      setCategories(mergeApiProducts(bestSellerCategories, apiByCategory));
    });

    return () => {
      ignore = true;
    };
  }, []);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeId) || categories[0],
    [categories, activeId]
  );

  const activeProduct =
    activeCategory?.products[activeProductIndex] || activeCategory?.products[0];

  const selectCategory = useCallback((id) => {
    setActiveId(id);
    setActiveProductIndex(0);
  }, []);

  const handleCategoryEnter = (cat) => {
    selectCategory(cat.id);
    trackCategoryClick(cat.query);
  };

  const previewKey = `${activeCategory.id}-${activeProductIndex}`;

  return (
    <section className="relative max-w-[1500px] mx-auto mt-24 px-4 sm:px-6 pt-28 pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/80 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 [data-theme=blue]:from-[var(--gradient-from)] [data-theme=blue]:via-[var(--gradient-via)] [data-theme=blue]:to-[var(--gradient-to)] rounded-[48px] border border-transparent dark:border-white/5 [data-theme=blue]:border-[var(--border-color)] transition-colors duration-300" />

      <div className="relative mb-12 sm:mb-14 px-2">
        <PremiumWordHeader
          label={t("home.bestSellers")}
          title={t("home.mostTrusted")}
          description={t("home.mostTrustedDesc")}
          style="slideLeft"
        />
      </div>

      <div className="relative grid lg:grid-cols-[minmax(220px,280px)_1fr] gap-10 lg:gap-14 items-stretch px-2">
        {/* Category navigation */}
        <nav
          className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 snap-x snap-mandatory lg:snap-none scrollbar-none"
          aria-label={t("homeSections.supportCategories")}
        >
          {categories.map((cat) => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                type="button"
                onMouseEnter={() => handleCategoryEnter(cat)}
                onFocus={() => handleCategoryEnter(cat)}
                onClick={() => handleCategoryEnter(cat)}
                className={[
                  "group relative shrink-0 snap-start text-left rounded-2xl lg:rounded-[22px] px-5 py-4 lg:px-6 lg:py-5 transition-all duration-500",
                  "border border-transparent",
                  isActive
                    ? "bg-white/90 dark:bg-zinc-900/95 [data-theme=blue]:bg-[var(--card-bg)] shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)] [data-theme=blue]:shadow-theme-md border-white/80 dark:border-white/10 [data-theme=blue]:border-[var(--border-color)]"
                    : "hover:bg-white/60 dark:hover:bg-zinc-900/50 [data-theme=blue]:hover:bg-[var(--card-hover)]",
                ].join(" ")}
                style={
                  isActive
                    ? {
                        boxShadow: `0 0 0 1px ${cat.color}22, 0 20px 50px ${cat.color}18`,
                      }
                    : undefined
                }
              >
                <span
                  className={[
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full transition-all duration-500 hidden lg:block",
                    isActive ? "h-10 opacity-100" : "h-0 opacity-0 group-hover:h-6 group-hover:opacity-60",
                  ].join(" ")}
                  style={{ background: cat.color }}
                  aria-hidden
                />

                <span
                  className={[
                    "block text-lg sm:text-xl lg:text-[1.65rem] font-black tracking-tight transition-colors duration-400",
                    isActive
                      ? "text-slate-900 dark:text-zinc-50 [data-theme=blue]:text-[var(--text-primary)]"
                      : "text-slate-500 dark:text-zinc-400 [data-theme=blue]:text-[var(--text-secondary)] group-hover:text-slate-800 dark:group-hover:text-zinc-200",
                  ].join(" ")}
                >
                  {cat.label}
                </span>

                <span
                  className={[
                    "mt-1 block text-xs font-bold uppercase tracking-[0.2em] transition-opacity duration-400",
                    isActive ? "opacity-100" : "opacity-0 lg:opacity-0 group-hover:opacity-70",
                  ].join(" ")}
                  style={{ color: cat.color }}
                >
                  {t("homeSections.bestSellersPicks", { count: cat.products.length })}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Product preview panel */}
        <div className="relative min-h-[520px] sm:min-h-[560px]">
          <div className="absolute -inset-4 rounded-[40px] opacity-40 blur-3xl pointer-events-none transition-colors duration-500"
            style={{ background: `radial-gradient(circle at 30% 40%, ${activeCategory.color}33, transparent 65%)` }}
          />

          <div className="relative h-full rounded-[36px] bg-white/85 dark:bg-zinc-900/90 [data-theme=blue]:bg-[var(--card-bg)] backdrop-blur-xl border border-white/70 dark:border-white/10 [data-theme=blue]:border-[var(--border-color)] shadow-[0_30px_90px_rgba(15,23,42,0.10)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.4)] [data-theme=blue]:shadow-theme-lg overflow-hidden transition-colors duration-300">
            <AnimatePresence mode="wait">
              <motion.div
                key={previewKey}
                initial={reduce ? false : { opacity: 0, x: 28, y: 8 }}
                animate={reduce ? undefined : { opacity: 1, x: 0, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -18, y: -4 }}
                transition={TRANSITION}
                className="grid md:grid-cols-[1.05fr_0.95fr] h-full"
              >
                {/* Image */}
                <div className="relative flex items-center justify-center p-8 sm:p-10 md:p-12 bg-gradient-to-br from-slate-50/80 via-white to-cyan-50/30 dark:from-zinc-950/50 dark:via-zinc-900 dark:to-slate-950/50 [data-theme=blue]:from-[var(--soft)] [data-theme=blue]:via-[var(--card-bg)] [data-theme=blue]:to-[var(--bg-secondary)] overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `radial-gradient(circle at 50% 55%, ${activeCategory.color}28, transparent 58%)`,
                    }}
                  />
                  <motion.div
                    className="relative w-full max-w-[420px] aspect-square"
                    initial={reduce ? false : { scale: 0.96 }}
                    animate={reduce ? undefined : { scale: 1 }}
                    transition={{ duration: 0.65, ease: EASE }}
                  >
                    <motion.img
                      src={activeProduct?.image}
                      alt={activeProduct?.name}
                      onError={(e) => {
                        e.currentTarget.src = activeCategory.image || "/products/knee.png";
                      }}
                      className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(15,23,42,0.18)]"
                      whileHover={reduce ? undefined : { scale: 1.05 }}
                      transition={{ duration: 0.55, ease: EASE }}
                    />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-8 sm:p-10 md:p-12 md:pl-4">
                  <p
                    className="text-xs font-black uppercase tracking-[0.28em] mb-4"
                    style={{ color: activeCategory.color }}
                  >
                    {t("homeSections.bestSellersSupport", { category: activeCategory.label })}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {activeCategory.products.map((product, index) => (
                      <button
                        key={product.slug}
                        type="button"
                        onMouseEnter={() => setActiveProductIndex(index)}
                        onFocus={() => setActiveProductIndex(index)}
                        onClick={() => setActiveProductIndex(index)}
                        className={[
                          "rounded-full px-4 py-2 text-sm font-bold transition-all duration-400 border",
                          index === activeProductIndex
                            ? "bg-slate-900 text-white border-slate-900 dark:bg-zinc-100 dark:text-zinc-900 [data-theme=blue]:bg-[var(--accent-primary)] [data-theme=blue]:border-[var(--accent-primary)] [data-theme=blue]:text-white shadow-lg"
                            : "bg-white/70 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 [data-theme=blue]:bg-[var(--card-elevated)] [data-theme=blue]:text-[var(--text-secondary)] [data-theme=blue]:border-[var(--border-color)]",
                        ].join(" ")}
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-zinc-50 [data-theme=blue]:text-[var(--text-primary)] leading-tight">
                    {activeProduct?.name}
                  </h3>

                  <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-zinc-400 [data-theme=blue]:text-[var(--text-secondary)] leading-relaxed max-w-md">
                    {activeProduct?.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to={`/product/${activeProduct?.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-zinc-100 [data-theme=blue]:bg-[var(--accent-primary)] text-white dark:text-zinc-900 [data-theme=blue]:text-white px-6 py-3.5 font-black text-sm shadow-[0_16px_40px_rgba(15,23,42,0.18)] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-400"
                    >
                      <Eye size={18} />
                      {t("common.quickView")}
                    </Link>
                    <Link
                      to={`/shop?category=${encodeURIComponent(activeCategory.query)}`}
                      onClick={() => trackCategoryClick(activeCategory.query)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/15 [data-theme=blue]:border-[var(--border-color)] bg-white/80 dark:bg-zinc-800/80 [data-theme=blue]:bg-[var(--card-elevated)] text-slate-900 dark:text-zinc-100 [data-theme=blue]:text-[var(--text-primary)] px-6 py-3.5 font-black text-sm hover:bg-cyan-50 dark:hover:bg-zinc-700 [data-theme=blue]:hover:bg-[var(--card-hover)] transition-colors duration-400"
                    >
                      {t("homeSections.viewCollection")}
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
