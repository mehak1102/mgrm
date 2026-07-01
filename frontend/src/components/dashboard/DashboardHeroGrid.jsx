import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, Star, Settings, ArrowUpRight, LayoutGrid } from "lucide-react";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useHomeRecommendations } from "../../hooks/useRecommendations";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useProductStats } from "../../context/ProductStatsContext";
import { bodyCategories } from "../../data/siteData";
import { productMatchesCategory } from "../../utils/categoryProductMatch";
import { getPosterCardTheme, getPosterWash, POSTER_GLOW } from "./dashboardTheme";

const PRODUCT_NUMBER_COLORS = [
  "#bae6fd",
  "#fbcfe8",
  "#ddd6fe",
  "#fed7aa",
  "#bbf7d0",
  "#a5f3fc",
  "#fef08a",
  "#fecdd3",
  "#c7d2fe",
  "#99f6e4",
  "#d9f99d",
  "#e9d5ff",
  "#bfdbfe",
  "#a7f3d0",
  "#fde68a",
];

const PRODUCT_NUMBER_BORDERS = [
  "#38bdf8",
  "#f472b6",
  "#a78bfa",
  "#fb923c",
  "#4ade80",
  "#22d3ee",
  "#facc15",
  "#fb7185",
  "#818cf8",
  "#2dd4bf",
  "#a3e635",
  "#c084fc",
  "#60a5fa",
  "#34d399",
  "#fbbf24",
];

function getProductNumberColor(number) {
  const index = (number - 1) % PRODUCT_NUMBER_COLORS.length;
  return {
    fill: PRODUCT_NUMBER_COLORS[index],
    border: PRODUCT_NUMBER_BORDERS[index],
  };
}

/** Slow horizontal marquee — all products in one row, clickable with hover glow */
function ProductCarousel({ items, textZone = "32%", onItemClick }) {
  const list = items.filter((p) => p?.image && p?.slug);
  if (!list.length) return null;

  const loop = [...list, ...list];
  const duration = Math.max(48, list.length * 2.2);

  return (
    <div
      className="absolute inset-x-0 top-0 z-20 overflow-hidden dashboard-shop-carousel-mask"
      style={{ bottom: textZone }}
    >
      <div
        className="flex h-full items-stretch gap-2.5 sm:gap-3 w-max dashboard-shop-carousel py-3 px-3"
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((item, i) => (
          <button
            key={`${item.slug}-${i}`}
            type="button"
            title={item.name}
            onClick={(e) => {
              e.stopPropagation();
              onItemClick?.(item.slug);
            }}
            className="dashboard-carousel-card group/card relative h-full shrink-0 w-[clamp(88px,22%,148px)]
              rounded-xl overflow-hidden cursor-pointer border border-white/20
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2"
          >
            {/* Product index badges (1–68) — disabled per design
            <span
              className="dashboard-carousel-number absolute top-2 left-2 z-10 flex h-9 w-9 items-center justify-center
                rounded-full text-[11px] font-black leading-none text-slate-800
                border-2 backdrop-blur-sm pointer-events-none"
              style={{
                background: badgeColors.fill,
                borderColor: badgeColors.border,
                "--badge-glow": badgeColors.border,
              }}
              aria-hidden="true"
            >
              {item.number}
            </span>
            */}
            <img
              src={item.image}
              alt={item.name || "Product"}
              loading="lazy"
              draggable={false}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-[1.06]"
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300
                group-hover/card:opacity-100 bg-gradient-to-t from-violet-600/25 via-transparent to-cyan-400/15"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/** Auto-marquee of all body category images — 4× duplicate for gapless loop */
function CategoryMarquee({ categories, textZone = "32%" }) {
  const items = categories.filter((c) => c?.image);
  if (!items.length) return null;

  const copies = 4;
  const loop = Array.from({ length: copies }, () => items).flat();
  const duration = Math.max(52, items.length * 3.8);

  return (
    <div
      className="absolute inset-x-0 top-0 z-20 overflow-hidden dashboard-category-carousel-mask pointer-events-none"
      style={{ bottom: textZone }}
    >
      <div
        className="dashboard-category-track flex h-full flex-nowrap items-stretch gap-2.5 sm:gap-3 py-3 pl-2"
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((cat, i) => (
          <div
            key={`${cat.query}-${i}`}
            className="dashboard-category-chip relative h-full w-[88px] shrink-0 overflow-hidden rounded-xl border border-white/25 shadow-[0_8px_20px_rgba(0,0,0,0.14)] sm:w-[100px]"
            title={cat.name}
          >
            <img
              src={cat.image}
              alt={cat.name}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Full-bleed product spotlight — image covers entire card */
function CategoryRotator({ categories, activeIndex, cardTheme, formatProductCount, productsLabel }) {
  const items = categories.filter((c) => c?.productImage);
  if (!items.length) return null;

  const index = activeIndex % items.length;
  const cat = items[index];

  return (
    <div className="dashboard-catalog-rotator absolute inset-0 z-[15] overflow-hidden pointer-events-none bg-white">
      <AnimatePresence initial={false}>
        <motion.div
          key={cat.query}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.95, ease: [0.45, 0, 0.15, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={cat.productImage}
            alt={cat.productName || cat.name}
            loading="lazy"
            draggable={false}
            className="dashboard-catalog-rotator__img"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 top-1/3 z-[2] bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />

      <span
        className={`absolute top-3 left-3 z-[4] max-w-[80%] truncate text-[9px] font-bold uppercase tracking-wider
          px-2 py-0.5 rounded-md ${
            cardTheme.isLight
              ? "bg-white/92 text-slate-700 shadow-sm"
              : "bg-black/45 text-white backdrop-blur-sm"
          }`}
      >
        {cat.name}
      </span>
      <span
        className={`absolute top-3 right-3 z-[4] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md ${
          cardTheme.isLight ? "bg-violet-600 text-white" : "bg-white/92 text-violet-900"
        }`}
      >
        {productsLabel?.(formatProductCount(cat.count, { suffix: "" })) ??
          formatProductCount(cat.count, { suffix: "" })}
      </span>

      <div
        className="absolute inset-x-0 bottom-0 z-[4] flex justify-center gap-1 pb-2 pt-6
          bg-gradient-to-t from-black/35 to-transparent"
        aria-hidden="true"
      >
        {items.map((item, i) => (
          <span
            key={item.query}
            className={`h-1 rounded-full transition-all duration-500 ease-out ${
              i === index ? "w-5 bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "w-1 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** Clean straight grid — no rotation, equal cells */
function ProductGrid({ sources, cols, rows, textZone = "36%" }) {
  const imgs = sources.filter(Boolean).slice(0, cols * rows);

  return (
    <div
      className="absolute inset-x-3 top-3 z-20 grid gap-2 sm:gap-2.5 pointer-events-none"
      style={{
        bottom: textZone,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {imgs.map((src, i) => (
        <div
          key={i}
          className="flex items-center justify-center rounded-xl min-h-0 p-0 overflow-hidden"
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover
              drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform duration-500
              group-hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>
  );
}

function RecoverySplit({ before, after, cardTheme }) {
  const { t } = useTranslation();
  const beforeLabel = t("common.before");
  const afterLabel = t("common.after");

  return (
    <div className="absolute inset-x-0 top-0 z-20 flex pointer-events-none" style={{ bottom: "34%" }}>
      <div className="relative w-1/2 h-full border-r border-white/25 overflow-hidden">
        <img src={before} alt={beforeLabel} loading="lazy" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
        <span
          className={`absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md
            ${cardTheme.isLight ? "bg-white/90 text-slate-700" : "bg-black/40 text-white backdrop-blur-sm"}`}
        >
          {beforeLabel}
        </span>
      </div>
      <div className="relative w-1/2 h-full overflow-hidden">
        <img src={after} alt={afterLabel} loading="lazy" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
        <span
          className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md
            ${cardTheme.isLight ? "bg-white/90 text-slate-700" : "bg-black/40 text-white backdrop-blur-sm"}`}
        >
          {afterLabel}
        </span>
      </div>
    </div>
  );
}

function PosterTile({
  className = "",
  delay = 0,
  onClick,
  washKey,
  glow,
  label,
  title,
  subtitle,
  collage,
  categoryMarquee,
  rotatingCategory,
  carousel,
  onCarouselItemClick,
  gridCols = 2,
  gridRows = 2,
  splitImages,
  profileImage,
  parallaxX,
  parallaxY,
  depth = 0,
  size = "lg",
  cardTheme,
  siteTheme,
  ctaLabel,
  subtitleLines = 1,
  coverImage = false,
  children,
}) {
  const x = useTransform(parallaxX, (v) => v * depth);
  const y = useTransform(parallaxY, (v) => v * depth);
  const wash = getPosterWash(siteTheme, washKey);

  const textPad = size === "sm" ? "p-3" : size === "md" ? "p-3.5 sm:p-4" : "p-4 sm:p-5";
  const titleSize =
    size === "sm"
      ? "text-sm sm:text-base"
      : size === "md"
        ? "text-base sm:text-lg"
        : "text-lg sm:text-xl lg:text-2xl";
  const textZone = size === "sm" ? "34%" : size === "md" ? "36%" : "32%";
  const imageOverlay = coverImage;
  const scrimClass = imageOverlay
    ? "bg-gradient-to-t from-black/92 via-black/55 to-transparent"
    : cardTheme.textScrim;
  const labelClass = imageOverlay ? "text-white/75" : cardTheme.label;
  const titleClass = imageOverlay ? "text-white" : cardTheme.title;
  const subtitleClass = imageOverlay ? "text-white/88" : cardTheme.subtitle;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      onClick={onClick}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      style={{ boxShadow: glow, x, y }}
      className={`relative overflow-hidden rounded-[28px] sm:rounded-[32px] text-left cursor-pointer
        group h-full min-h-0 w-full ${cardTheme.border} border ${className}`}
    >
      <div
        className={`absolute inset-0 z-0 ${cardTheme.bgBlur}`}
        style={{ background: coverImage ? "transparent" : wash }}
      />
      {!coverImage && <div className={`absolute inset-0 z-0 ${cardTheme.bgOverlay}`} />}

      {carousel && (
        <ProductCarousel
          items={carousel}
          textZone={textZone}
          onItemClick={onCarouselItemClick}
        />
      )}

      {categoryMarquee && !carousel && !rotatingCategory && (
        <CategoryMarquee categories={categoryMarquee} textZone={textZone} />
      )}

      {rotatingCategory && !carousel && (
        <CategoryRotator
          categories={rotatingCategory.categories}
          activeIndex={rotatingCategory.activeIndex}
          cardTheme={cardTheme}
          formatProductCount={rotatingCategory.formatProductCount}
          productsLabel={rotatingCategory.productsLabel}
        />
      )}

      {collage && !carousel && !categoryMarquee && !rotatingCategory && (
        <ProductGrid
          sources={collage}
          cols={gridCols}
          rows={gridRows}
          textZone={textZone}
        />
      )}

      {splitImages && (
        <RecoverySplit before={splitImages[0]} after={splitImages[1]} cardTheme={cardTheme} />
      )}

      {profileImage && (
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ bottom: textZone }}>
          <div className="absolute right-4 top-3 bottom-1 w-[38%] flex items-center justify-center">
            <img
              src={profileImage}
              alt=""
              loading="lazy"
              className="max-w-full max-h-full object-contain rounded-2xl
                border-2 border-white/30 shadow-[0_12px_32px_rgba(0,0,0,0.2)]"
            />
          </div>
        </div>
      )}

      <div className={`absolute inset-x-0 bottom-0 z-10 pointer-events-none ${scrimClass}`} style={{ height: textZone }} />
      <div className="absolute inset-x-0 top-0 h-px z-10 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className={`relative z-30 h-full min-h-0 ${textPad} flex flex-col justify-end pointer-events-none`}>
        {label && (
          <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] ${labelClass}`}>
            {label}
          </span>
        )}
        {title && (
          <h3 className={`${titleSize} font-bold ${titleClass} tracking-tight mt-0.5 leading-tight`}>
            {title}
          </h3>
        )}
        {subtitle && (
          <p
            className={`text-[11px] sm:text-xs ${subtitleClass} mt-0.5 font-medium ${
              subtitleLines > 1 ? "line-clamp-2 leading-snug" : "line-clamp-1"
            }`}
          >
            {subtitle}
          </p>
        )}
        {ctaLabel && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className={`pointer-events-auto mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5
              text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-md transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2
              ${
                imageOverlay
                  ? "border-white/30 bg-white/15 text-white hover:bg-white/25"
                  : cardTheme.isLight
                    ? "border-slate-200/90 bg-white/95 text-slate-800 shadow-sm hover:bg-white hover:shadow-md"
                    : "border-white/25 bg-white/15 text-white hover:bg-white/25"
              }`}
          >
            {ctaLabel}
            <ArrowUpRight size={12} strokeWidth={2.25} />
          </button>
        )}
      </div>

      {children}
    </motion.div>
  );
}

function productImages(list) {
  return list.map((p) => p?.images?.[0]).filter(Boolean);
}

export default function DashboardHeroGrid({ onSection, onRoute }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { theme: siteTheme } = useTheme();
  const cardTheme = getPosterCardTheme(siteTheme);
  const { categoriesWithCounts, bodyTotal, formatProductCount } = useProductStats();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [recoveryPreview, setRecoveryPreview] = useState(null);
  const [categoryIndex, setCategoryIndex] = useState(0);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const { products: recommended } = useHomeRecommendations({ cart, limit: 6 });

  useEffect(() => {
    API.get("/products").then((r) => setProducts(r.data.products || [])).catch(() => {});
    API.get("/orders/my").then((r) => setOrders(r.data || [])).catch(() => {});
    API.get("/users/me").then((r) => setProfile(r.data)).catch(() => {});
    API.get("/recovery-stories/my")
      .then((r) => {
        const stories = r.data.stories || [];
        const pick = stories.find((s) => s.beforeImage && s.afterImage) || stories[0];
        setRecoveryPreview(pick);
      })
      .catch(() => {});
  }, []);

  const rotatableCategories = useMemo(() => {
    const mapped = categoriesWithCounts.map((cat) => {
      const match = products.find(
        (p) => p?.images?.[0] && productMatchesCategory(p, cat.query)
      );
      return {
        ...cat,
        productImage: match?.images?.[0] || null,
        productName: match?.name || null,
      };
    });

    const withProductPhotos = mapped.filter((c) => c.productImage);
    if (withProductPhotos.length) return withProductPhotos;

    return products
      .filter((p) => p?.images?.[0])
      .slice(0, bodyCategories.length)
      .map((p, i) => ({
        ...bodyCategories[i % bodyCategories.length],
        count: 1,
        productImage: p.images[0],
        productName: p.name,
      }));
  }, [categoriesWithCounts, products]);

  useEffect(() => {
    if (!rotatableCategories.length) return undefined;
    const timer = setInterval(() => {
      setCategoryIndex((i) => (i + 1) % rotatableCategories.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [rotatableCategories.length]);

  const activeCategory =
    rotatableCategories[categoryIndex % Math.max(rotatableCategories.length, 1)] || null;

  const shopCarouselItems = useMemo(
    () =>
      products
        .filter((p) => p?.images?.[0] && p?.slug)
        .map((p) => ({
          slug: p.slug,
          image: p.images[0],
          name: p.name,
          // number: index + 1, // index badges disabled
        })),
    [products]
  );

  const recoCollage = useMemo(() => {
    const imgs = productImages(recommended);
    return (imgs.length >= 3 ? imgs : productImages(products.slice(1, 4))).slice(0, 3);
  }, [recommended, products]);

  const wishlistCollage = useMemo(() => {
    const imgs = wishlist.filter((p) => p?.images?.[0]).map((p) => p.images[0]);
    return (imgs.length >= 4 ? imgs : productImages(products.slice(0, 4))).slice(0, 4);
  }, [wishlist, products]);

  const orderCollage = useMemo(() => {
    const imgs = [];
    for (const order of orders) {
      for (const item of order.items || []) {
        const src = item.image || item.images?.[0];
        if (src) imgs.push(src);
        if (imgs.length >= 4) return imgs;
      }
    }
    return productImages(products.slice(0, 4));
  }, [orders, products]);

  const productCountLabel = (count) =>
    t("dashboard.productCountLabel", { count: count || bodyTotal });

  const recoverySplit = useMemo(() => {
    if (recoveryPreview?.beforeImage && recoveryPreview?.afterImage) {
      return [recoveryPreview.beforeImage, recoveryPreview.afterImage];
    }
    return ["/products/knee2.png", "/products/shoulder2.png"];
  }, [recoveryPreview]);

  const therapyCollage = useMemo(() => {
    const queries = ["Thigh", "Knee", "Shin And Calf"];
    return queries
      .map((q) => bodyCategories.find((c) => c.query === q)?.image)
      .filter(Boolean)
      .slice(0, 3);
  }, []);

  const profileImg = profile?.profileImage || user?.profileImage || "/products/logo-mark.png";
  const addressCollage = ["/products/back2.png", "/products/knee2.png", "/products/ankle2.png", "/products/wrist2.png"];

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 4);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 4);
  };

  return (
    <section
      className="h-full min-h-0 flex flex-col max-w-[1380px] mx-auto w-full"
      onMouseMove={onMouseMove}
    >
      <div
        className="flex-1 min-h-0 grid grid-cols-12 gap-3 sm:gap-4
          grid-rows-[minmax(0,2.6fr)_minmax(0,1.55fr)_minmax(0,1.25fr)_minmax(0,0.8fr)]"
      >
        <PosterTile
          className="col-span-7 row-start-1"
          size="lg"
          delay={0.12}
          washKey="shop"
          glow={POSTER_GLOW.shop}
          label={t("dashboard.grid.explore")}
          title={t("dashboard.grid.shopProducts")}
          subtitle={productCountLabel(bodyTotal)}
          subtitleLines={2}
          carousel={shopCarouselItems}
          onCarouselItemClick={(slug) => onRoute(`/product/${slug}`)}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          depth={0.1}
          onClick={() => onRoute("/shop")}
        />

        <PosterTile
          className="col-span-5 row-start-1 dashboard-catalog-tile"
          size="lg"
          delay={0.18}
          washKey="catalog"
          glow={POSTER_GLOW.catalog}
          coverImage
          label={t("dashboard.grid.catalog")}
          title={t("dashboard.grid.allProducts")}
          subtitle={
            activeCategory
              ? `${activeCategory.name} · ${formatProductCount(activeCategory.count, { suffix: "" })} ${t("common.inCategory")}`
              : t("common.certifiedProductsCount", { count: formatProductCount(bodyTotal) })
          }
          rotatingCategory={{
            categories: rotatableCategories,
            activeIndex: categoryIndex,
            formatProductCount,
            productsLabel: (count) => t("common.productsInRotator", { count }),
          }}
          ctaLabel={t("dashboard.grid.browseAll")}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          onClick={() =>
            onRoute(
              activeCategory
                ? `/shop?category=${encodeURIComponent(activeCategory.query)}`
                : "/shop"
            )
          }
        >
          <LayoutGrid size={15} className="absolute top-4 right-4 z-30 text-white/85" />
        </PosterTile>

        <PosterTile
          className="col-span-4 row-start-2"
          size="md"
          delay={0.24}
          washKey="featured"
          glow={POSTER_GLOW.featured}
          label={t("dashboard.grid.therapy")}
          title={t("dashboard.grid.recommendedPhysio")}
          subtitle={t("dashboard.grid.physioSubtitle")}
          collage={therapyCollage}
          gridCols={3}
          gridRows={1}
          ctaLabel={t("dashboard.grid.explore")}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          onClick={() => onRoute("/recommended-by-physiotherapist")}
        >
          <Star size={15} className={`absolute top-4 right-4 z-30 ${cardTheme.iconStar}`} fill="currentColor" />
        </PosterTile>

        <PosterTile
          className="col-span-4 row-start-2"
          size="md"
          delay={0.3}
          washKey="recommended"
          glow={POSTER_GLOW.recommended}
          label={t("dashboard.grid.forYou")}
          title={t("dashboard.grid.recommended")}
          subtitle={recommended[0]?.name || t("dashboard.grid.personalized")}
          collage={recoCollage}
          gridCols={3}
          gridRows={1}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          onClick={() => onRoute(recommended[0] ? `/product/${recommended[0].slug}` : "/shop")}
        >
          <Sparkles size={15} className={`absolute top-4 right-4 z-30 ${cardTheme.iconSparkle}`} />
        </PosterTile>

        <PosterTile
          className="col-span-4 row-start-2"
          size="md"
          delay={0.34}
          washKey="categories"
          glow={POSTER_GLOW.categories}
          label={t("dashboard.grid.bodyParts")}
          title={t("dashboard.grid.categories")}
          subtitle={t("dashboard.grid.regionsCount", { count: bodyCategories.length })}
          categoryMarquee={bodyCategories}
          ctaLabel={t("dashboard.grid.exploreRegions")}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          onClick={() => onRoute("/shop-by-body")}
        />

        <PosterTile
          className="col-span-5 row-start-3"
          size="md"
          delay={0.36}
          washKey="recovery"
          glow={POSTER_GLOW.recovery}
          label={t("dashboard.grid.healInspire")}
          title={t("dashboard.grid.recoveryStories")}
          subtitle={t("dashboard.grid.beforeAfter")}
          splitImages={recoverySplit}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          onClick={() => onSection("recovery")}
        />

        <PosterTile
          className="col-span-2 row-start-3 col-start-6"
          size="sm"
          delay={0.4}
          washKey="orders"
          glow={POSTER_GLOW.orders}
          label={t("dashboard.grid.track")}
          title={t("dashboard.grid.orders")}
          subtitle={t("dashboard.grid.ordersTotal", { count: orders.length })}
          collage={orderCollage}
          gridCols={2}
          gridRows={2}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          onClick={() => onSection("orders")}
        />

        <PosterTile
          className="col-span-2 row-start-3 col-start-8"
          size="sm"
          delay={0.44}
          washKey="wishlist"
          glow={POSTER_GLOW.wishlist}
          label={t("dashboard.grid.saved")}
          title={t("dashboard.grid.wishlist")}
          subtitle={t("common.itemsCount", { count: wishlist.length })}
          collage={wishlistCollage}
          gridCols={2}
          gridRows={2}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          onClick={() => onSection("wishlist")}
        />

        <PosterTile
          className="col-span-3 row-start-3 col-start-10"
          size="sm"
          delay={0.48}
          washKey="addresses"
          glow={POSTER_GLOW.addresses}
          label={t("dashboard.grid.deliverTo")}
          title={t("dashboard.grid.addresses")}
          subtitle={t("dashboard.grid.savedCount", { count: profile?.addresses?.length || 0 })}
          collage={addressCollage}
          gridCols={2}
          gridRows={2}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          onClick={() => onSection("addresses")}
        />

        <PosterTile
          className="col-span-7 row-start-4"
          size="sm"
          delay={0.52}
          washKey="profile"
          glow={POSTER_GLOW.profile}
          label={t("dashboard.grid.account")}
          title={user?.name?.split(" ")[0] || t("dashboard.grid.yourProfile")}
          subtitle={user?.email}
          profileImage={profileImg}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          onClick={() => onSection("profile")}
        />

        <motion.button
          type="button"
          onClick={() => onSection("settings")}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.56, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.01, y: -2 }}
          style={{ boxShadow: POSTER_GLOW.settings }}
          className={`col-span-5 row-start-4 col-start-8 relative overflow-hidden rounded-[28px] sm:rounded-[32px]
            border h-full min-h-0 text-left group ${cardTheme.border}`}
        >
          <div
            className={`absolute inset-0 z-0 ${cardTheme.bgBlur}`}
            style={{ background: getPosterWash(siteTheme, "settings") }}
          />
          <div className={`absolute inset-0 ${cardTheme.bgOverlay}`} />
          <div className="relative z-10 h-full flex items-center justify-between px-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl backdrop-blur-md grid place-items-center border ${cardTheme.settingsBg}`}>
                <Settings size={20} className={cardTheme.settingsIcon} />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${cardTheme.label}`}>Preferences</p>
                <h3 className={`text-base sm:text-lg font-bold tracking-tight ${cardTheme.settingsText}`}>Settings</h3>
              </div>
            </div>
            <span className={`text-xs font-medium hidden sm:block ${cardTheme.settingsMuted}`}>Theme · Account</span>
          </div>
        </motion.button>
      </div>
    </section>
  );
}
