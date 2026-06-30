import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight, Eye, ShoppingCart } from "lucide-react";
import API from "../../api";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { bodyCategories } from "../../data/siteData";
import { PremiumWordHeader } from "../motion/PremiumMotion";
import {
  productPriceOriginalProps,
  productPriceSaleProps,
} from "../../utils/productPriceStyle";
import "../../theme/frequently-used-products.css";

const CATEGORY_ORDER = ["Neck", "Wrist", "Arm"];
const INITIAL_VISIBLE = 4;
const MAX_PRODUCTS = 8;
const EASE = [0.22, 1, 0.36, 1];

const categoryMetaByQuery = Object.fromEntries(
  bodyCategories
    .filter((cat) => CATEGORY_ORDER.includes(cat.query))
    .map((cat) => [cat.query, cat])
);

function hexToRgb(hex) {
  const n = hex.replace("#", "");
  if (n.length < 6) return "14, 165, 233";
  return `${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)}`;
}

const PASTEL_PALETTE = [
  { border: "#f9a8b8", glow: "225, 29, 72" },
  { border: "#7dd3fc", glow: "2, 132, 199" },
  { border: "#86efac", glow: "22, 163, 74" },
  { border: "#fcd34d", glow: "217, 119, 6" },
  { border: "#c4b5fd", glow: "124, 58, 237" },
  { border: "#f9a8d4", glow: "219, 39, 119" },
  { border: "#5eead4", glow: "13, 148, 136" },
  { border: "#a5b4fc", glow: "79, 70, 229" },
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

function normalizeProduct(product, categoryQuery) {
  const meta = categoryMetaByQuery[categoryQuery];
  return {
    ...product,
    _categoryQuery: categoryQuery,
    _categoryColor: meta?.color || "#0ea5e9",
    _categoryLabel: product.category || meta?.name || categoryQuery,
    _image: product.images?.[0] || product.image || meta?.image || "/products/knee.png",
  };
}

async function fetchFrequentlyUsedProducts() {
  const results = await Promise.all(
    CATEGORY_ORDER.map((query) =>
      API.get(`/products?category=${encodeURIComponent(query)}&bodyOnly=true`)
        .then((res) => ({ query, products: res.data.products || [] }))
        .catch(() => ({ query, products: [] }))
    )
  );

  const merged = [];
  const seen = new Set();

  for (const { query, products } of results) {
    for (const product of products) {
      const id = product._id || product.slug;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      merged.push(normalizeProduct(product, query));
      if (merged.length >= MAX_PRODUCTS) return merged;
    }
  }

  return merged;
}

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: EASE,
      delay: (index % INITIAL_VISIBLE) * 0.1,
    },
  }),
  exit: {
    opacity: 0,
    y: 12,
    transition: { duration: 0.32, ease: EASE },
  },
};

const FrequentlyUsedProductCard = memo(function FrequentlyUsedProductCard({
  product,
  index,
  isBlue,
  isDark,
  onAddToCart,
}) {
  const price = Number(product.price || 0);
  const discountPrice = Number(product.discountPrice || product.price || 0);
  const glowRgb = hexToRgb(product._categoryColor);
  const pastel = getPastelForProduct(product, index, isDark);

  return (
    <motion.article
      layout
      variants={cardReveal}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      className="fup-card group/fup rounded-[34px] p-4 sm:p-5"
      style={{
        "--fup-pastel-border": pastel.border,
        "--fup-pastel-glow": pastel.glow,
      }}
    >
      <div className="fup-card__halo" aria-hidden="true" />
      <div className="fup-card__spotlight" aria-hidden="true" />

      <div className="fup-card__image-wrap mb-4">
        <div className="fup-card__image-glow" aria-hidden="true" />
        <img
          src={product._image}
          alt={product.name}
          width={400}
          height={400}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = categoryMetaByQuery[product._categoryQuery]?.image || "/products/knee.png";
          }}
          className="fup-card__image"
        />
      </div>

      <span
        className="inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em]"
        style={{
          color: product._categoryColor,
          background: `rgba(${glowRgb}, 0.12)`,
          border: `1px solid rgba(${glowRgb}, 0.28)`,
        }}
      >
        {product._categoryLabel}
      </span>

      <h3
        className={`mt-3 text-lg font-black leading-snug line-clamp-2 ${
          isDark
            ? "text-slate-900"
            : "text-slate-900 dark:text-zinc-50 [data-theme=blue]:text-[var(--text-primary)]"
        }`}
      >
        {product.name}
      </h3>

      <p
        className={`mt-2 text-xs font-semibold tracking-wide ${
          isDark
            ? "text-slate-500"
            : "text-slate-500 dark:text-zinc-400 [data-theme=blue]:text-[var(--text-secondary)]"
        }`}
      >
        Support • Recovery • Comfort
      </p>

      <div className="mt-4 flex items-baseline gap-2">
        <span
          {...productPriceSaleProps(
            isBlue,
            isDark
              ? "text-xl font-black text-slate-900"
              : "text-xl font-black text-slate-900 dark:text-zinc-100"
          )}
        >
          ₹{discountPrice}
        </span>
        {price > discountPrice && (
          <span
            {...productPriceOriginalProps(
              isBlue,
              isDark
                ? "text-sm line-through text-slate-500"
                : "text-sm line-through text-slate-500 dark:text-zinc-400"
            )}
          >
            ₹{price}
          </span>
        )}
      </div>

      <div className="fup-btn-row mt-5">
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="fup-btn fup-btn--cart"
        >
          <ShoppingCart size={16} strokeWidth={2.25} />
          Add to Cart
        </button>
        <Link
          to={`/product/${product.slug}`}
          className="fup-btn fup-btn--view"
        >
          <Eye size={16} strokeWidth={2.25} />
          View
        </Link>
      </div>
    </motion.article>
  );
});

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
      {Array.from({ length: INITIAL_VISIBLE }).map((_, i) => (
        <div
          key={i}
          className="rounded-[34px] border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-zinc-900/50 p-5 animate-pulse"
        >
          <div className="aspect-square rounded-[26px] bg-slate-200/70 dark:bg-zinc-800/80 mb-4" />
          <div className="h-4 w-24 rounded-full bg-slate-200/70 dark:bg-zinc-800/80" />
          <div className="h-6 w-4/5 rounded-lg bg-slate-200/70 dark:bg-zinc-800/80 mt-3" />
          <div className="h-4 w-2/3 rounded-lg bg-slate-200/70 dark:bg-zinc-800/80 mt-2" />
        </div>
      ))}
    </div>
  );
}

export default function FrequentlyUsedProducts() {
  const { addToCart } = useCart();
  const { isBlue, isDark } = useTheme();
  const reduceMotion = useReducedMotion();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let ignore = false;

    fetchFrequentlyUsedProducts()
      .then((list) => {
        if (!ignore) setProducts(list);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleAddToCart = useCallback(
    (product) => {
      addToCart(product);
    },
    [addToCart]
  );

  const visibleProducts = useMemo(() => {
    if (expanded) return products;
    return products.slice(0, INITIAL_VISIBLE);
  }, [products, expanded]);

  const canExpand = products.length > INITIAL_VISIBLE;

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="fup-section relative max-w-[1500px] mx-auto mt-16 sm:mt-20 md:mt-24 lg:mt-32 px-4 sm:px-6 py-24 md:py-28 overflow-hidden">
      <div className="fup-section__bg absolute inset-0 rounded-[48px] border border-slate-100/80 dark:border-white/8 [data-theme=blue]:border-[var(--border-color)]" />
      <div className="fup-section__corner-blur fup-section__corner-blur--tl" aria-hidden="true" />
      <div className="fup-section__corner-blur fup-section__corner-blur--br" aria-hidden="true" />

      <div
        className="fup-particle w-2 h-2 top-[14%] left-[12%]"
        style={{ animationDelay: "0s" }}
        aria-hidden="true"
      />
      <div
        className="fup-particle w-1.5 h-1.5 top-[28%] right-[18%]"
        style={{ animationDelay: "2.4s" }}
        aria-hidden="true"
      />
      <div
        className="fup-particle w-2.5 h-2.5 bottom-[22%] left-[22%]"
        style={{ animationDelay: "4.8s" }}
        aria-hidden="true"
      />
      <div
        className="fup-particle w-1.5 h-1.5 bottom-[18%] right-[14%]"
        style={{ animationDelay: "1.2s" }}
        aria-hidden="true"
      />

      <div className="relative px-1 sm:px-2">
        <div className="mb-10 sm:mb-12">
          <PremiumWordHeader
            label="MOST USED"
            title="Frequently Used Products"
            description="Everyday recovery essentials chosen most often by patients and active lifestyles."
            style="slideLeft"
            labelClassName="text-cyan-600 dark:text-cyan-400 [data-theme=blue]:text-[var(--text-accent)] font-black tracking-[0.28em] text-xs sm:text-sm"
            titleClassName="text-3xl sm:text-4xl md:text-[52px] font-black mt-2 text-slate-900 dark:text-zinc-100 [data-theme=blue]:text-[var(--text-primary)]"
          />
        </div>

        {loading ? (
          <LoadingGrid />
        ) : (
          <>
            <motion.div
              layout={!reduceMotion}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((product, index) => (
                  <FrequentlyUsedProductCard
                    key={product._id || product.slug}
                    product={product}
                    index={index}
                    isBlue={isBlue}
                    isDark={isDark}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {canExpand && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={toggleExpanded}
                  aria-expanded={expanded}
                  className="fup-btn fup-btn--toggle"
                >
                  <ChevronRight
                    size={18}
                    className={`transition-transform duration-500 ${expanded ? "rotate-90" : ""}`}
                  />
                  {expanded ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
