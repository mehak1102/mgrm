import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, Star, Settings } from "lucide-react";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useHomeRecommendations } from "../../hooks/useRecommendations";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { bodyCategories } from "../../data/siteData";
import { getPosterCardTheme, getPosterWash, POSTER_GLOW } from "./dashboardTheme";

/** Fallback shots when highlight products are not in the catalog yet */
const SHOP_TILE_IMAGES = ["/products/abdomen2.png", "/products/wrist2.png"];

function findProductByTerms(products, terms) {
  const normalized = terms.map((t) => t.toLowerCase());
  return products.find((p) => {
    const name = p.name?.toLowerCase() || "";
    const slug = p.slug?.toLowerCase() || "";
    return normalized.some(
      (term) => name.includes(term) || slug.includes(term.replace(/\s+/g, "-"))
    );
  });
}

function getShopHighlightProducts(products) {
  const withImage = products.filter((p) => p?.images?.[0] && p?.slug);
  const slimTrimBelt = findProductByTerms(withImage, [
    "slim trim belt",
    "slim-trim-belt",
    "slim trim",
  ]);
  const wristWrap = findProductByTerms(withImage, ["wrist wrap", "wrist-wrap"]);
  const highlights = [];
  if (slimTrimBelt) highlights.push(slimTrimBelt);
  if (wristWrap && wristWrap.slug !== slimTrimBelt?.slug) highlights.push(wristWrap);
  return highlights;
}

/** Slow horizontal strip — all products, seamless loop, clickable tiles */
function ProductCarouselStrip({ products, onProductClick }) {
  const items = products.filter((p) => p?.images?.[0] && p?.slug);
  if (!items.length) return null;

  const loop = items.length > 1 ? [...items, ...items] : items;

  return (
    <div className="relative flex-[1.2] min-h-0 overflow-hidden rounded-xl dashboard-shop-carousel-wrap pointer-events-auto">
      <div
        className={`flex h-full w-max gap-3 py-1 ${items.length > 1 ? "dashboard-shop-carousel" : ""}`}
      >
        {loop.map((product, i) => (
          <button
            key={`${product.slug}-${i}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onProductClick?.(product.slug);
            }}
            className="dashboard-carousel-item group/item relative h-full aspect-[5/4] shrink-0 overflow-hidden rounded-xl
              border border-white/25 bg-white/10
              transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
              hover:border-sky-300/70
              hover:shadow-[0_0_36px_rgba(125,211,252,0.75),0_0_64px_rgba(59,130,246,0.45),0_16px_40px_rgba(37,99,235,0.35)]
              hover:scale-[1.06] hover:z-10
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/90
              active:scale-[0.98]"
            aria-label={product.name ? `View ${product.name}` : "View product"}
          >
            <img
              src={product.images[0]}
              alt={product.name || ""}
              loading="lazy"
              draggable={false}
              className="w-full h-full object-cover object-[center_28%] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover/item:scale-[1.08] group-hover/item:brightness-[1.08] group-hover/item:saturate-[1.05]"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-700 pointer-events-none
                bg-gradient-to-t from-sky-500/30 via-blue-400/10 to-white/15"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductGridRow({ sources, cols, rows }) {
  const imgs = sources.filter(Boolean).slice(0, cols * rows);

  return (
    <div
      className="flex-1 min-h-0 grid gap-2 sm:gap-2.5"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {imgs.map((src, i) => (
        <div
          key={i}
          className="flex items-center justify-center rounded-xl min-h-0 overflow-hidden"
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover object-[center_28%]
              drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform duration-500
              group-hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>
  );
}

function CarouselWithGrid({ carousel, collage, gridCols, gridRows, textZone, onProductClick }) {
  return (
    <div
      className="absolute inset-x-3 top-3 z-20 flex flex-col gap-2 sm:gap-2.5"
      style={{ bottom: textZone }}
    >
      <ProductCarouselStrip products={carousel} onProductClick={onProductClick} />
      {collage?.length > 0 && (
        <div className="pointer-events-none flex-1 min-h-0">
          <ProductGridRow sources={collage} cols={gridCols} rows={gridRows} />
        </div>
      )}
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
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex pointer-events-none" style={{ bottom: "34%" }}>
      <div className="relative w-1/2 h-full border-r border-white/25 overflow-hidden">
        <img src={before} alt="Before" loading="lazy" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
        <span
          className={`absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md
            ${cardTheme.isLight ? "bg-white/90 text-slate-700" : "bg-black/40 text-white backdrop-blur-sm"}`}
        >
          Before
        </span>
      </div>
      <div className="relative w-1/2 h-full overflow-hidden">
        <img src={after} alt="After" loading="lazy" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
        <span
          className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md
            ${cardTheme.isLight ? "bg-white/90 text-slate-700" : "bg-black/40 text-white backdrop-blur-sm"}`}
        >
          After
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
  carousel,
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
  children,
  onProductClick,
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

  const TileWrapper = carousel ? motion.div : motion.button;
  const tileProps = carousel
    ? {
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        },
      }
    : { type: "button" };

  return (
    <TileWrapper
      {...tileProps}
      onClick={onClick}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      style={{ boxShadow: glow, x, y }}
      className={`relative overflow-hidden rounded-[28px] sm:rounded-[32px] text-left
        group h-full min-h-0 w-full ${cardTheme.border} border ${className}`}
    >
      <div
        className={`absolute inset-0 z-0 ${cardTheme.bgBlur}`}
        style={{ background: wash }}
      />
      <div className={`absolute inset-0 z-0 ${cardTheme.bgOverlay}`} />

      {collage && carousel ? (
        <CarouselWithGrid
          carousel={carousel}
          collage={collage}
          gridCols={gridCols}
          gridRows={gridRows}
          textZone={textZone}
          onProductClick={onProductClick}
        />
      ) : (
        collage && (
          <ProductGrid
            sources={collage}
            cols={gridCols}
            rows={gridRows}
            textZone={textZone}
          />
        )
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

      <div className={`absolute inset-x-0 bottom-0 z-10 pointer-events-none ${cardTheme.textScrim}`} style={{ height: textZone }} />
      <div className="absolute inset-x-0 top-0 h-px z-10 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className={`relative z-30 h-full min-h-0 ${textPad} flex flex-col justify-end pointer-events-none`}>
        {label && (
          <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] ${cardTheme.label}`}>
            {label}
          </span>
        )}
        {title && (
          <h3 className={`${titleSize} font-bold ${cardTheme.title} tracking-tight mt-0.5 leading-tight`}>
            {title}
          </h3>
        )}
        {subtitle && (
          <p className={`text-[11px] sm:text-xs ${cardTheme.subtitle} mt-0.5 line-clamp-1 font-medium`}>
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </TileWrapper>
  );
}

function productImages(list) {
  return list.map((p) => p?.images?.[0]).filter(Boolean);
}

export default function DashboardHeroGrid({ onSection, onRoute }) {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { theme: siteTheme } = useTheme();
  const cardTheme = getPosterCardTheme(siteTheme);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [recoveryPreview, setRecoveryPreview] = useState(null);

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

  const featured = useMemo(
    () => products.filter((p) => p.isFeatured || p.isBestSeller).slice(0, 4),
    [products]
  );

  const shopHighlights = useMemo(() => getShopHighlightProducts(products), [products]);

  const shopCarouselProducts = useMemo(() => {
    const withImage = products.filter((p) => p?.images?.[0] && p?.slug);
    if (!withImage.length) return [];

    const highlightSlugs = new Set(shopHighlights.map((p) => p.slug));
    const rest = withImage.filter((p) => !highlightSlugs.has(p.slug));
    const ordered = [...shopHighlights, ...rest];

    return ordered.map((product, index) => {
      const isHighlight = highlightSlugs.has(product.slug);
      const image = isHighlight
        ? product.images[0]
        : product.images?.[1] ||
          SHOP_TILE_IMAGES[index % SHOP_TILE_IMAGES.length] ||
          product.images[0];
      return { ...product, images: [image] };
    });
  }, [products, shopHighlights]);

  const shopBottomRow = useMemo(() => {
    const imgs = shopHighlights.map((p) => p.images[0]).filter(Boolean);
    if (imgs.length >= 2) return imgs.slice(0, 2);
    const fallback = [...imgs];
    for (const src of SHOP_TILE_IMAGES) {
      if (fallback.length >= 2) break;
      fallback.push(src);
    }
    return fallback.slice(0, 2);
  }, [shopHighlights]);

  const featuredCollage = useMemo(() => {
    const imgs = productImages(featured);
    return (imgs.length >= 3 ? imgs : productImages(products.slice(0, 3))).slice(0, 3);
  }, [featured, products]);

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

  const categoryCollage = bodyCategories.slice(0, 6).map((c) => c.image);

  const recoverySplit = useMemo(() => {
    if (recoveryPreview?.beforeImage && recoveryPreview?.afterImage) {
      return [recoveryPreview.beforeImage, recoveryPreview.afterImage];
    }
    return ["/products/knee2.png", "/products/shoulder2.png"];
  }, [recoveryPreview]);

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
          label="Explore"
          title="Shop Products"
          subtitle={`${products.length || "—"} medical supports`}
          carousel={shopCarouselProducts}
          onProductClick={(slug) => onRoute(`/product/${slug}`)}
          collage={shopBottomRow}
          gridCols={2}
          gridRows={1}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          depth={0.1}
          onClick={() => onRoute("/shop")}
        />

        <PosterTile
          className="col-span-5 row-start-1"
          size="lg"
          delay={0.18}
          washKey="categories"
          glow={POSTER_GLOW.categories}
          label="Body Parts"
          title="Categories"
          subtitle={`${bodyCategories.length} regions`}
          collage={categoryCollage}
          gridCols={3}
          gridRows={2}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          onClick={() => onRoute("/shop-by-body")}
        />

        <PosterTile
          className="col-span-6 row-start-2"
          size="md"
          delay={0.24}
          washKey="featured"
          glow={POSTER_GLOW.featured}
          label="Curated"
          title="Featured Supports"
          subtitle={`${featured.length} bestsellers`}
          collage={featuredCollage}
          gridCols={3}
          gridRows={1}
          cardTheme={cardTheme}
          siteTheme={siteTheme}
          parallaxX={mx}
          parallaxY={my}
          onClick={() => onRoute("/shop?featured=true")}
        >
          <Star size={15} className={`absolute top-4 right-4 z-30 ${cardTheme.iconStar}`} fill="currentColor" />
        </PosterTile>

        <PosterTile
          className="col-span-6 row-start-2"
          size="md"
          delay={0.3}
          washKey="recommended"
          glow={POSTER_GLOW.recommended}
          label="For You"
          title="Recommended"
          subtitle={recommended[0]?.name || "Personalized picks"}
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
          className="col-span-5 row-start-3"
          size="md"
          delay={0.36}
          washKey="recovery"
          glow={POSTER_GLOW.recovery}
          label="Heal & Inspire"
          title="Recovery Stories"
          subtitle="Before & after journeys"
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
          label="Track"
          title="Orders"
          subtitle={`${orders.length} total`}
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
          label="Saved"
          title="Wishlist"
          subtitle={`${wishlist.length} items`}
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
          label="Deliver To"
          title="Addresses"
          subtitle={`${profile?.addresses?.length || 0} saved`}
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
          label="Account"
          title={user?.name?.split(" ")[0] || "Your Profile"}
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
