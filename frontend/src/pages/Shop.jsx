import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Heart,
  Grid2X2,
  List,
  Star,
  ShoppingCart,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import API from "../api";
import { bodyCategories } from "../data/siteData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  trackCategoryClick,
  trackSearch,
} from "../utils/recommendationBehavior";
import { useTheme } from "../context/ThemeContext";
import {
  productPriceOriginalProps,
  productPriceSaleProps,
} from "../utils/productPriceStyle";
import {
  SectionHeading,
  FadeUpText,
} from "../components/typography/TypographyMotion";
import { BrandPillBadgeRow } from "../components/brand/BrandPillBadge";
import { normalizeSearchQuery } from "../utils/searchNormalizer";
import useDebouncedValue from "../hooks/useDebouncedValue";

const colors = ["Black", "White", "Grey", "Black & Green", "Black & Orange", "Beige", "Silver"];
const sizes = ["S", "M", "L", "XL", "XXL", "UN", "Regular", "Plus", "SM", "LXL"];

function ShopFiltersPanel({
  activeCategory,
  setActiveCategory,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  maxPrice,
  setMaxPrice,
  clearFilters,
  navigate,
  scrollClass = "h-[calc(100%-72px)]",
  onClose,
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className="p-5 border-b flex justify-between items-center gap-3 shrink-0">
        <h2 className="text-xl font-black">{t("shop.filterTitle")}</h2>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={clearFilters} className="text-purple-600 text-sm font-bold">
            {t("common.clearAll")}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-hover lg:hidden"
              aria-label={t("shop.closeFilters")}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      <div className={`${scrollClass} overflow-y-auto custom-scroll overscroll-contain`}>
        <div className="p-5 border-b">
          <div className="flex justify-between font-black text-sm mb-4">
            {t("shop.bodyPart")} <ChevronDown size={16} />
          </div>

          <div className="grid gap-1 max-h-[300px] overflow-auto pr-1">
            <button
              type="button"
              onClick={() => {
                setActiveCategory("");
                setSelectedColor("");
                setSelectedSize("");
                navigate("/shop", { replace: true });
              }}
              className={`text-left px-3 py-2 rounded-xl font-semibold ${
                !activeCategory ? "bg-purple-50 text-purple-700" : "hover:bg-surface-hover"
              }`}
            >
              {t("common.allProducts")}
            </button>

            {bodyCategories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.query);
                  trackCategoryClick(cat.query);
                  navigate(`/shop?category=${encodeURIComponent(cat.query)}`);
                }}
                className={`text-left px-3 py-2 rounded-xl font-semibold ${
                  activeCategory === cat.query ? "bg-purple-50 text-purple-700" : "hover:bg-surface-hover"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 border-b">
          <div className="flex justify-between font-black text-sm mb-4">
            {t("shop.color")} <ChevronDown size={16} />
          </div>

          <div className="grid gap-3">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(selectedColor === color ? "" : color)}
                className={`flex items-center justify-between text-sm rounded-xl px-3 py-2 ${
                  selectedColor === color ? "bg-purple-50 text-purple-700" : "hover:bg-surface-hover"
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-4 h-4 rounded-full border shrink-0"
                    style={{
                      background:
                        color === "Black" ? "#000" :
                        color === "White" ? "#fff" :
                        color === "Grey" ? "#bbb" :
                        color === "Beige" ? "#ead5b7" :
                        color === "Silver" ? "#c0c0c0" : "#111",
                    }}
                  />
                  <span className="truncate">{color}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 border-b">
          <div className="flex justify-between font-black text-sm mb-4">
            {t("shop.size")} <ChevronDown size={16} />
          </div>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                  selectedSize === size
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "hover:border-purple-500 hover:text-purple-600"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between font-black text-sm mb-4">
            {t("shop.price")} <ChevronDown size={16} />
          </div>

          <p className="text-sm mb-3">{t("shop.priceRange", { max: maxPrice })}</p>
          <input
            type="range"
            min="100"
            max="5000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
      </div>
    </>
  );
}

export default function Shop({ embedded = false, initialCategory, onProductSelect }) {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isBlue } = useTheme();

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(
    embedded && initialCategory ? initialCategory : params.get("category") || ""
  );
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sort, setSort] = useState("popularity");
  const [view, setView] = useState("grid");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const displaySearch = params.get("search") || "";
  const debouncedDisplaySearch = useDebouncedValue(displaySearch, 350);
  const { search: apiSearch } = useMemo(
    () => normalizeSearchQuery(debouncedDisplaySearch),
    [debouncedDisplaySearch]
  );

  useEffect(() => {
    if (!embedded) {
      setActiveCategory(params.get("category") || "");
    }
    if (displaySearch) {
      trackSearch(displaySearch);
    }
  }, [params, displaySearch, embedded]);

  useEffect(() => {
    if (embedded && initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [embedded, initialCategory]);

  const goProduct = (slug, name) => {
    if (onProductSelect) {
      onProductSelect(slug, name);
      return;
    }
    navigate(`/product/${slug}`);
  };

  useEffect(() => {
    setLoading(true);

    const query = new URLSearchParams();
    query.set("bodyOnly", "true");

    if (apiSearch) query.set("search", apiSearch);
    if (activeCategory) query.set("category", activeCategory);
    if (selectedColor) query.set("color", selectedColor);
    if (selectedSize) query.set("size", selectedSize);

    API.get(`/products?${query.toString()}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory, selectedColor, selectedSize, apiSearch, debouncedDisplaySearch]);

  useEffect(() => {
    if (!filtersOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => Number(p.discountPrice || p.price || 0) <= maxPrice);

    if (sort === "low") list = [...list].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    if (sort === "high") list = [...list].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [products, sort, maxPrice]);

  const clearFilters = () => {
    setActiveCategory("");
    setSelectedColor("");
    setSelectedSize("");
    setSort("popularity");
    navigate("/shop", { replace: true });
  };

  const filterProps = {
    activeCategory,
    setActiveCategory,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    maxPrice,
    setMaxPrice,
    clearFilters,
    navigate,
  };

  return (
    <main className={`bg-[#f7f8fb] bg-app dark:bg-zinc-950 transition-colors duration-300 overflow-x-clip ${embedded ? "min-h-0" : "min-h-screen"}`}>
      <div className={`max-w-[1500px] mx-auto px-4 sm:px-5 min-w-0 ${embedded ? "py-4" : "py-4 sm:py-8"}`}>
        {!embedded && (
        <div className="text-xs sm:text-sm text-fg-muted mb-3 sm:mb-6 break-words">
          {t("common.home")} <span className="mx-2">›</span> {t("shop.breadcrumb")}
        </div>
        )}

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 min-w-0">
          <aside className="hidden lg:block bg-card rounded-[18px] shadow-[0_10px_35px_rgba(15,23,42,0.08)] lg:sticky lg:top-24 lg:h-[calc(100vh-110px)] overflow-hidden min-w-0">
            <ShopFiltersPanel {...filterProps} />
          </aside>

          <section className="min-w-0">
            <div className="shop-page-toolbar flex flex-col md:flex-row justify-between gap-3 sm:gap-5 mb-4 sm:mb-7 min-w-0">
              <div className="min-w-0">
                <BrandPillBadgeRow className="mb-1 sm:mb-1.5" />
                {displaySearch && (
                  <p className="text-xs sm:text-sm font-semibold text-brand mb-1.5 sm:mb-2">
                    {t("shop.resultsFor")}{" "}
                    <span className="text-fg font-black">&ldquo;{displaySearch}&rdquo;</span>
                  </p>
                )}
                <div className="flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2 gap-y-0.5">
                  <SectionHeading
                    text={t("common.allProducts")}
                    as="h1"
                    className="typo-page-title leading-tight"
                  />
                  <span className="text-fg-muted/80 text-base sm:text-2xl font-black">
                    ({filteredProducts.length})
                  </span>
                </div>
                <FadeUpText className="text-fg-muted mt-1 sm:mt-2 text-xs sm:text-base">
                  {t("shop.exploreRange")}
                </FadeUpText>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-0">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 bg-card border rounded-lg px-2.5 py-1.5 text-xs font-bold shrink-0 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
                  {t("shop.filters")}
                </button>

                <label className="hidden sm:inline text-xs sm:text-sm font-semibold shrink-0">{t("shop.sortBy")}</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-card border rounded-lg px-2 py-1.5 text-xs outline-none min-w-[5.5rem] flex-1 sm:flex-none sm:min-w-0 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                >
                  <option value="popularity">{t("shop.sortPopularity")}</option>
                  <option value="low">{t("shop.sortLow")}</option>
                  <option value="high">{t("shop.sortHigh")}</option>
                  <option value="name">{t("shop.sortName")}</option>
                </select>

                <div className="bg-card border rounded-lg p-0.5 flex shrink-0 sm:rounded-xl sm:p-1">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={`p-1.5 rounded-md sm:p-3 sm:rounded-lg ${view === "grid" ? "bg-purple-100 text-purple-700" : ""}`}
                    aria-label={t("shop.gridView")}
                  >
                    <Grid2X2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`p-1.5 rounded-md sm:p-3 sm:rounded-lg ${view === "list" ? "bg-purple-100 text-purple-700" : ""}`}
                    aria-label={t("shop.listView")}
                  >
                    <List className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="catalog-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((x) => (
                  <div key={x} className="h-[280px] sm:h-[380px] lg:h-[430px] bg-card rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-card rounded-2xl p-8 sm:p-12 text-center shadow">
                <h2 className="typo-section-subtitle">{t("shop.noProducts")}</h2>
                <p className="text-fg-muted mt-2">{t("shop.noProductsHint")}</p>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "catalog-grid"
                    : "grid gap-5"
                }
              >
                {filteredProducts.map((product) => {
                  const price = product.price || 0;
                  const discountPrice = product.discountPrice || product.price || 0;
                  const save = price && discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

                  return (
                    <article
                      key={product._id}
                      className={`group relative bg-card rounded-[18px] overflow-hidden shadow-[0_12px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition ${
                        view === "list" ? "flex flex-col sm:flex-row" : ""
                      }`}
                    >
                      {onProductSelect ? (
                        <button
                          type="button"
                          onClick={() => goProduct(product.slug, product.name)}
                          className={`relative bg-card block shrink-0 text-left w-full shop-catalog-card__image ${
                            view === "list" ? "w-full sm:w-72 h-64 sm:h-72" : ""
                          }`}
                        >
                          {save > 0 && (
                            <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-black px-3 py-2 rounded">
                              {t("common.savePercent", { percent: save })}
                            </span>
                          )}

                          <span className="absolute top-14 left-4 bg-card shadow text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                            <Star size={13} fill="#fbbf24" className="text-yellow-400" />
                            {product.rating || 4.8}
                          </span>

                          <img
                            src={product.images?.[0] || product.image || "/products/knee.png"}
                            onError={(e) => {
                              e.currentTarget.src = "/products/knee.png";
                            }}
                            className="w-full h-full object-contain p-5 group-hover:scale-105 transition duration-500"
                            alt={product.name}
                          />
                        </button>
                      ) : (
                      <Link
                        to={`/product/${product.slug}`}
                        className={`relative bg-card block shrink-0 shop-catalog-card__image ${
                          view === "list" ? "w-full sm:w-72 h-64 sm:h-72" : ""
                        }`}
                      >
                        {save > 0 && (
                          <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-black px-3 py-2 rounded">
                            {t("common.savePercent", { percent: save })}
                          </span>
                        )}

                        <span className="absolute top-14 left-4 bg-card shadow text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <Star size={13} fill="#fbbf24" className="text-yellow-400" />
                          {product.rating || 4.8}
                        </span>

                        <img
                          src={product.images?.[0] || product.image || "/products/knee.png"}
                          onError={(e) => {
                            e.currentTarget.src = "/products/knee.png";
                          }}
                          className="w-full h-full object-contain p-5 group-hover:scale-105 transition duration-500"
                          alt={product.name}
                        />
                      </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-4 right-4 w-10 h-10 bg-card rounded-full shadow grid place-items-center z-10 ${
                          isWishlisted(product) ? "text-red-500" : "text-purple-600"
                        }`}
                        aria-label={t("shop.toggleWishlist")}
                      >
                        <Heart size={18} fill={isWishlisted(product) ? "currentColor" : "none"} />
                      </button>

                      <div className="shop-catalog-card__body p-5 flex-1 min-w-0">
                        {onProductSelect ? (
                          <button
                            type="button"
                            onClick={() => goProduct(product.slug, product.name)}
                            className="text-left w-full"
                          >
                            <h3 className="shop-catalog-card__title font-black line-clamp-2 hover:text-purple-600 transition break-words">
                              {product.name}
                            </h3>
                          </button>
                        ) : (
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="shop-catalog-card__title font-black line-clamp-2 hover:text-purple-600 transition break-words">
                            {product.name}
                          </h3>
                        </Link>
                        )}

                        <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
                          <span {...productPriceSaleProps(isBlue, "text-xl font-black")}>
                            ₹{discountPrice}.00
                          </span>
                          {price > discountPrice && (
                            <span
                              {...productPriceOriginalProps(
                                isBlue,
                                "text-fg-muted/80 line-through"
                              )}
                            >
                              ₹{price}.00
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-fg-muted mt-1">{t("common.inclTaxes")}</p>

                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="mt-5 w-full border border-purple-500 text-purple-600 rounded-lg py-3 font-black hover:bg-purple-600 hover:text-white transition flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={18} /> {t("common.addToCart")}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-[110]">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label={t("shop.closeFilters")}
            onClick={() => setFiltersOpen(false)}
          />
          <aside className="shop-filter-drawer overlay-drawer-panel absolute left-0 top-0 bottom-0 bg-white dark:bg-slate-950 shadow-2xl flex flex-col overflow-hidden border-r border-edge">
            <ShopFiltersPanel {...filterProps} scrollClass="flex-1" onClose={() => setFiltersOpen(false)} />
          </aside>
        </div>
      )}
    </main>
  );
}
