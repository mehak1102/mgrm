import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTherapyProductsGrouped } from "../../hooks/useTherapyProducts";
import {
  productPriceOriginalProps,
  productPriceSaleProps,
} from "../../utils/productPriceStyle";
import { useTheme } from "../../context/ThemeContext";

const SHELF_EASE = [0.22, 1, 0.36, 1];

const PASTEL_PALETTE = [
  { bg: "#fde8ec", border: "#f9a8b8", accent: "#e11d48" },
  { bg: "#e0f2fe", border: "#7dd3fc", accent: "#0284c7" },
  { bg: "#dcfce7", border: "#86efac", accent: "#16a34a" },
  { bg: "#fef3c7", border: "#fcd34d", accent: "#d97706" },
  { bg: "#ede9fe", border: "#c4b5fd", accent: "#7c3aed" },
  { bg: "#fce7f3", border: "#f9a8d4", accent: "#db2777" },
  { bg: "#ccfbf1", border: "#5eead4", accent: "#0d9488" },
  { bg: "#e0e7ff", border: "#a5b4fc", accent: "#4f46e5" },
  { bg: "#ffedd5", border: "#fdba74", accent: "#ea580c" },
  { bg: "#f3e8ff", border: "#d8b4fe", accent: "#9333ea" },
  { bg: "#ecfccb", border: "#bef264", accent: "#65a30d" },
  { bg: "#cffafe", border: "#67e8f9", accent: "#0891b2" },
];

const PASTEL_PALETTE_DARK = [
  { bg: "rgba(225, 29, 72, 0.14)", border: "rgba(251, 113, 133, 0.45)", accent: "#fb7185" },
  { bg: "rgba(2, 132, 199, 0.14)", border: "rgba(56, 189, 248, 0.45)", accent: "#38bdf8" },
  { bg: "rgba(22, 163, 74, 0.14)", border: "rgba(74, 222, 128, 0.45)", accent: "#4ade80" },
  { bg: "rgba(217, 119, 6, 0.14)", border: "rgba(251, 191, 36, 0.45)", accent: "#fbbf24" },
  { bg: "rgba(124, 58, 237, 0.14)", border: "rgba(167, 139, 250, 0.45)", accent: "#a78bfa" },
  { bg: "rgba(219, 39, 119, 0.14)", border: "rgba(244, 114, 182, 0.45)", accent: "#f472b6" },
  { bg: "rgba(13, 148, 136, 0.14)", border: "rgba(45, 212, 191, 0.45)", accent: "#2dd4bf" },
  { bg: "rgba(79, 70, 229, 0.14)", border: "rgba(129, 140, 248, 0.45)", accent: "#818cf8" },
  { bg: "rgba(234, 88, 12, 0.14)", border: "rgba(251, 146, 60, 0.45)", accent: "#fb923c" },
  { bg: "rgba(147, 51, 234, 0.14)", border: "rgba(192, 132, 252, 0.45)", accent: "#c084fc" },
  { bg: "rgba(101, 163, 13, 0.14)", border: "rgba(163, 230, 53, 0.45)", accent: "#a3e635" },
  { bg: "rgba(8, 145, 178, 0.14)", border: "rgba(34, 211, 238, 0.45)", accent: "#22d3ee" },
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

function hexToRgb(hex) {
  const n = (hex || "#0ea5e9").replace("#", "");
  if (n.length < 6) return "14, 165, 233";
  return `${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)}`;
}

function useSlidesPerView() {
  const [slidesPerView, setSlidesPerView] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setSlidesPerView(1.2);
      else if (w < 1024) setSlidesPerView(2);
      else setSlidesPerView(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return slidesPerView;
}

function GroupSkeleton({ slidesPerView }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: Math.ceil(slidesPerView) + 1 }).map((_, i) => (
        <div
          key={i}
          className="therapy-specimen shrink-0 animate-pulse rounded-2xl"
          style={{
            width: `calc((100% - ${(slidesPerView - 1) * 1.25}rem) / ${slidesPerView})`,
            minHeight: 300,
          }}
        />
      ))}
    </div>
  );
}

const ShelfSpecimen = memo(function ShelfSpecimen({ product, pastel, reduce, index }) {
  const { isBlue } = useTheme();
  const accentRgb = hexToRgb(pastel.accent);
  const image = product.images?.[0] || product.image || "/products/knee.png";
  const price = Number(product.price || 0);
  const sale = Number(product.discountPrice || product.price || 0);

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: SHELF_EASE }}
      whileHover={reduce ? undefined : { y: -8, transition: { duration: 0.4, ease: SHELF_EASE } }}
      className="therapy-specimen group/spec relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl sm:min-h-[300px]"
      style={{
        "--specimen-accent": pastel.accent,
        "--specimen-pastel-bg": pastel.bg,
        "--specimen-pastel-border": pastel.border,
        "--specimen-glow": `rgba(${accentRgb}, 0.28)`,
        contentVisibility: "auto",
        containIntrinsicSize: "300px",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-px opacity-0 transition-opacity duration-500 group-hover/spec:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, rgba(${accentRgb}, 0.8), transparent)` }}
      />

      <Link
        to={`/product/${product.slug}`}
        className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-5"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spec:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 50% 35%, rgba(${accentRgb}, 0.12) 0%, transparent 68%)`,
          }}
        />
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/products/knee.png";
          }}
          className="relative z-[1] max-h-[160px] w-full object-contain transition-transform duration-[650ms] ease-out group-hover/spec:scale-[1.08] sm:max-h-[180px]"
        />
      </Link>

      <div className="therapy-specimen-foot relative z-[2] px-4 py-3 sm:px-5 sm:py-4">
        <Link to={`/product/${product.slug}`}>
          <h4 className="line-clamp-2 text-xs font-semibold leading-snug therapy-text-primary sm:text-sm">
            {product.name}
          </h4>
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span
            {...productPriceSaleProps(isBlue, "text-sm font-medium therapy-text-primary sm:text-base")}
          >
            ₹{sale}
          </span>
          {price > sale && (
            <span
              {...productPriceOriginalProps(isBlue, "text-[0.65rem] therapy-text-muted line-through")}
            >
              ₹{price}
            </span>
          )}
          <Link
            to={`/product/${product.slug}`}
            className="therapy-specimen-cta ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            aria-label={`View ${product.name}`}
          >
            <ArrowUpRight size={14} strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
});

function CategoryCarousel({ group, slidesPerView, reduce }) {
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const controls = useAnimationControls();
  const [containerWidth, setContainerWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const gap = 16;
  const products = group.products;

  const slideWidth = useMemo(() => {
    if (containerWidth <= 0) return 240;
    return (containerWidth - gap * (slidesPerView - 1)) / slidesPerView;
  }, [containerWidth, gap, slidesPerView]);

  const loop = useMemo(() => (products.length ? [...products, ...products] : []), [products]);
  const duration = Math.max(48, products.length * 11);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || paused || products.length < 2) {
      controls.stop();
      return;
    }
    controls.start({
      x: ["0%", "-50%"],
      transition: { duration, repeat: Infinity, ease: "linear" },
    });
  }, [controls, duration, paused, products.length, reduce]);

  if (!products.length) {
    return (
      <p className="therapy-text-muted rounded-xl border border-dashed therapy-border px-4 py-8 text-center text-xs">
        No live inventory for {group.label} yet.
      </p>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={containerRef} className="relative overflow-hidden" style={{ minHeight: 280 }}>
        <div className="therapy-shelf-mask-left pointer-events-none absolute left-0 top-0 z-20 h-full w-10 sm:w-16" aria-hidden />
        <div className="therapy-shelf-mask-right pointer-events-none absolute right-0 top-0 z-20 h-full w-10 sm:w-16" aria-hidden />

        <motion.div className="flex w-max gap-4" animate={controls}>
          {loop.map((product, index) => {
            const id = product._id || product.slug;
            const pastel = getPastelForProduct(product, index, isDark);
            return (
              <div key={`${id}-${index}`} className="shrink-0" style={{ width: slideWidth }}>
                <ShelfSpecimen
                  product={product}
                  pastel={pastel}
                  reduce={reduce}
                  index={index % products.length}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

function CategoryGroup({ group, slidesPerView, reduce, loading }) {
  const shopUrl = `/shop?category=${encodeURIComponent(group.query)}`;

  return (
    <div className="therapy-category-group">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={group.image}
            alt=""
            className="h-9 w-9 rounded-full object-cover therapy-ring"
            style={{ "--ring-color": group.color, boxShadow: `0 0 0 2px ${group.color}` }}
            loading="lazy"
          />
          <div>
            <p
              className="text-[0.6rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: group.color }}
            >
              Body Category
            </p>
            <h3 className="therapy-text-primary text-base font-medium sm:text-lg">{group.label}</h3>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="therapy-text-muted text-[0.65rem] font-medium uppercase tracking-[0.14em]">
            {loading ? "—" : `${group.count} live`}
          </span>
          <Link
            to={shopUrl}
            className="therapy-text-muted inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition-opacity hover:opacity-100"
          >
            View all
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      {loading ? (
        <GroupSkeleton slidesPerView={slidesPerView} />
      ) : (
        <CategoryCarousel group={group} slidesPerView={slidesPerView} reduce={reduce} />
      )}
    </div>
  );
}

function TherapyProductCarousel({ categories, accent = "#0ea5e9" }) {
  const reduce = useReducedMotion();
  const slidesPerView = useSlidesPerView();
  const { groups, loading, totalCount } = useTherapyProductsGrouped(categories);

  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="flex items-center justify-between gap-4 border-b therapy-border pb-4">
        <p className="therapy-text-muted text-[0.65rem] font-medium uppercase tracking-[0.22em]">
          Specialist shelf
        </p>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
          {loading ? "Loading…" : `${totalCount} products`}
        </p>
      </div>

      {groups.map((group) => (
        <CategoryGroup
          key={group.query}
          group={group}
          slidesPerView={slidesPerView}
          reduce={reduce}
          loading={loading}
        />
      ))}
    </div>
  );
}

export default memo(TherapyProductCarousel);
