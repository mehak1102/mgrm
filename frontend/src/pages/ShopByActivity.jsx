import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Heart,
  Grid2X2,
  List,
  Star,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import API from "../api";
import { activities } from "../data/siteData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import { useTheme } from "../context/ThemeContext";
import {
  productPriceOriginalProps,
  productPriceSaleProps,
} from "../utils/productPriceStyle";
import { BrandPillBadgeRow } from "../components/brand/BrandPillBadge";

const colors = [
  "Black",
  "White",
  "Grey",
  "Black & Green",
  "Black & Orange",
  "Beige",
  "Silver",
];

const sizes = ["S", "M", "L", "XL", "XXL", "UN", "Regular", "Plus", "SM", "LXL"];

export default function ShopByActivity() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isBlue } = useTheme();

  const [products, setProducts] = useState([]);
  const [activeActivity, setActiveActivity] = useState(params.get("activity") || "");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sort, setSort] = useState("popularity");
  const [view, setView] = useState("grid");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveActivity(params.get("activity") || "");
  }, [params]);

  useEffect(() => {
    setLoading(true);

    const query = new URLSearchParams();

    if (activeActivity) {
      query.set("activity", activeActivity);
    } else {
      query.set("activityOnly", "true");
    }

    if (selectedColor) query.set("color", selectedColor);
    if (selectedSize) query.set("size", selectedSize);

    API.get(`/products?${query.toString()}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeActivity, selectedColor, selectedSize]);

  const filteredProducts = useMemo(() => {
    let list = products.filter(
      (p) => Number(p.discountPrice || p.price || 0) <= maxPrice
    );

    if (sort === "low") {
      list = [...list].sort(
        (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
      );
    }

    if (sort === "high") {
      list = [...list].sort(
        (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
      );
    }

    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, sort, maxPrice]);

  const selectActivity = (name) => {
    setActiveActivity(name);
    setParams(name ? { activity: name } : {});
  };

  const clearFilters = () => {
    setActiveActivity("");
    setSelectedColor("");
    setSelectedSize("");
    setMaxPrice(5000);
    setParams({});
  };

  return (
    <main className="bg-[#f7f8fb] bg-app min-h-screen">
      <FloatingMedicalBg />
      <div className="max-w-[1500px] mx-auto px-5 py-8">
        <div className="text-sm text-fg-muted mb-6">
          {t("common.home")} <span className="mx-2">›</span> {t("shopByActivity.breadcrumb")}
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="bg-card rounded-[18px] shadow-[0_10px_35px_rgba(15,23,42,0.08)] h-fit sticky top-24">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-xl font-black">{t("shop.filterTitle")}</h2>
              <button type="button" onClick={clearFilters} className="text-purple-600 text-sm font-bold">
                {t("common.clearAll")}
              </button>
            </div>

            <div className="p-5 border-b">
              <div className="flex justify-between font-black text-sm mb-4">
                {t("shopByActivity.activity")} <ChevronDown size={16} />
              </div>

              <div className="grid gap-1 max-h-[300px] overflow-auto pr-1">
                <button
                  type="button"
                  onClick={() => selectActivity("")}
                  className={`text-left px-3 py-2 rounded-xl font-semibold ${
                    !activeActivity ? "bg-purple-50 text-purple-700" : "hover:bg-surface-hover"
                  }`}
                >
                  {t("shopByActivity.allActivity")}
                </button>

                {activities.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => selectActivity(item.name)}
                    className={`text-left px-3 py-2 rounded-xl font-semibold ${
                      activeActivity === item.name
                        ? "bg-purple-50 text-purple-700"
                        : "hover:bg-surface-hover"
                    }`}
                  >
                    {item.name}
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
                    onClick={() =>
                      setSelectedColor(selectedColor === color ? "" : color)
                    }
                    className={`flex items-center justify-between text-sm rounded-xl px-3 py-2 ${
                      selectedColor === color
                        ? "bg-purple-50 text-purple-700"
                        : "hover:bg-surface-hover"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{
                          background:
                            color === "Black"
                              ? "#000"
                              : color === "White"
                              ? "#fff"
                              : color === "Grey"
                              ? "#bbb"
                              : color === "Beige"
                              ? "#ead5b7"
                              : color === "Silver"
                              ? "#c0c0c0"
                              : "#111",
                        }}
                      />
                      {color}
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
                    onClick={() =>
                      setSelectedSize(selectedSize === size ? "" : size)
                    }
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
          </aside>

          <section>
            <div className="flex flex-col md:flex-row justify-between gap-5 mb-7">
              <div>
                <BrandPillBadgeRow className="mb-1.5" />
                <h1 className="text-4xl font-black">
                  {t("shopByActivity.title")}{" "}
                  <span className="text-fg-muted/80 text-2xl">
                    ({filteredProducts.length})
                  </span>
                </h1>
                <p className="text-fg-muted mt-2">
                  {activeActivity
                    ? t("shopByActivity.recommendedFor", { activity: activeActivity })
                    : t("shopByActivity.showAllOnly")}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold">{t("shop.sortBy")}</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-card border rounded-xl px-4 py-3 outline-none"
                >
                  <option value="popularity">{t("shop.sortPopularity")}</option>
                  <option value="low">{t("shop.sortLow")}</option>
                  <option value="high">{t("shop.sortHigh")}</option>
                  <option value="name">{t("shop.sortName")}</option>
                </select>

                <div className="bg-card border rounded-xl p-1 flex">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={`p-3 rounded-lg ${
                      view === "grid" ? "bg-purple-100 text-purple-700" : ""
                    }`}
                    aria-label={t("shop.gridView")}
                  >
                    <Grid2X2 size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`p-3 rounded-lg ${
                      view === "list" ? "bg-purple-100 text-purple-700" : ""
                    }`}
                    aria-label={t("shop.listView")}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((x) => (
                  <div key={x} className="h-[430px] bg-card rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-card rounded-2xl p-12 text-center shadow">
                <h2 className="text-3xl font-black">{t("shopByActivity.noProducts")}</h2>
                <p className="text-fg-muted mt-2">
                  {t("shopByActivity.emptyHint")}
                </p>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid md:grid-cols-2 xl:grid-cols-4 gap-7"
                    : "grid gap-5"
                }
              >
                {filteredProducts.map((product) => {
                  const price = Number(product.price || 0);
                  const discountPrice = Number(product.discountPrice || product.price || 0);
                  const save =
                    price && discountPrice
                      ? Math.round(((price - discountPrice) / price) * 100)
                      : 0;

                  return (
                    <article
                      key={product._id}
                      className={`relative group bg-card rounded-[18px] overflow-hidden shadow-[0_12px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition ${
                        view === "list" ? "flex" : ""
                      }`}
                    >
                      <Link
                        to={`/product/${product.slug}`}
                        className={`relative bg-card block ${
                          view === "list" ? "w-72 h-72" : "h-72"
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
                          onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                          className="w-full h-full object-contain p-5 group-hover:scale-105 transition duration-500"
                          alt={product.name}
                        />
                      </Link>

                      <button
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-4 right-4 w-10 h-10 bg-card rounded-full shadow grid place-items-center ${
                          isWishlisted(product) ? "text-red-500" : "text-purple-600"
                        }`}
                        aria-label={t("shop.toggleWishlist")}
                      >
                        <Heart
                          size={18}
                          fill={isWishlisted(product) ? "currentColor" : "none"}
                        />
                      </button>

                      <div className="p-5 flex-1">
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="font-black line-clamp-2 hover:text-purple-600 transition">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-xs text-fg-muted mt-1">
                          {product.activity || t("shopByActivity.activitySupport")}
                        </p>

                        <div className="mt-3">
                          <span {...productPriceSaleProps(isBlue, "text-xl font-black")}>
                            ₹{discountPrice}.00
                          </span>
                          {price > discountPrice && (
                            <span
                              {...productPriceOriginalProps(
                                isBlue,
                                "text-fg-muted/80 line-through ml-2"
                              )}
                            >
                              ₹{price}.00
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-fg-muted mt-1">
                          {t("common.inclTaxes")}
                        </p>

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
    </main>
  );
}
